"""
organise_images.py
==================
Moves every image from the Gallery folder into the correct category sub-folder
(Drums / Flute / Percussion / Wind / Strings / Harmonium) and renames each
file to a clean kebab-case stem so generate_inventory.py can build a tidy
JavaScript catalogue.

Run from the project root:
    python organise_images.py
"""

import re
import shutil
from pathlib import Path

ROOT   = Path(r'c:\Users\Praveen kumar\OneDrive\Documents\website\KANNAN MUSICAL MART')
GALLERY = ROOT / 'Gallery'

# ─── category rules ─────────────────────────────────────────────────────────
# Each entry is (category_folder_name, [keywords…]).
# The FIRST matching rule wins, so put more-specific rules before general ones.
RULES = [
    # ── Strings ──────────────────────────────────────────────────────────────
    ('Strings',    ['guitar', 'violin', 'veena', 'sitar', 'sarod', 'mandolin']),

    # ── Harmonium ────────────────────────────────────────────────────────────
    ('Harmonium',  ['harmonium']),

    # ── Flute ────────────────────────────────────────────────────────────────
    ('Flute',      ['flute', 'nadeswaram', 'shennai', 'shehnai', 'clarinet',
                    'saxophone', 'saxaphone', 'bugle', 'bugule', 'trumpet',
                    'cornet', 'euphonium', 'baritone', 'trombone',
                    'brass kombu', 'kombu', 'thiruchinnam', 'thuttari',
                    'nadesvaram']),

    # ── Drums ────────────────────────────────────────────────────────────────
    ('Drums',      ['drum', 'dholl', 'dholak', 'dholki', 'nasic', 'nagarai',
                    'pambai', 'pumbai', 'panbai', 'murasu', 'murudangam',
                    'mirudangam', 'tavil', 'parai', 'tappu', 'thappu',
                    'taasa', 'tabala', 'damru', 'chanda melam',
                    'bangra', 'side drum', 'base drum', 'bass drum',
                    'urumi', 'taasha', 'tappu', 'bumbai', 'nagarai',
                    'kokkarai', 'kabbas']),

    # ── Percussion ───────────────────────────────────────────────────────────
    ('Percussion', ['tabela', 'tabla', 'bangoes', 'bango', 'kongo', 'kango',
                    'congo', 'tambarine', 'tambrine', 'cymbols', 'symbols',
                    'thalam', 'kanjira', 'udukai', 'moracus', 'morakas',
                    'chalangai', 'nattu vanga', 'kattai', 'hand thall',
                    'disk dholl', 'major band', 'sangu', 'damru',
                    'shoulder hang', 'leg chalangai', 'bharath',
                    'bharadan']),
]

# keyword → canonical display word  (applied after categorisation)
DISPLAY_FIXES = {
    'Ss':  'SS',
    'Pvc': 'PVC',
    'Spl': 'SPL',
    'Std': 'STD',
    'Wa':  'WA',
}

ALLOWED_EXTS = {'.jpg', '.jpeg', '.png', '.webp'}


# ─── helpers ────────────────────────────────────────────────────────────────

def slug(text: str) -> str:
    """Convert any name to kebab-case slug."""
    text = re.sub(r'[_\s]+', '-', text.strip())
    text = re.sub(r'[^\w\-]', '', text)            # drop parens, dots, commas
    text = re.sub(r'-{2,}', '-', text)
    return text.strip('-')


def clean_stem(stem: str) -> str:
    """
    Return a Title-Case display name from a raw filename stem.
    Works for both ALL-CAPS originals ('BANGOES WITH STAND')
    and already-formatted stems ('Nasic-Dhol-17inch').
    """
    value = re.sub(r'[_\-]+', ' ', stem).strip()
    # split run-together CamelCase
    value = re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1 \2', value)
    value = re.sub(r'([a-z0-9])([A-Z])', r'\1 \2', value)
    value = re.sub(r'\s+', ' ', value).strip()
    value = value.title()
    for wrong, right in DISPLAY_FIXES.items():
        value = value.replace(wrong, right)
    return value


def categorise(stem: str) -> str:
    """Return the best category folder for this stem."""
    lower = stem.lower()
    for category, keywords in RULES:
        if any(kw in lower for kw in keywords):
            return category
    return 'Gallery'   # keep unmatched items in Gallery


def build_target_filename(stem: str) -> str:
    """
    Produce a clean kebab-case filename from the raw stem.
    e.g. 'BANGOES WITH STAND' → 'Bangoes-With-Stand'
         'IMG-20210813-WA0018' → 'IMG-20210813-WA0018'  (pass-through)
    """
    # If it's already a clean slug (no spaces, mixed case), keep it
    if ' ' not in stem and stem == stem.strip():
        parts = re.split(r'[-_]+', stem)
        titled = '-'.join(p.capitalize() for p in parts if p)
        return titled
    # Otherwise title-case and slugify
    display = clean_stem(stem)
    return slug(display)


# ─── main ───────────────────────────────────────────────────────────────────

def main():
    if not GALLERY.exists():
        print(f"Gallery folder not found: {GALLERY}")
        return

    # Ensure all category folders exist
    all_cats = set(cat for cat, _ in RULES) | {'Gallery'}
    for cat in all_cats:
        (ROOT / cat).mkdir(exist_ok=True)

    moved   = []
    skipped = []
    errors  = []

    for src in sorted(GALLERY.iterdir()):
        if not src.is_file():
            continue
        if src.suffix.lower() not in ALLOWED_EXTS:
            skipped.append(src.name)
            continue

        stem     = src.stem
        ext      = src.suffix.lower()
        category = categorise(stem)
        new_stem = build_target_filename(stem)
        new_name = new_stem + ext
        dst      = ROOT / category / new_name

        if dst == src:
            continue

        # avoid collisions
        counter = 1
        while dst.exists():
            if dst.samefile(src):
                break
            dst = ROOT / category / f"{new_stem}-{counter}{ext}"
            counter += 1

        if dst == src:
            continue

        try:
            shutil.move(str(src), str(dst))
            moved.append(f"  [{category}]  {src.name}  ->  {dst.name}")
        except Exception as exc:
            errors.append(f"  ERROR  {src.name}: {exc}")

    # ── report ──────────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"  Organised {len(moved)} images  |  skipped {len(skipped)}  |  errors {len(errors)}")
    print(f"{'='*60}\n")
    for line in moved:
        print(line)
    if skipped:
        print("\nSkipped (non-image):")
        for s in skipped:
            print(f"  {s}")
    if errors:
        print("\nErrors:")
        for e in errors:
            print(e)

    # ── regenerate inventory ─────────────────────────────────────────────────
    print("\nRegenerating inventory…")
    import subprocess, sys
    result = subprocess.run(
        [sys.executable, str(ROOT / 'generate_inventory.py')],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
    )
    if result.returncode == 0:
        print("  [OK] generated_inventory.js updated")
    else:
        print("  [FAIL] generate_inventory.py failed:")
        print(result.stderr)

    print("\nDone.\n")


if __name__ == '__main__':
    main()
