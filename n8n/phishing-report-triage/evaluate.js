// n8n Code node: Run Once for All Items. Triages user-reported phishing summaries from supplied header text and URL strings; never fetches URLs, opens attachments, blocks senders, or sends mail.
const items = $input.all();
const text = value => typeof value === 'string' && value.trim().length > 0;
const date = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const valueMs = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString().slice(0, 10) === value ? valueMs : null;
};
const timestamp = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$/.test(value) && date(value.slice(0, 10)) !== null;
const unique = values => new Set(values).size === values.length;
const stringArray = values => Array.isArray(values) && values.every(text);
const lower = value => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const optional = value => (value === undefined || value === null ? '' : value);
const AUTH_VALUES = ['pass', 'fail', 'softfail', 'neutral', 'none', 'temperror', 'permerror', 'policy'];
const EXECUTABLE_EXTENSIONS = ['exe', 'js', 'vbs', 'scr', 'bat', 'cmd', 'hta', 'iso', 'img', 'docm', 'xlsm', 'pptm', 'lnk'];
const ARCHIVE_EXTENSIONS = ['zip', '7z', 'rar'];
const INTERNAL_ROLE_WORDS = ['it', 'payroll', 'hr', 'ceo'];
const INFORMATIONAL = new Set(['sender_allowlisted', 'url_org_domain']);
const UNDETERMINED = new Set(['authentication_results_missing', 'reporter_unknown', 'sender_not_allowlisted', 'dmarc_not_pass']);
const MALICIOUS = new Set(['dmarc_fail', 'lookalike_domain', 'url_credential_in_userinfo', 'url_lookalike_host', 'attachment_executable_or_macro']);
const ACTIONS = {
  malicious_likely: ['block_sender_domain', 'purge_similar_messages', 'reset_credentials_if_entered', 'escalate_to_security_owner'],
  suspicious: ['hold_for_analyst_review', 'reset_credentials_if_entered'],
  undetermined: ['request_original_message_headers', 'hold_for_analyst_review'],
  likely_legitimate: ['no_action']
};
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const domainOf = address => { const at = address.lastIndexOf('@'); return at >= 0 && at < address.length - 1 ? address.slice(at + 1) : null; };
const parseMailbox = header => {
  const raw = typeof header === 'string' ? header.trim() : '';
  if (!raw) return { displayName: '', address: null, domain: null };
  const angle = raw.match(/^(.*?)<([^<>]*)>\s*$/);
  const displayName = angle ? angle[1].trim().replace(/^"(.*)"$/, '$1').trim() : '';
  const address = lower(angle ? angle[2] : raw);
  return { displayName, address: address || null, domain: address ? domainOf(address) : null };
};
const registrableLabel = domain => { const labels = domain.split('.'); return labels.length >= 2 ? labels[labels.length - 2] : labels[0]; };
const underDomain = (host, domain) => host === domain || host.endsWith(`.${domain}`);
const relaxedAligned = (signer, domain) => signer !== null && domain !== null && (underDomain(signer, domain) || underDomain(domain, signer));
const levenshtein = (a, b) => {
  let previous = Array.from({ length: b.length + 1 }, (_, column) => column);
  for (let row = 1; row <= a.length; row++) {
    const current = [row];
    for (let column = 1; column <= b.length; column++) {
      current[column] = Math.min(previous[column] + 1, current[column - 1] + 1, previous[column - 1] + (a[row - 1] === b[column - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[b.length];
};
const unswap = label => label.replace(/rn/g, 'm').replace(/0/g, 'o').replace(/1/g, 'l');
const lookalikeMatches = (domain, references) => {
  const matches = [];
  const label = registrableLabel(domain);
  for (const reference of references) {
    if (underDomain(domain, reference)) continue;
    const referenceLabel = registrableLabel(reference);
    if (label === referenceLabel) { matches.push({ reference, rule: 'same_label_different_suffix' }); continue; }
    const distance = levenshtein(label, referenceLabel);
    if (distance <= 2) matches.push({ reference, rule: 'edit_distance_1_or_2' });
    else if (unswap(label) === unswap(referenceLabel)) matches.push({ reference, rule: 'digit_or_glyph_substitution' });
    else if (label.startsWith(`${referenceLabel}-`) || label.endsWith(`-${referenceLabel}`) || label.includes(`-${referenceLabel}-`)) matches.push({ reference, rule: 'added_hyphenated_word' });
  }
  return matches;
};
const parseAuthentication = header => {
  const raw = typeof header === 'string' ? header.trim() : '';
  const result = { present: raw.length > 0, authservId: null, spf: 'unknown', dkim: 'unknown', dmarc: 'unknown', spfDomain: null, dkimDomain: null, headerFrom: null, dkimAligned: false };
  if (!result.present) return result;
  const parts = raw.replace(/\([^)]*\)/g, ' ').split(';').map(part => part.trim()).filter(Boolean);
  result.authservId = lower(parts[0].split(/\s+/)[0]) || null;
  for (const part of parts.slice(1)) {
    const tokens = part.split(/\s+/);
    const [method, value] = tokens[0].split('=');
    const name = lower(method);
    if (!['spf', 'dkim', 'dmarc'].includes(name) || result[name] !== 'unknown') continue;
    result[name] = AUTH_VALUES.includes(lower(value)) ? lower(value) : 'unknown';
    for (const token of tokens.slice(1)) {
      const [key, property] = token.split('=');
      const propertyValue = lower(property);
      if (!propertyValue) continue;
      if (name === 'spf' && lower(key) === 'smtp.mailfrom') result.spfDomain = domainOf(propertyValue) ?? propertyValue;
      if (name === 'dkim' && lower(key) === 'header.d') result.dkimDomain = propertyValue;
      if (name === 'dmarc' && lower(key) === 'header.from') result.headerFrom = domainOf(propertyValue) ?? propertyValue;
    }
  }
  return result;
};
const percentDecode = value => {
  let current = value;
  let rounds = 0;
  for (let round = 0; round < 3; round++) {
    if (!/%[0-9a-fA-F]{2}/.test(current)) break;
    let next;
    try { next = decodeURIComponent(current); } catch (error) { break; }
    if (next === current) break;
    current = next;
    rounds += 1;
  }
  return { value: current, rounds };
};
const base64Decode = value => {
  const clean = value.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');
  if (!/^[A-Za-z0-9+/]*$/.test(clean) || clean.length % 4 === 1) return null;
  let bits = 0;
  let buffer = 0;
  let out = '';
  for (const character of clean) {
    buffer = (buffer << 6) | B64.indexOf(character);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out += String.fromCharCode((buffer >> bits) & 0xff);
      buffer &= (1 << bits) - 1;
    }
  }
  return out;
};
const normalizeUrl = raw => raw.trim().replace(/^hxxp(s?)(?=[:[])/i, 'http$1').replace(/\[:\]/g, ':').replace(/\[\.\]/g, '.');
const evaluateUrl = (raw, context, depth) => {
  const normalized = normalizeUrl(raw);
  const row = { raw, normalized, scheme: null, host: null, path: null, query: [], findings: [], lookalikeMatches: [], redirectTarget: null, base64Decoded: null, classification: 'suspicious' };
  const match = normalized.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/\/([^/?#]*)([^?#]*)(?:\?([^#]*))?(?:#.*)?$/);
  if (!match) { row.findings.push('url_unparseable'); return row; }
  row.scheme = match[1].toLowerCase();
  let authority = match[2];
  if (authority.includes('@')) { row.findings.push('url_credential_in_userinfo'); authority = authority.slice(authority.lastIndexOf('@') + 1); }
  const decodedAuthority = percentDecode(authority).value.toLowerCase();
  const host = decodedAuthority.startsWith('[') ? decodedAuthority.slice(0, decodedAuthority.indexOf(']') + 1) : decodedAuthority.split(':')[0];
  if (!host) { row.findings.push('url_unparseable'); return row; }
  row.host = host;
  row.path = percentDecode(match[3] || '/').value;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[')) row.findings.push('url_host_is_ip');
  if (context.shorteners.includes(host)) row.findings.push('url_shortener');
  const orgHit = context.orgDomains.some(domain => underDomain(host, domain));
  const allowHit = context.allowlisted.some(domain => underDomain(host, domain));
  if (!orgHit && !allowHit) {
    row.lookalikeMatches = lookalikeMatches(host, context.references);
    if (row.lookalikeMatches.length) row.findings.push('url_lookalike_host');
  }
  for (const pair of (match[4] || '').split('&').filter(Boolean)) {
    const separator = pair.indexOf('=');
    const key = percentDecode(separator >= 0 ? pair.slice(0, separator) : pair).value;
    const rawValue = separator >= 0 ? pair.slice(separator + 1) : '';
    const decoded = percentDecode(rawValue);
    row.query.push({ key, value: rawValue, decodedValue: decoded.value, decodeRounds: decoded.rounds });
    if (/^https?:\/\//i.test(decoded.value)) {
      row.findings.push('url_redirect_parameter');
      if (depth === 0 && row.redirectTarget === null) {
        row.redirectTarget = evaluateUrl(decoded.value, context, 1);
        for (const finding of row.redirectTarget.findings) if (!INFORMATIONAL.has(finding)) row.findings.push(finding);
      }
    }
    if (decoded.value.length >= 16 && /^[A-Za-z0-9+/_-]+={0,2}$/.test(decoded.value)) {
      const decodedText = base64Decode(decoded.value);
      if (decodedText !== null && /^[\x20-\x7e]+$/.test(decodedText) && /http|@/i.test(decodedText)) {
        row.findings.push('url_base64_parameter');
        if (row.base64Decoded === null) row.base64Decoded = decodedText.slice(0, 80);
      }
    }
  }
  if (row.scheme !== 'https') row.findings.push('url_non_https');
  if (orgHit) row.findings.push('url_org_domain');
  row.findings = [...new Set(row.findings)];
  const actionable = row.findings.some(finding => !INFORMATIONAL.has(finding));
  row.classification = actionable ? 'suspicious' : orgHit ? 'internal' : allowHit ? 'allowlisted' : 'external_unclassified';
  return row;
};
const responseToReporter = (row, ownerRole) => {
  const lines = [`To the reporter (${row.reporterRole ?? 'role not recorded'}):`, '', `Thank you for reporting the message "${row.subject}" from ${row.sender.address ?? 'an unparseable sender address'}.`];
  if (row.verdict === 'malicious_likely') {
    lines.push('Our rule-based triage rates this message as likely malicious.', `What happens next: the ${ownerRole} will block the sender, remove similar messages, and confirm the outcome with you.`, 'What you should do: do not click any link or open any attachment from this message. If you entered a password or other credentials, contact the service desk now so they can be reset.');
  } else if (row.verdict === 'suspicious') {
    lines.push('Our rule-based triage rates this message as suspicious. It has indicators that need a human check.', `What happens next: the ${ownerRole} will review the message and confirm the outcome with you.`, 'What you should do: do not click links or open attachments until you hear back. If you already entered credentials, contact the service desk now.');
  } else if (row.verdict === 'undetermined') {
    lines.push('Our rule-based triage could not determine whether this message is legitimate. Key evidence is missing.', `What happens next: the ${ownerRole} may ask you for the original message so the full headers can be checked.`, 'What you should do: leave the message unopened until you hear back.');
  } else {
    lines.push('The message appears legitimate based on the checks we can run.', 'What happens next: no further action is planned.', 'What you should do: still verify any unexpected payment or banking change request by phone, using a number you already have.');
  }
  lines.push('', 'This verdict is a triage aid for a human reviewer, not a final determination.');
  return lines.join('\n');
};
const evaluateReport = (report, context) => {
  const findings = [];
  const from = parseMailbox(report.fromHeader);
  const replyTo = parseMailbox(optional(report.replyTo));
  const returnPath = parseMailbox(optional(report.returnPath));
  const reporterRole = text(report.reporterRole) ? report.reporterRole.trim() : null;
  if (reporterRole === null) findings.push('reporter_unknown');
  if (from.domain === null) findings.push('from_address_unparseable');
  const orgDomain = from.domain !== null && context.orgDomains.some(domain => underDomain(from.domain, domain));
  const allowlisted = from.domain !== null && context.allowlisted.includes(from.domain);
  if (allowlisted) findings.push('sender_allowlisted');
  else if (!orgDomain) findings.push('sender_not_allowlisted');
  if (replyTo.domain !== null && replyTo.domain !== from.domain) findings.push('reply_to_domain_differs');
  if (returnPath.domain !== null && returnPath.domain !== from.domain) findings.push('return_path_domain_differs');
  const displayName = from.displayName.toLowerCase();
  const internalWords = context.orgLabels.some(label => displayName.includes(label)) || INTERNAL_ROLE_WORDS.some(word => new RegExp(`(^|[^a-z])${word}([^a-z]|$)`).test(displayName));
  if (internalWords && !orgDomain && !allowlisted) findings.push('display_name_impersonates_internal');
  const authentication = parseAuthentication(optional(report.authenticationResultsHeader));
  authentication.dkimAligned = authentication.dkim === 'pass' && relaxedAligned(authentication.dkimDomain, from.domain);
  if (!authentication.present) findings.push('authentication_results_missing');
  else {
    if (authentication.dmarc === 'fail') findings.push('dmarc_fail');
    else if (authentication.dmarc === 'unknown') findings.push('dmarc_missing');
    else if (authentication.dmarc !== 'pass') findings.push('dmarc_not_pass');
    if (authentication.spf !== 'pass') findings.push('spf_not_pass');
    if (authentication.dkim !== 'pass') findings.push('dkim_not_pass');
    if (authentication.dkimDomain !== null && !relaxedAligned(authentication.dkimDomain, from.domain)) findings.push('dkim_domain_not_aligned');
  }
  const senderLookalike = from.domain !== null && !orgDomain && !allowlisted ? lookalikeMatches(from.domain, context.references) : [];
  if (senderLookalike.length) findings.push('lookalike_domain');
  const urls = report.urls.map(url => evaluateUrl(url, context, 0));
  for (const url of urls) for (const finding of url.findings) if (!INFORMATIONAL.has(finding)) findings.push(finding);
  const attachments = report.attachments.map(attachment => {
    const extension = lower(attachment.extension).replace(/^\./, '');
    const attachmentFindings = [];
    if (EXECUTABLE_EXTENSIONS.includes(extension)) attachmentFindings.push('attachment_executable_or_macro');
    if (ARCHIVE_EXTENSIONS.includes(extension)) attachmentFindings.push('attachment_archive');
    return { name: attachment.name, extension: extension || null, findings: attachmentFindings };
  });
  for (const attachment of attachments) findings.push(...attachment.findings);
  const uniqueFindings = [...new Set(findings)];
  const malicious = uniqueFindings.filter(finding => MALICIOUS.has(finding));
  const suspicious = uniqueFindings.filter(finding => !MALICIOUS.has(finding) && !INFORMATIONAL.has(finding) && !UNDETERMINED.has(finding));
  const undetermined = uniqueFindings.filter(finding => UNDETERMINED.has(finding));
  const urlFindings = urls.some(url => url.findings.some(finding => !INFORMATIONAL.has(finding)));
  let verdict;
  let verdictBasis;
  if (malicious.length) { verdict = 'malicious_likely'; verdictBasis = malicious; }
  else if (suspicious.length) { verdict = 'suspicious'; verdictBasis = suspicious; }
  else if (undetermined.length) { verdict = 'undetermined'; verdictBasis = undetermined; }
  else if (allowlisted && authentication.dmarc === 'pass' && authentication.dkimAligned && !urlFindings) { verdict = 'likely_legitimate'; verdictBasis = ['sender_allowlisted', 'dmarc_pass', 'dkim_aligned', 'no_url_findings', 'reply_to_consistent']; }
  else {
    verdict = 'undetermined';
    verdictBasis = [];
    if (!allowlisted) verdictBasis.push('sender_not_allowlisted');
    if (authentication.dmarc !== 'pass') verdictBasis.push('dmarc_not_pass');
    if (!authentication.dkimAligned) verdictBasis.push('dkim_not_aligned');
  }
  const ownerRole = verdict === 'malicious_likely' ? context.routing.malicious : context.routing.other;
  const row = {
    reportId: report.reportId, reportedAt: report.reportedAt, reporterRole, subject: optional(report.subject),
    sender: { displayName: from.displayName, address: from.address, domain: from.domain, replyToDomain: replyTo.domain, returnPathDomain: returnPath.domain, orgDomain, allowlisted, lookalikeMatches: senderLookalike },
    authentication, findings: uniqueFindings, urls, attachments,
    verdict, verdictBasis, confidence: 'rule_based', ownerRole, recommendedActions: ACTIONS[verdict], responseToReporter: ''
  };
  row.responseToReporter = responseToReporter(row, ownerRole);
  return row;
};

if (!items.length) return [{ json: { status: 'invalid_input', issues: ['No phishing report packets supplied.'] } }];

return items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  if (!text(input.reviewId)) issues.push('reviewId must be a nonblank string.');
  if (date(input.asOf) === null) issues.push('asOf must be a real YYYY-MM-DD date.');
  if (typeof input.snapshotComplete !== 'boolean') issues.push('snapshotComplete must be a boolean.');
  if (!stringArray(input.organizationDomains) || !input.organizationDomains.length) issues.push('organizationDomains must be a nonempty array of domain strings.');
  if (!stringArray(input.allowlistedSenderDomains)) issues.push('allowlistedSenderDomains must be an array of domain strings.');
  if (!stringArray(input.knownUrlShorteners)) issues.push('knownUrlShorteners must be an array of hostname strings.');
  if (!input.routing || typeof input.routing !== 'object' || !text(input.routing.malicious) || !text(input.routing.other)) issues.push('routing must supply nonblank malicious and other owner roles.');
  if (!Array.isArray(input.reports)) issues.push('reports must be an array.');
  else {
    if (!unique(input.reports.map(report => report?.reportId))) issues.push('Duplicate reportIds make triage ambiguous.');
    for (const [row, report] of input.reports.entries()) {
      if (!report || typeof report !== 'object' || !text(report.reportId) || !text(report.fromHeader)) { issues.push(`reports[${row}] needs reportId and fromHeader.`); continue; }
      if (!timestamp(report.reportedAt)) issues.push(`reports[${row}].reportedAt must be an ISO UTC timestamp ending in Z.`);
      for (const field of ['reporterRole', 'subject', 'replyTo', 'returnPath', 'authenticationResultsHeader']) {
        if (report[field] !== undefined && report[field] !== null && typeof report[field] !== 'string') issues.push(`reports[${row}].${field} must be a string when supplied.`);
      }
      if (!Array.isArray(report.urls) || report.urls.some(url => typeof url !== 'string')) issues.push(`reports[${row}].urls must be an array of strings.`);
      if (!Array.isArray(report.attachments) || report.attachments.some(attachment => !attachment || typeof attachment.name !== 'string' || typeof attachment.extension !== 'string')) issues.push(`reports[${row}].attachments must be an array of { name, extension } strings.`);
    }
  }
  if (issues.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues }, pairedItem: { item: index } };

  if (!input.snapshotComplete) issues.push('Report snapshot is incomplete; reconcile it with the reporting mailbox before acting.');
  if (!text(input.evidenceRef)) issues.push('Missing report snapshot evidence reference.');
  if (!input.reports.length) issues.push('Empty report scope requires confirmation.');
  const orgDomains = input.organizationDomains.map(lower);
  const allowlisted = input.allowlistedSenderDomains.map(lower);
  const context = {
    orgDomains, allowlisted, shorteners: input.knownUrlShorteners.map(lower),
    references: [...new Set([...orgDomains, ...allowlisted])],
    orgLabels: [...new Set(orgDomains.flatMap(domain => { const label = registrableLabel(domain); return [label, ...label.split('-')]; }))].filter(Boolean),
    routing: { malicious: input.routing.malicious.trim(), other: input.routing.other.trim() }
  };
  const rows = input.reports.map(report => evaluateReport(report, context));
  const countVerdict = verdict => rows.filter(row => row.verdict === verdict).length;
  const counts = {
    reports: rows.length, maliciousLikely: countVerdict('malicious_likely'), suspicious: countVerdict('suspicious'),
    undetermined: countVerdict('undetermined'), likelyLegitimate: countVerdict('likely_legitimate'),
    urlsChecked: rows.reduce((sum, row) => sum + row.urls.length, 0),
    urlsSuspicious: rows.reduce((sum, row) => sum + row.urls.filter(url => url.classification === 'suspicious').length, 0)
  };
  const allLegitimate = rows.length > 0 && counts.likelyLegitimate === rows.length;
  return {
    json: {
      reviewId: input.reviewId, asOf: input.asOf, status: issues.length || !allLegitimate ? 'needs_review' : 'review_ready',
      issues, counts, rows, evidenceRef: text(input.evidenceRef) ? input.evidenceRef : null,
      limitation: 'Reads the supplied header text, sender fields, URL strings, and attachment names only. It cannot detect a forged Authentication-Results header added before the organization gateway, never fetches URLs or opens attachments, and applies lookalike heuristics that can miss or over-flag domains. Verdicts are rule-based triage aids for a human reviewer, not a determination.'
    }, pairedItem: { item: index }
  };
});
