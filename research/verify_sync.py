#!/usr/bin/env python3
"""Verify the pinned research copy; all checks are local and read-only."""
import argparse
import csv
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent
LINK = re.compile(r'\]\(([^)]+)\)')
READINGS = ['beyond-the-model-frontier', 'ai-acceptance', 'acceptance-review', 'building-capability-with-ai']
COMPANIONS = [
    'README.md', '01-model-and-serving-comparison.md', '02-context-and-evidence-review.md',
    '03-learning-and-oversight-exercise.md', '04-productivity-pilot.md',
    '05-acceptance-and-recovery-record.md', '06-proposition-test-plan.md',
    '07-fictional-worked-example.md', '08-evidence-and-limitations.md',
    '09-user-development-plan.md', 'acceptance-checklist.txt',
    'model-service-comparison.csv', 'evidence-register.csv', 'pilot-log.csv',
    'fictional-pilot-log.csv', 'user-progress-log.csv', 'fictional-user-progress-log.csv',
]
ROUTES = {
    '/work/beyond-the-model-frontier': 'beyond-the-model-frontier.md',
    '/concepts/ai-acceptance': 'ai-acceptance.md',
    '/guides/acceptance-review': 'acceptance-review.md',
    '/guides/building-capability-with-ai': 'building-capability-with-ai.md',
    '/guides/acceptance-review/checklist': 'companions/acceptance-checklist.txt',
    '/downloads/ai-research/beyond-model-frontier-companions.zip': 'companions/README.md',
}
PROVENANCE = '\n\n> Private-library copy of the September 18, 2026 review edition. See [source and sync notes](SYNC.md); this copy does not assert live publication.\n'


def adapt(text, relative_path):
    """The only permitted content adjustments to this source edition."""
    dest = ROOT / relative_path
    if dest.suffix != '.md':
        return text

    def replace(match):
        route = match[1].removeprefix('https://hellojdmiller.com')
        local = ROUTES.get(route)
        if local is None and route.startswith('/downloads/ai-research/'):
            local = 'companions/' + route.split('/')[-1]
        return match[0] if local is None else '](' + os.path.relpath(ROOT / local, dest.parent) + ')'

    text = LINK.sub(replace, text)
    if relative_path == 'acceptance-review.md':
        text = text.replace('[Download the complete editable pack]', '[Browse the complete editable pack]')
    if dest.parent == ROOT:
        first, rest = text.split('\n', 1)
        text = first + PROVENANCE + rest
    if relative_path == 'companions/README.md':
        text = text.replace('In a review preview, use these routes in that preview to see the matching revision.', 'These repository links open the matching pinned revision. See the [research index](../README.md) and [source and sync notes](../SYNC.md).')
    if dest.name == '09-user-development-plan.md':
        text = text.replace('third website companion', 'third research companion').replace(' In a review preview, use the same route in that preview.', '')
    return text


def external_citations(text):
    return [url for url in LINK.findall(text) if url.startswith(('https://', 'http://')) and not url.startswith('https://hellojdmiller.com/')]


def verify(source_repo=None):
    manifest = json.loads((ROOT / 'SOURCE_MANIFEST.json').read_text())
    entries = manifest['files']
    expected_copies = {slug + '.md' for slug in READINGS} | {'companions/' + name for name in COMPANIONS}
    listed = [item['local_path'] for item in entries]
    if len(listed) != len(set(listed)) or set(listed) != expected_copies:
        raise ValueError('Manifest must cover exactly four readings and 17 companion files, without duplicates.')
    expected_all = expected_copies | {'README.md', 'SYNC.md', 'SOURCE_MANIFEST.json', 'verify_sync.py'}
    actual = {str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file()}
    if actual != expected_all:
        raise ValueError(f'Unexpected inventory: missing={expected_all - actual}; extra={actual - expected_all}')
    for entry in entries:
        local = ROOT / entry['local_path']
        data = local.read_bytes()
        if hashlib.sha256(data).hexdigest() != entry['local_sha256']:
            raise ValueError(f'Local hash mismatch: {entry["local_path"]}')
        expected_source = ('src/content/companions/ai-research/' + local.name if local.parent.name == 'companions' else 'src/content/perspectives/' + local.name)
        if entry['source_path'] != expected_source:
            raise ValueError(f'Unexpected source mapping: {entry["local_path"]}')
        if source_repo:
            source = subprocess.check_output(['git', 'show', manifest['source_commit'] + ':' + entry['source_path']], cwd=source_repo)
            if hashlib.sha256(source).hexdigest() != entry['source_sha256']:
                raise ValueError(f'Source hash mismatch: {entry["source_path"]}')
            if adapt(source.decode('utf-8'), entry['local_path']).encode('utf-8') != data:
                raise ValueError(f'Unapproved content difference: {entry["local_path"]}')
            if external_citations(source.decode('utf-8')) != external_citations(data.decode('utf-8')):
                raise ValueError(f'Changed external citations: {entry["local_path"]}')
    links = 0
    for path in sorted(ROOT.rglob('*.md')):
        for url in LINK.findall(path.read_text()):
            parts = urlsplit(url)
            if parts.scheme or parts.netloc or not parts.path:
                continue
            if parts.path.startswith('/'):
                raise ValueError(f'Website-root link remains in {path.name}: {url}')
            dest = (path.parent / unquote(parts.path)).resolve()
            if not dest.is_relative_to(ROOT.parent) or not dest.is_file():
                raise ValueError(f'Broken or escaping repository link in {path.name}: {url}')
            links += 1
    for path in sorted((ROOT / 'companions').glob('*.csv')):
        with path.open(newline='') as handle:
            rows = list(csv.reader(handle))
        if not rows or not all(rows[0]) or len(set(rows[0])) != len(rows[0]):
            raise ValueError(f'Missing or duplicate CSV headers: {path.name}')
        if any(len(row) != len(rows[0]) for row in rows):
            raise ValueError(f'CSV column count mismatch: {path.name}')
        if path.name.startswith('fictional-'):
            if len(rows) != 5:
                raise ValueError(f'Expected four fictional example rows: {path.name}')
            template = path.with_name(path.name.removeprefix('fictional-'))
            with template.open(newline='') as handle:
                if next(csv.reader(handle)) != rows[0]:
                    raise ValueError(f'Example headers differ from template: {path.name}')
        elif len(rows) != 1:
            raise ValueError(f'Blank template contains observations: {path.name}')
    print(f'PASS: 25 files; 21 copied-file hashes; {links} local link targets; six CSV schemas and example/blank separation.')
    if source_repo:
        print(f'PASS: 21 pinned upstream hashes, exact allowed transformations, and external citation preservation at {manifest["source_commit"]}.')
    else:
        print('Pinned upstream fidelity was not rechecked; use --source-repo with a checkout containing the source commit.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-repo', type=Path, help='Local website checkout containing the pinned commit; does not fetch or use the network.')
    args = parser.parse_args()
    try:
        verify(args.source_repo)
    except (ValueError, OSError, KeyError, subprocess.CalledProcessError) as exc:
        parser.exit(1, f'FAIL: {exc}\n')
