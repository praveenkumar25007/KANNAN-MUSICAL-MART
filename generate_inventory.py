import re
from pathlib import Path

root = Path(r'c:\Users\Praveen kumar\OneDrive\Documents\website\KANNAN MUSICAL MART')
folders = ['Drums', 'Flute', 'Percussion', 'Wind', 'Strings', 'Harmonium', 'Gallery']
allowed_exts = {'.jpg', '.jpeg', '.png', '.webp'}

# Manual overrides: filename stem (lower) -> display name
OVERRIDES = {
    'nasic-dholl156'              : 'Nasic Dholl 15.6 Inch',
    'mini-nasic-dholl11-8'        : 'Mini Nasic Dholl (11×8)',
    'nasic-dholl-mini8-inches'    : 'Nasic Dholl Mini (8 Inches)',
    'flute6-hole'                 : 'Flute (6 Hole)',
    'flute-8-holesc-sharp'        : 'Flute 8 Holes (C Sharp)',
    'flute-6holes-scale1.5'       : 'Flute 6 Holes Scale 1.5',
    'flute-6holes-scale4.5'       : 'Flute 6 Holes Scale 4.5',
    'flute-8holes-karnatic-scale2.5': 'Flute 8 Holes Karnatic Scale 2.5',
    'flute-8holes-karnatic-scale4': 'Flute 8 Holes Karnatic Scale 4',
    'taasa(steel)'                : 'Taasa (Steel)',
    'tappu(iron)'                 : 'Tappu (Iron)',
    'urumi(brass)'                : 'Urumi (Brass)',
    'thuttari(brass)'             : 'Thuttari (Brass)',
    'dholak-spl'                  : 'Dholak (SPL)',
    'tabela-set-brass-1-st-quality': 'Tabela Set Brass (1st Quality)',
    'thalam-brass33-inch'         : 'Thalam Brass (3.3 Inch)',
    'baby-double-read-harmonium29-keys': 'Baby Double Read Harmonium (29 Keys)',
    'baby-double-read-harmonium-29-keystop-view': 'Baby Double Read Harmonium (29 Keys) Top View',
    'double-read-harmonium-traveling-lift-model29-keys': 'Double Read Harmonium Traveling Lift Model (29 Keys)',
    'guitar-givson-150sandal-colour': 'Guitar Givson 150 (Sandal Colour)',
    'disk-dhollside-drum'         : 'Disk Dholl (Side Drum)',
    'dhol-drum-steelbig-size'     : 'Dhol Drum (Steel) Big Size',
    'bumbai-set-brassstraight-view': 'Bumbai Set (Brass) Straight View',
    'nasic-dhollsmall-size'       : 'Nasic Dholl (Small Size)',
    'panbai-setbrass-brass-pvc-sheet': 'Panbai Set (Brass & Brass) PVC Sheet',
    'pumbai-setbrass-wood'        : 'Pumbai Set (Brass & Wood)',
    'side-drum117-inches'         : 'Side Drum (11.7 Inches)',
    'side-drumss'                 : 'Side Drum (SS)',
    'murudangam-jack-fruit-wood-22-inchright-view': 'Murudangam Jack Fruit Wood (22 Inch) Right View',
    'thappu-side-viewi'           : 'Thappu (Side View)',
    'thappu-steelback-view'       : 'Thappu Steel (Back View)',
    'thappu-steelfront-view'      : 'Thappu Steel (Front View)',
    'thappu-steelside-view'       : 'Thappu Steel (Side View)',
    'kanjiraback-side'            : 'Kanjira (Back Side)',
    'tambrine-12-inchcenter-view' : 'Tambrine (12 Inch) Center View',
    'tambrine-fiber-pvc-skin9-inch': 'Tambrine Fiber PVC Skin (9 Inch)',
    'tambrine-fibrepvc-ski'       : 'Tambrine Fibre PVC Ski',
    'tambrine-fibrepvc-skin10-inch-back-view': 'Tambrine Fibre PVC Skin (10 Inch) Back View',
    'tambrine-wo-patchment9-inch' : 'Tambrine (WO Patchment) 9 Inch',
    'tambarine-7-to-12-inchfiber' : 'Tambarine (7 to 12 Inch) Fiber',
    'sangu-8-inchwith-brass-cap'  : 'Sangu 8 Inch (With Brass Cap)',
    'chatti-brasstop-view'        : 'Chatti Brass (Top View)',
    'bangoes-pair-red'            : 'Bangoes Pair (Red Polish)',
    'baby-harmonium-box-front-view': 'Baby Harmonium Portable Box (Front View)',
    'baby-harmonium-open-keys-top-view': 'Baby Harmonium (Top View Open Keys)',
    'baby-harmonium-open-keys-angle-view': 'Baby Harmonium (Angle View Open Keys)',
    'store-display-instruments-1' : 'Store Display - Classical & Folk Instruments 1',
    'store-display-instruments-2' : 'Store Display - Classical & Folk Instruments 2',
    'store-showroom-view'         : 'Kannan Musical Mart Showroom Front',
}


def clean_name(stem: str) -> str:
    """Return a clean Title Case display name from a kebab/ALL-CAPS stem."""
    key = stem.lower()
    if key in OVERRIDES:
        return OVERRIDES[key]

    # Replace dashes/underscores with spaces
    value = re.sub(r'[-_]+', ' ', stem).strip()

    # Split glued words like "Inch)(SS" or "29Keys" that slipped through
    value = re.sub(r'([a-z])([A-Z])', r'\1 \2', value)
    value = re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1 \2', value)

    # Normalise whitespace
    value = re.sub(r'\s+', ' ', value).strip()

    # Title-case, then fix known acronyms
    value = value.title()
    for wrong, right in [('Ss ', 'SS '), (' Ss', ' SS'), ('(Ss)', '(SS)'),
                          ('Pvc', 'PVC'), ('Spl', 'SPL'), ('Std', 'STD'),
                          ('Wa0', 'WA0'), ('Wa ', 'WA ')]:
        value = value.replace(wrong, right)

    return value


entries = []
for folder in folders:
    folder_path = root / folder
    if not folder_path.exists():
        continue
    for file_path in sorted(folder_path.iterdir()):
        if file_path.is_file() and file_path.suffix.lower() in allowed_exts:
            display = clean_name(file_path.stem)
            entries.append((display, folder, file_path.name))

lines = ['const inventoryEntries = [']
for display, folder, file_name in entries:
    escaped = display.replace("'", "\\'")
    lines.append(f"  {{ name: '{escaped}', category: '{folder}', image: '{folder}/{file_name}' }},")
lines.append('];')

out = root / 'generated_inventory.js'
out.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(f'Written {len(entries)} entries to generated_inventory.js')
