# Agent security: an offline control lab

Can a useful assistant stay within its approved scope when a document asks it to do something else, an approval changes, or a tool times out after a possible effect?

This small lab makes those questions inspectable. It runs **scripted tool proposals through deterministic controls and mock destinations**. It does not call a model, provider, MCP server, tenant, or network tool. A passed case demonstrates the behavior of this fixture and code; it does not establish that a model resists prompt injection or that a production workflow is safe.

Research reviewed **September 19, 2026**. The cases apply the [evaluation playbook](../../cyber-risk/ai/evaluation-playbook.md) and [research acceptance record](../../research/companions/05-acceptance-and-recovery-record.md). The source notes below explain what informed the design.

## Run it

Use Node.js 22 or later. No packages, API keys, containers, accounts, or configuration are required. Run from the repository root:

```sh
node labs/agent-security/run.mjs list
node labs/agent-security/run.mjs all
node labs/agent-security/run.mjs timeout-after-effect --json
node --test labs/agent-security/tests/*.test.mjs
```

The first command lists the questions. The second asserts all eight scenarios. The third exposes the full evidence for one case; a failed assertion or unknown case exits nonzero. The tests add malformed-input, identity, expiry, retry, and mutation checks.

To capture a fresh observed record, choose a filename that does not already exist:

```sh
node labs/agent-security/validate.mjs --output /tmp/agent-security-my-run.json
```

The validator runs the tests and scenarios, records the actual Node version, time, Git base revision, source hashes and dirty state, and keeps each evidence stream. It refuses to overwrite a previous observation. Source hashes identify the tested working files even when the base commit predates them. With no `--output`, it prints JSON to standard output. No validation command contacts an external service.

See [the recorded local run](validation-2026-09-19.json) for executed checks and limitations. Its runtime is the recorded runtime, not a claim that every supported Node version or operating system was tested.

## Read the evidence in order

```text
Scripted proposal -> schema and authorization -> mock tool -> mock destination
                         ^                          |              |
Trusted session, clock, approval registry            |       independent read
                                                    v              v
                                              acknowledgement  reconciliation
```

| Evidence | What it tells you |
| --- | --- |
| `proposals` | The scripted request and host-selected actor/session. These are not model responses. Malformed input is marked and not echoed. |
| `policyDecisions` | Which request the broker allowed or denied, with its reason and trusted fixture time. |
| `toolAttempts` | Which allowed calls reached the mock tool and whether it acknowledged or timed out. |
| `destinationEffects` | The mock destination's actual stored effects, separate from acknowledgements. This is evaluator evidence, not knowledge automatically available to the agent. |
| `reconciliations` | What a separate destination read established: verified effect, verified absence, unknown, or conflicting. |
| `outputs` | What the calling agent would receive from the tool boundary. |
| `stopEvents` | When the host stopped future calls and how much work was already queued or completed. |

For `timeout-after-effect`, the destination contains one note, but the tool response remains `unknown`. An immediate retry is denied. Reconciliation then observes the existing note; a repeat of the same operation returns `verified_previous_effect` without another write. When destination inspection is unavailable, even a destination with no records remains **unknown** to the workflow.

An accepted tool acknowledgement is `acknowledged_unverified`. It is not final acceptance. An authorized reviewer still has to judge task quality, permitted use, and remaining uncertainty outside this harness.

## Cases and positive controls

| Case | Boundary and useful behavior |
| --- | --- |
| `scoped-retrieval` | User A reads their document; another user's note is denied before content is returned. |
| `untrusted-instructions` | Retrieved and mock-tool text claims permission. That text never changes the approval registry. A separately approved ordinary write still works. |
| `approval-binding` | Changing an approved target or payload is denied. The original request succeeds and is independently reconciled. |
| `memory-boundaries` | A scoped, reviewed, intact memory is readable; cross-user/session, tampered and unreviewed entries are denied. |
| `timeout-after-effect` | Reconciliation finds the prior effect, preventing a duplicate retry. |
| `unknown-destination` | Unavailable evidence remains unknown and prevents retry until inspection returns. |
| `verified-absent-retry` | A destination read confirms no effect, allowing an approved retry; the new effect is separately checked. |
| `stop-queued-actions` | Stop prevents queued and new calls. The earlier effect remains visible and can be reconciled. |

Additional tests bind approval to actor, session, action, target, exact payload and operation ID; recheck expiry at execution; reject extra/missing/ambiguous fields; reject conflicting reuse of an operation ID even with a fresh approval; and retain queue/evidence copies when caller objects change.

## Where authority lives

[fixtures.mjs](fixtures.mjs) contains fictional identities, sources, scope and memory records. [harness.mjs](harness.mjs) is the broker. [cases.mjs](cases.mjs) defines assertions and [tests](tests/harness.test.mjs) probes the boundaries. Everything stays in memory during a case.

The trusted host selects `connect(sessionKey)` after authentication and exposes only the returned `propose`/`enqueue` interface to an agent. Actor, session, policy, clock and approval records never come from proposal fields. Unknown fields such as `actor`, `approved`, or `now` cause rejection. The host-only `operator` interface can approve, stop, reconcile, and inject faults; it is not an agent tool. In this teaching program these objects share a process. They are an architectural separation, not a sandbox against arbitrary code execution.

Approval is a host-created registry entry bound to the exact request, authenticated actor and session, with an expiry checked at execution. A new payload requires a new operation ID and approval. Reusing an existing operation ID for a different payload is a conflict. Retrying the same ID requires destination reconciliation, even after an acknowledgement. The real host must preserve operation IDs across retries; inventing a fresh ID for the same business action is not detected as a duplicate here.

Memory integrity compares bytes with a separately trusted expected hash and requires an explicit reviewed state. The fixture simulates that trusted baseline; it does not implement signatures, provenance attestation, a memory classifier, or semantic injection detection. Even reviewed instruction-bearing text remains data and cannot create permissions. A memory can still be misleading without changing its bytes; this lab does not evaluate answer quality.

Stop is permanent for that harness instance, checked before each synchronous tool call. Its bound is **before the next queued or direct call begins**. Earlier effects are preserved. In-flight asynchronous cancellation, distributed workers and restart persistence are outside this implementation.

## Research and design choices

| Primary source and edition | Supported guidance and this lab's application | Limits |
| --- | --- | --- |
| [ISACA: Cybersecurity Recommendations for Securing AI Agents](https://www.isaca.org/resources/white-papers/2026/cybersecurity-recommendations-for-securing-ai-agents), published September 15, 2026; official HTML, Figure 3; reviewed September 19 | External policy checks, scoped identities/memory, untrusted-content handling, telemetry and safe fallback inform the broker, memory gates, separate ledgers and stop exercise. | Practitioner recommendations. Our changed-approval and timeout fixtures are proposed applications, not ISACA experiments or a certification checklist. |
| [MCP security best practices, versioned 2025-11-25 documentation](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices), Session Hijacking section; reviewed September 19, 2026; page publication date unknown | Per-request authorization and user-bound sessions inform the host-selected identity and cross-session checks. | This is not an MCP implementation or OAuth test. The older 2025-06-18 URL redirected to this version during review; no claim about all later protocol revisions. |
| [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/), 2025 risk entry; publication date unknown; reviewed September 19, 2026 | External content can carry instructions; privilege controls and adversarial boundary testing inform the synthetic document/tool fixtures. | Background guidance, explicitly the 2025 entry. OWASP does not establish a foolproof prevention method; these deterministic tests do not measure model susceptibility. |

OWASP also publishes an [Agentic Applications 2026 framework](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) (landing page dated December 9, 2025, checked September 19, 2026). The older LLM01 numbering above is not presented as that framework's numbering; the full 2026 document was not used to claim coverage here.

Revisit sources and cases when the model, memory design, authentication, approval interface, tool schema, destinations or recovery mechanism changes. A new mechanism needs its own observed test. The current design deliberately does not convert guidance into claims about empirical productivity or general security effectiveness.

## What remains untested

- Actual model behavior, successful completion of a research task, and user understanding. Use the [model trial record](MODEL-TRIAL.md) for future, separately authorized work.
- Real source ACLs, OAuth/token validation, MCP transport, external approval interfaces, tenant integrations, durable storage, concurrent workers and crash recovery.
- Browser rendering or network exfiltration, egress enforcement, sandbox escape, secrets protection and hostile JavaScript executing in this process. The fixed harness has no network tool or dynamic code execution; that is not a verified operating-system network boundary.
- A broadly realistic threat corpus. These are original, deliberately small synthetic cases. Passing them is no estimate of real-world failure rates or launch approval.

For an exercise, predict the next output before reading each ledger. Then explain which layer blocked the action, what evidence is still missing, and what would justify retrying. Record the explanation separately; a passing program does not prove that the person understood it.
