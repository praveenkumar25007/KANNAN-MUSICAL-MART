/* ==========================================================================
   KANNAN MUSICAL MART — GALLERY PAGE SCRIPT
   - All 198 instrument images organized by category
   - Search, filter, grid/list view
   - Lightbox with keyboard navigation
   - Dark / Light mode toggle
   - Tamil music background player (via Web Audio API + YouTube IFrame)
   ========================================================================== */

(function () {
  "use strict";

  /* =========================================================
     0. GITHUB LFS BASE URL
     Images are tracked via Git LFS. Use GitHub's raw media CDN
     so images load correctly both locally and on GitHub Pages.
     ========================================================= */
  // Image src paths in INSTRUMENTS already include "Gallery/" prefix,
  // so GH_BASE is empty — images load relatively from the project root.
  const GH_BASE = "";


  /* =========================================================
     CATEGORY-SPECIFIC FALLBACK IMAGES
     These show when a GitHub LFS image fails to load,
     so each instrument type shows a relevant placeholder.
     ========================================================= */
  const CAT_FALLBACKS = {
    harmonium: "https://images.unsplash.com/photo-1621368286550-f54551f39b91?q=80&w=600&auto=format&fit=crop",
    flute:     "https://images.unsplash.com/photo-1621368286547-3fb2f4d1ea5d?q=80&w=600&auto=format&fit=crop",
    string:    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=600&auto=format&fit=crop",
    drums:     "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=600&auto=format&fit=crop",
    folk:      "https://images.unsplash.com/photo-1583225214464-9296029427aa?q=80&w=600&auto=format&fit=crop",
    temple:    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop",
    wind:      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop",
    store:     "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop"
  };
  const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop";

  /* =========================================================
     1. INSTRUMENT DATA — All 198 images from Gallery folder
     ========================================================= */
  const INSTRUMENTS = [
    /* --- Harmonium --- */
    { src: "Gallery/Baby-Double-Read-Harmonium-29-Keys-Side-View.jpg",   name: "Baby Double Read Harmonium 29 Keys (Side)",   cat: "harmonium" },
    { src: "Gallery/Baby-Double-Read-Harmonium-29-KeysTop-View.jpg",     name: "Baby Double Read Harmonium 29 Keys (Top)",    cat: "harmonium" },
    { src: "Gallery/Baby-Double-Read-Harmonium29-Keys.jpg",              name: "Baby Double Read Harmonium 29 Keys",          cat: "harmonium" },
    { src: "Gallery/Double-Read-Harmonium-39-Keys.jpg",                  name: "Double Read Harmonium 39 Keys",               cat: "harmonium" },
    { src: "Gallery/Double-Read-Harmonium-Traveling-Lift-Model-39-Keys.jpg", name: "Double Read Harmonium Traveling Lift 39 Keys", cat: "harmonium" },
    { src: "Gallery/Double-Read-Harmonium-Traveling-Lift-Model29-Keys.jpg", name: "Double Read Harmonium Traveling Lift 29 Keys", cat: "harmonium" },
    { src: "Gallery/Double-Read-Harmonium-Traveling-Model.jpg",          name: "Double Read Harmonium Traveling Model",       cat: "harmonium" },
    { src: "Gallery/Double-Read-Harmonium-With-Full-Cover-39-Keys.jpg",  name: "Double Read Harmonium With Cover 39 Keys",    cat: "harmonium" },
    { src: "Gallery/Harmonium-Single-Read.jpg",                          name: "Harmonium Single Read",                       cat: "harmonium" },

    /* --- Flutes --- */
    { src: "Gallery/Flute-6holes-Scale1.5.jpg",           name: "Flute 6 Holes Scale 1.5",          cat: "flute" },
    { src: "Gallery/Flute-6holes-Scale4.5.jpg",           name: "Flute 6 Holes Scale 4.5",          cat: "flute" },
    { src: "Gallery/Flute-8-HolesC-Sharp.jpg",            name: "Flute 8 Holes C Sharp",            cat: "flute" },
    { src: "Gallery/Flute-8holes-Karnatic-Scale2.5.jpg",  name: "Flute 8 Holes Karnatic Scale 2.5", cat: "flute" },
    { src: "Gallery/Flute-8holes-Karnatic-Scale4.jpg",    name: "Flute 8 Holes Karnatic Scale 4",   cat: "flute" },
    { src: "Gallery/Flute6-Hole.jpg",                     name: "Flute 6 Hole",                   cat: "flute" },
    { src: "Gallery/Flutes.jpg",                          name: "Flutes Collection",                 cat: "flute" },

    /* --- Strings / Guitar / Violin --- */
    { src: "Gallery/Guitar-Givson-150Sandal-Colour.jpg",  name: "Guitar Givson 150 Sandal Colour",  cat: "string" },
    { src: "Gallery/Guitar-Givson-G-150-STD.jpg",         name: "Guitar Givson G 150 STD",          cat: "string" },
    { src: "Gallery/Guitar-Givson-Venus-Era.jpg",         name: "Guitar Givson Venus Era",           cat: "string" },
    { src: "Gallery/Guitar.jpg",                          name: "Guitar",                            cat: "string" },
    { src: "Gallery/Violin.jpg",                          name: "Violin",                            cat: "string" },

    /* --- Percussion / Mridangam / Tabla --- */
    { src: "Gallery/Mirudangam-22-Inch-24-Inch.jpg",              name: "Mridangam 22 & 24 Inch",         cat: "drums" },
    { src: "Gallery/Mirudangam-24-Inch.jpg",                      name: "Mridangam 24 Inch",              cat: "drums" },
    { src: "Gallery/Mirudangam-Left-View-24-Inch.jpg",            name: "Mridangam 24 Inch (Left View)",  cat: "drums" },
    { src: "Gallery/Mirudangam-Right-View-24-Inch.jpg",           name: "Mridangam 24 Inch (Right View)", cat: "drums" },
    { src: "Gallery/Murudangam-Jack-Fruit-Wood-22-Inch-Left-View.jpg",  name: "Mridangam Jack Fruit 22 Inch (Left)",  cat: "drums" },
    { src: "Gallery/Murudangam-Jack-Fruit-Wood-22-Inch.jpg",            name: "Mridangam Jack Fruit 22 Inch",         cat: "drums" },
    { src: "Gallery/Murudangam-Jack-Fruit-Wood-22-InchRight-View.jpg",  name: "Mridangam Jack Fruit 22 Inch (Right)", cat: "drums" },
    { src: "Gallery/Tabala.jpg",                                  name: "Tabala",                          cat: "drums" },
    { src: "Gallery/Tabela-Set-Boltnet.jpg",                      name: "Tabla Set Boltnet",               cat: "drums" },
    { src: "Gallery/Tabela-Set-Brass-1-St-Quality.jpg",           name: "Tabla Set Brass 1st Quality",     cat: "drums" },
    { src: "Gallery/Tabela-Set-Medium-Size.jpg",                  name: "Tabla Set Medium Size",           cat: "drums" },
    { src: "Gallery/Tabela-Set-Steel.jpg",                        name: "Tabla Set Steel",                 cat: "drums" },
    { src: "Gallery/Tabela-Set.jpg",                              name: "Tabla Set",                       cat: "drums" },

    /* --- Drums (Western/Band/Side/Bass) --- */
    { src: "Gallery/Base-Drum-23-Inches.jpg",             name: "Bass Drum 23 Inches",              cat: "drums" },
    { src: "Gallery/Base-Drum-25-Inches.jpg",             name: "Bass Drum 25 Inches",              cat: "drums" },
    { src: "Gallery/Base-Drum-29inch.jpg",                name: "Bass Drum 29 Inch",                cat: "drums" },
    { src: "Gallery/Bass-Drum-27-Inch-SS-Front-View.jpg", name: "Bass Drum 27 Inch SS (Front)",     cat: "drums" },
    { src: "Gallery/Bass-Drum-27-Inch-SS.jpg",            name: "Bass Drum 27 Inch SS",             cat: "drums" },
    { src: "Gallery/Side-Drum-117-Inches-Side-Angle.jpg", name: "Side Drum 11×7 Inches (Angle)",   cat: "drums" },
    { src: "Gallery/Side-Drum-12-Inch-SS.jpg",            name: "Side Drum 12 Inch SS",             cat: "drums" },
    { src: "Gallery/Side-Drum-12inch.jpg",                name: "Side Drum 12 Inch",                cat: "drums" },
    { src: "Gallery/Side-Drum117-Inches.jpg",             name: "Side Drum 11×7 Inches",            cat: "drums" },
    { src: "Gallery/Side-DrumSS.jpg",                     name: "Side Drum SS",                     cat: "drums" },
    { src: "Gallery/Dhol-Drum-SteelBig-Size.jpg",         name: "Dhol Drum Steel Big Size",         cat: "drums" },
    { src: "Gallery/Dholl-Drum.jpg",                      name: "Dholl Drum",                       cat: "drums" },

    /* --- Bangoes / Conga --- */
    { src: "Gallery/Bangoes-1.jpg",                name: "Bangoes 1",                 cat: "drums" },
    { src: "Gallery/Bangoes-Basic-Model.jpg",       name: "Bangoes Basic Model",       cat: "drums" },
    { src: "Gallery/Bangoes-SPL-1.jpg",             name: "Bangoes Special 1",         cat: "drums" },
    { src: "Gallery/Bangoes-SPL.jpg",               name: "Bangoes Special",           cat: "drums" },
    { src: "Gallery/Bangoes-With-Stand.jpg",        name: "Bangoes With Stand",        cat: "drums" },
    { src: "Gallery/Bangoes.jpg",                   name: "Bangoes",                   cat: "drums" },
    { src: "Gallery/Triple-Bangoes-Joint-Model.jpg",name: "Triple Bangoes Joint Model",cat: "drums" },
    { src: "Gallery/Triple-Bbangoes.jpg",           name: "Triple Bangoes",            cat: "drums" },
    { src: "Gallery/Triple-Congo-Nano-Model.jpg",   name: "Triple Congo Nano Model",   cat: "drums" },
    { src: "Gallery/Triple-Kango-Drum-Namam-Model.jpg",   name: "Triple Kango Namam Model",  cat: "drums" },
    { src: "Gallery/Triple-Kango-Drum-Set.jpg",           name: "Triple Kango Drum Set",     cat: "drums" },
    { src: "Gallery/Triple-Kango-Drum-Thumba-Model-1.jpg",name: "Triple Kango Thumba Model 1",cat: "drums" },
    { src: "Gallery/Triple-Kango-Drum-Thumba-Model.jpg",  name: "Triple Kango Thumba Model", cat: "drums" },
    { src: "Gallery/Triple-Kongo-Drum.jpg",               name: "Triple Kongo Drum",         cat: "drums" },

    /* --- Folk Drums (Tappu / Parai / Murasu) --- */
    { src: "Gallery/Tappu(iron).jpg",              name: "Tappu (Iron)",             cat: "folk" },
    { src: "Gallery/Tappu-Back-View.jpg",          name: "Tappu (Back View)",        cat: "folk" },
    { src: "Gallery/Thappu-Iron-Back-View.jpg",    name: "Thappu Iron (Back View)",  cat: "folk" },
    { src: "Gallery/Thappu-Iron.jpg",              name: "Thappu Iron",              cat: "folk" },
    { src: "Gallery/Thappu-Side-ViewI.jpg",        name: "Thappu (Side View)",       cat: "folk" },
    { src: "Gallery/Thappu-SteelBack-View.jpg",    name: "Thappu Steel (Back View)", cat: "folk" },
    { src: "Gallery/Thappu-SteelFront-View.jpg",   name: "Thappu Steel (Front View)",cat: "folk" },
    { src: "Gallery/Thappu-SteelSide-View.jpg",    name: "Thappu Steel (Side View)", cat: "folk" },
    { src: "Gallery/Parai-Metal-Side-View.jpg",    name: "Parai Metal (Side View)",  cat: "folk" },
    { src: "Gallery/Parai-Metal.jpg",              name: "Parai Metal",              cat: "folk" },
    { src: "Gallery/Parai-Wood-Front-View.jpg",    name: "Parai Wood (Front View)",  cat: "folk" },
    { src: "Gallery/Parai-Wood-With-Bag.jpg",      name: "Parai Wood With Bag",      cat: "folk" },
    { src: "Gallery/Parai-Wood.jpg",               name: "Parai Wood",               cat: "folk" },
    { src: "Gallery/Murasu.jpg",                   name: "Murasu",                   cat: "folk" },
    { src: "Gallery/Taasa(steel).jpg",             name: "Taasa (Steel)",            cat: "folk" },
    { src: "Gallery/Taasha-13inch-Heavy.jpg",      name: "Taasha 13 Inch Heavy",     cat: "folk" },

    /* --- Tambourine / Kanjira --- */
    { src: "Gallery/Tambarine-7-To-12-InchFiber.jpg",        name: "Tambourine 7-12 Inch Fiber",       cat: "folk" },
    { src: "Gallery/Tambarine-Fiber-Wo-Patchment.jpg",       name: "Tambourine Fiber",                 cat: "folk" },
    { src: "Gallery/Tambarine-Fiber.jpg",                    name: "Tambourine Fiber",                 cat: "folk" },
    { src: "Gallery/Tambrine-12-Inch-Side-View.jpg",         name: "Tambourine 12 Inch (Side View)",   cat: "folk" },
    { src: "Gallery/Tambrine-12-InchCenter-View.jpg",        name: "Tambourine 12 Inch (Center View)", cat: "folk" },
    { src: "Gallery/Tambrine-Fiber-PVC-Skin9-Inch.jpg",      name: "Tambourine Fiber PVC 9 Inch",      cat: "folk" },
    { src: "Gallery/Tambrine-Fibre-12-Inch.jpg",             name: "Tambourine Fibre 12 Inch",         cat: "folk" },
    { src: "Gallery/Tambrine-Fibre.jpg",                     name: "Tambourine Fibre",                 cat: "folk" },
    { src: "Gallery/Tambrine-FibrePVC-Ski.jpg",              name: "Tambourine Fibre PVC",             cat: "folk" },
    { src: "Gallery/Tambrine-FibrePVC-Skin10-Inch-Back-View.jpg", name: "Tambourine Fibre PVC 10 Inch (Back)", cat: "folk" },
    { src: "Gallery/Tambrine-Wo-Patchment9-Inch.jpg",        name: "Tambourine 9 Inch",                cat: "folk" },
    { src: "Gallery/Kanjira-Side-Angle.jpg",                 name: "Kanjira (Side Angle)",             cat: "folk" },
    { src: "Gallery/Kanjira-Top-Angle.jpg",                  name: "Kanjira (Top Angle)",              cat: "folk" },
    { src: "Gallery/KanjiraBack-Side.jpg",                   name: "Kanjira (Back Side)",              cat: "folk" },

    /* --- Udukkai / Damru --- */
    { src: "Gallery/Udukai-Brass-Side-View.jpg",  name: "Udukai Brass (Side View)",  cat: "folk" },
    { src: "Gallery/Udukai-Brass-Top-View.jpg",   name: "Udukai Brass (Top View)",   cat: "folk" },
    { src: "Gallery/Udukai-Brass.jpg",             name: "Udukai Brass",              cat: "folk" },
    { src: "Gallery/Udukkai-Brass-Plastic.jpg",   name: "Udukkai Brass Plastic",    cat: "folk" },
    { src: "Gallery/Udukkai-Wood-Leather.jpg",    name: "Udukkai Wood Leather",      cat: "folk" },
    { src: "Gallery/Damaram-Iron-Body.jpg",       name: "Damaram Iron Body",         cat: "folk" },
    { src: "Gallery/Damru.jpg",                   name: "Damru",                     cat: "folk" },
    { src: "Gallery/Moracus-Fly-Met.jpg",         name: "Moracus Fly Met",           cat: "folk" },
    { src: "Gallery/Moracus-Flynut.jpg",          name: "Moracus Flynut",            cat: "folk" },
    { src: "Gallery/Morakas-SS.jpg",              name: "Morakas SS",                cat: "folk" },

    /* --- Tavil / Chanda --- */
    { src: "Gallery/Tavil-Jack-Fruit-Wood.jpg",   name: "Tavil Jack Fruit Wood",     cat: "folk" },
    { src: "Gallery/Tavil-Left-View.jpg",          name: "Tavil (Left View)",         cat: "folk" },
    { src: "Gallery/Tavil.jpg",                    name: "Tavil",                     cat: "folk" },
    { src: "Gallery/Chanda-Melam-Side-View.jpg",  name: "Chanda Melam (Side View)",  cat: "folk" },
    { src: "Gallery/Chanda-Melam.jpg",             name: "Chanda Melam",              cat: "folk" },
    { src: "Gallery/Jeeka-Fiber.jpg",              name: "Jeeka Fiber",               cat: "folk" },
    { src: "Gallery/Karthal-Fiber.jpg",            name: "Karthal Fiber",             cat: "folk" },
    { src: "Gallery/Chipli-Kattai.jpg",            name: "Chipli Kattai",             cat: "folk" },

    /* --- Dholak / Dholki --- */
    { src: "Gallery/Bangra-Dholl-Wood-Straight-Angle.jpg", name: "Bangra Dholl Wood (Straight Angle)", cat: "drums" },
    { src: "Gallery/Bangra-Dholl-Wood.jpg",                name: "Bangra Dholl Wood",                  cat: "drums" },
    { src: "Gallery/Bangra-Wooden-Dholl.jpg",              name: "Bangra Wooden Dholl",                cat: "drums" },
    { src: "Gallery/Dholak-SPL.jpg",                       name: "Dholak Special",                     cat: "drums" },
    { src: "Gallery/Dholaki-Sheesam-Wood.jpg",             name: "Dholaki Sheesam Wood",               cat: "drums" },
    { src: "Gallery/Dholki.jpg",                           name: "Dholki",                             cat: "drums" },
    { src: "Gallery/Disk-Dholl.jpg",                       name: "Disk Dholl",                         cat: "drums" },
    { src: "Gallery/Disk-DhollSide-Drum.jpg",             name: "Disk Dholl Side Drum",               cat: "drums" },
    { src: "Gallery/Thap-Dhol-18inch.jpg",                name: "Thap Dhol 18 Inch",                  cat: "drums" },

    /* --- Nasic Dholl --- */
    { src: "Gallery/Nasic-Dhol-17inch.jpg",          name: "Nasic Dhol 17 Inch",          cat: "drums" },
    { src: "Gallery/Nasic-Dhol-SS-18inch.jpg",       name: "Nasic Dhol SS 18 Inch",       cat: "drums" },
    { src: "Gallery/Nasic-Dhol-SS-23inch.jpg",       name: "Nasic Dhol SS 23 Inch",       cat: "drums" },
    { src: "Gallery/Nasic-Dholl-Baby.jpg",           name: "Nasic Dholl Baby",            cat: "drums" },
    { src: "Gallery/Nasic-Dholl-Mini-10-Inch.jpg",   name: "Nasic Dholl Mini 10 Inch",    cat: "drums" },
    { src: "Gallery/Nasic-Dholl-Mini8-Inches.jpg",   name: "Nasic Dholl Mini 8 Inches",   cat: "drums" },
    { src: "Gallery/Nasic-Dholl156.jpg",             name: "Nasic Dholl 15×6",            cat: "drums" },
    { src: "Gallery/Nasic-DhollSmall-Size.jpg",      name: "Nasic Dholl Small Size",      cat: "drums" },
    { src: "Gallery/Mini-Nasic-Dholl11-8.jpg",       name: "Mini Nasic Dholl 11×8",       cat: "drums" },

    /* --- Cymbals / Symbols --- */
    { src: "Gallery/Cymbols-Steel.jpg",           name: "Cymbals Steel",             cat: "drums" },
    { src: "Gallery/Symbols-Brass-10-Inch.jpg",   name: "Symbols Brass 10 Inch",    cat: "drums" },
    { src: "Gallery/Symbols-Brass.jpg",            name: "Symbols Brass",             cat: "drums" },

    /* --- Thaalam / Hand Taal --- */
    { src: "Gallery/Thalam-Brass33-Inch.jpg",  name: "Thalam Brass 33 Inch",   cat: "folk" },
    { src: "Gallery/Hand-Taal-Design.jpg",     name: "Hand Taal Design",        cat: "folk" },
    { src: "Gallery/Hand-Taal-Straight.jpg",   name: "Hand Taal Straight",      cat: "folk" },
    { src: "Gallery/Hand-Thall-Wood.jpg",      name: "Hand Thall Wood",         cat: "folk" },

    /* --- Pambai / Urumi --- */
    { src: "Gallery/Pambai-Brass-Wood.jpg",          name: "Pambai Brass Wood",          cat: "folk" },
    { src: "Gallery/Pambai-Front-View.jpg",          name: "Pambai (Front View)",        cat: "folk" },
    { src: "Gallery/Pambai-Set-Brass-Brass.jpg",     name: "Pambai Set Brass-Brass",     cat: "folk" },
    { src: "Gallery/Panbai-SetBrass-Brass-PVC-Sheet.jpg", name: "Panbai Set Brass PVC", cat: "folk" },
    { src: "Gallery/Pumbai-SetBrass-Wood.jpg",       name: "Pumbai Set Brass-Wood",      cat: "folk" },
    { src: "Gallery/Urumi(brass).jpg",               name: "Urumi (Brass)",              cat: "folk" },
    { src: "Gallery/Urumi-Brass-Left-Angle.jpg",     name: "Urumi Brass (Left Angle)",   cat: "folk" },
    { src: "Gallery/Urumi-Brass-Side-Angle.jpg",     name: "Urumi Brass (Side Angle)",   cat: "folk" },
    { src: "Gallery/Urumi-Brass.jpg",                name: "Urumi Brass",                cat: "folk" },
    { src: "Gallery/Urumi-SPL-Wood-Side-Angle.jpg",  name: "Urumi Special Wood (Side)",  cat: "folk" },
    { src: "Gallery/Urumi-SPL-Wood-Wide-Angle.jpg",  name: "Urumi Special Wood (Wide)",  cat: "folk" },
    { src: "Gallery/Urumi-SPL-Wood.jpg",             name: "Urumi Special Wood",         cat: "folk" },
    { src: "Gallery/Urumi.jpg",                      name: "Urumi",                      cat: "folk" },

    /* --- Temple / Kabbas / Nagarai / Thiruchinnam --- */
    { src: "Gallery/Kabbas.jpg",                  name: "Kabbas",                    cat: "temple" },
    { src: "Gallery/Kokkarai-Brass-15-Inch.jpg",  name: "Kokkarai Brass 15 Inch",   cat: "temple" },
    { src: "Gallery/Nagarai-Set-Brass-1.jpg",     name: "Nagarai Set Brass 1",      cat: "temple" },
    { src: "Gallery/Nagarai-Set-Brass-2.jpg",     name: "Nagarai Set Brass 2",      cat: "temple" },
    { src: "Gallery/Nagarai-Set-Brass.jpg",       name: "Nagarai Set Brass",        cat: "temple" },
    { src: "Gallery/Nagarai-Set-SS.jpg",          name: "Nagarai Set SS",           cat: "temple" },
    { src: "Gallery/Thiruchinnam-1.jpg",          name: "Thiruchinnam 1",           cat: "temple" },
    { src: "Gallery/Thiruchinnam.jpg",             name: "Thiruchinnam",             cat: "temple" },
    { src: "Gallery/Sangu-8-InchWith-Brass-Cap.jpg", name: "Sangu 8 Inch Brass Cap",cat: "temple" },

    /* --- Chatti (Brass/Steel Bells) --- */
    { src: "Gallery/Brass-Chatti-11inch.jpg",      name: "Brass Chatti 11 Inch",      cat: "temple" },
    { src: "Gallery/Chatti-Brass-1.jpg",           name: "Chatti Brass 1",            cat: "temple" },
    { src: "Gallery/Chatti-Brass-Front-View.jpg",  name: "Chatti Brass (Front View)", cat: "temple" },
    { src: "Gallery/Chatti-Brass-Side-View.jpg",   name: "Chatti Brass (Side View)",  cat: "temple" },
    { src: "Gallery/Chatti-Brass.jpg",             name: "Chatti Brass",              cat: "temple" },
    { src: "Gallery/Chatti-BrassTop-View.jpg",     name: "Chatti Brass (Top View)",   cat: "temple" },
    { src: "Gallery/Chatti-Steel-1.jpg",           name: "Chatti Steel 1",            cat: "temple" },
    { src: "Gallery/Chatti-Steel-Side-View.jpg",   name: "Chatti Steel (Side View)",  cat: "temple" },
    { src: "Gallery/Chatti-Steel.jpg",             name: "Chatti Steel",              cat: "temple" },

    /* --- Wind / Brass Band --- */
    { src: "Gallery/Nadeswaram-3-Joint.jpg",       name: "Nadeswaram 3 Joint",        cat: "wind" },
    { src: "Gallery/Nadeswaram-With-Cover.jpg",    name: "Nadeswaram With Cover",     cat: "wind" },
    { src: "Gallery/Nadeswaram.jpg",               name: "Nadeswaram",                cat: "wind" },
    { src: "Gallery/Shennai12-Inch-14-Inch-16-Inch.jpg", name: "Shennai 12-14-16 Inch", cat: "wind" },
    { src: "Gallery/Clarinet-B-Flat.jpg",          name: "Clarinet B Flat",           cat: "wind" },
    { src: "Gallery/Clarinet-Big-Small.jpg",       name: "Clarinet Big & Small",      cat: "wind" },
    { src: "Gallery/Clarinet-E-Flat.jpg",          name: "Clarinet E Flat",           cat: "wind" },
    { src: "Gallery/Clarinet.jpg",                 name: "Clarinet",                  cat: "wind" },
    { src: "Gallery/Saxaphone-Alto-Long-Bell.jpg", name: "Saxophone Alto Long Bell",  cat: "wind" },
    { src: "Gallery/Trumpet-Short-Long-Bell.jpg",  name: "Trumpet Short & Long Bell", cat: "wind" },
    { src: "Gallery/Trumpet-With-Bag.jpg",         name: "Trumpet With Bag",          cat: "wind" },
    { src: "Gallery/Trumpet.jpg",                  name: "Trumpet",                   cat: "wind" },
    { src: "Gallery/Cornet.jpg",                   name: "Cornet",                    cat: "wind" },
    { src: "Gallery/Baritone.jpg",                 name: "Baritone",                  cat: "wind" },
    { src: "Gallery/Euphonium.jpg",                name: "Euphonium",                 cat: "wind" },
    { src: "Gallery/Bugle-Copper-Nickel.jpg",      name: "Bugle Copper Nickel",       cat: "wind" },
    { src: "Gallery/Bugule.jpg",                   name: "Bugle",                     cat: "wind" },

    /* --- Brass Kombu / Thiruchinnam --- */
    { src: "Gallery/Brass-Kombu-2-Joint.jpg",      name: "Brass Kombu 2 Joint",       cat: "temple" },
    { src: "Gallery/Kombu-Brass.jpg",              name: "Kombu Brass",               cat: "temple" },
    { src: "Gallery/Thuttari(brass).jpg",          name: "Thuttari (Brass)",          cat: "temple" },

    /* --- Bumbai / Shoulder Hang --- */
    { src: "Gallery/Bumbai-Set-Brass.jpg",             name: "Bumbai Set Brass",             cat: "wind" },
    { src: "Gallery/Bumbai-Set-BrassStraight-View.jpg",name: "Bumbai Set Brass (Straight View)", cat: "wind" },
    { src: "Gallery/Shoulder-Hang-Drum.jpg",           name: "Shoulder Hang Drum",           cat: "drums" },

    /* --- Band Sticks / Major --- */
    { src: "Gallery/Major-Band-Stick.jpg",  name: "Major Band Stick",  cat: "drums" },
    { src: "Gallery/Major-Stick.jpg",       name: "Major Stick",       cat: "drums" },

    /* --- Bharatanatyam --- */
    { src: "Gallery/Bharadanathiyam-Leg-Chalangai-3-Rows.jpg", name: "Bharatanatyam Chalangai 3 Rows", cat: "folk" },
    { src: "Gallery/Bharadanathiyam-Leg-Chalangai-5-Rows.jpg", name: "Bharatanatyam Chalangai 5 Rows", cat: "folk" },
    { src: "Gallery/Bharathanatiyam-Leg-Chalangai.jpg",        name: "Bharatanatyam Leg Chalangai",    cat: "folk" },
    { src: "Gallery/Bharathanatiyam-Nattu-Vanga-Thalam.jpg",   name: "Bharatanatyam Nattu Vanga Thalam", cat: "folk" },
    { src: "Gallery/Bharathanattiyam-Nattu-Vanga-Kattai.jpg",  name: "Bharatanatyam Nattu Vanga Kattai", cat: "folk" },
    { src: "Gallery/Leg-Chalangai-3-Rows.jpg",                 name: "Leg Chalangai 3 Rows",           cat: "folk" },

    /* --- Store Showroom --- */
    { src: "Gallery/WhatsApp%20Image%202026-08-05%20at%2010.55.47%20PM.jpeg",      name: "Store Display – 1",  cat: "store" },
    { src: "Gallery/WhatsApp%20Image%202026-08-05%20at%2010.55.47%20PM%20%281%29.jpeg", name: "Store Display – 2",  cat: "store" },
    { src: "Gallery/showroom1.png",         name: "Store Showroom View",cat: "store" },
  ];

  /* =========================================================
     2. CATEGORY LABEL MAP
     ========================================================= */
  const CAT_LABELS = {
    harmonium: "Harmonium",
    flute:     "Flute",
    string:    "Strings",
    drums:     "Drums & Percussion",
    folk:      "Folk",
    temple:    "Temple",
    wind:      "Wind",
    store:     "Showroom"
  };

  /* =========================================================
     3. DOM REFERENCES
     ========================================================= */
  const grid     = document.getElementById("gallery-grid");
  const empty    = document.getElementById("gallery-empty");
  const searchEl = document.getElementById("gallery-search");
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");
  const resultCount = document.getElementById("gallery-result-count");
  const viewGridBtn = document.getElementById("view-grid");
  const viewListBtn = document.getElementById("view-list");

  // Lightbox
  const lightbox  = document.getElementById("gallery-lightbox");
  const lbImg     = document.getElementById("lightbox-img");
  const lbCaption = document.getElementById("lightbox-caption");
  const lbCounter = document.getElementById("lightbox-counter");
  const lbClose   = document.getElementById("lightbox-close");
  const lbPrev    = document.getElementById("lightbox-prev");
  const lbNext    = document.getElementById("lightbox-next");
  const lbBdrop   = document.getElementById("lightbox-backdrop");

  // Mode toggle
  const modeToggle = document.getElementById("mode-toggle");
  const modeLabel  = document.getElementById("mode-label");

  /* =========================================================
     4. STATE
     ========================================================= */
  let activeFilter = "all";
  let searchQuery  = "";
  let currentView  = "grid";
  let lbIndex      = 0;
  let filteredItems = [...INSTRUMENTS];

  /* =========================================================
     5. RENDER GALLERY
     ========================================================= */
  function buildGrid() {
    grid.innerHTML = "";

    filteredItems = INSTRUMENTS.filter((item) => {
      const matchCat   = activeFilter === "all" || item.cat === activeFilter;
      const matchQuery = !searchQuery || item.name.toLowerCase().includes(searchQuery);
      return matchCat && matchQuery;
    });

    if (filteredItems.length === 0) {
      empty.style.display = "block";
      resultCount.textContent = "No instruments found.";
      return;
    }

    empty.style.display = "none";
    resultCount.textContent =
      filteredItems.length === INSTRUMENTS.length
        ? `Showing all ${INSTRUMENTS.length} instruments`
        : `Showing ${filteredItems.length} of ${INSTRUMENTS.length} instruments`;

    filteredItems.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "gallery-card";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `Open ${item.name}`);
      card.dataset.index = idx;

      const imgSrc = item.src.startsWith("http") ? item.src : GH_BASE + item.src;
      // Use category-specific fallback so every card shows a DIFFERENT relevant image
      const fallbackSrc = CAT_FALLBACKS[item.cat] || DEFAULT_FALLBACK;
      card.innerHTML = `
        <div class="gallery-card-img-wrap">
          <img
            class="gallery-card-img"
            src="${imgSrc}"
            alt="${item.name}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${fallbackSrc}';"
          />
          <div class="gallery-card-overlay">
            <span class="gallery-card-zoom">&#128269; View</span>
          </div>
          <span class="gallery-card-badge">${CAT_LABELS[item.cat] || item.cat}</span>
        </div>
        <div class="gallery-card-body">
          <div class="gallery-card-name">${item.name}</div>
          <div class="gallery-card-cat">${CAT_LABELS[item.cat] || item.cat}</div>
        </div>`;

      card.addEventListener("click", () => openLightbox(idx));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(idx); }
      });

      grid.appendChild(card);
    });
  }

  /* =========================================================
     6. FILTER & SEARCH
     ========================================================= */
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeFilter = btn.dataset.filter;
      buildGrid();
    });
  });

  let searchDebounce;
  searchEl.addEventListener("input", () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      searchQuery = searchEl.value.trim().toLowerCase();
      buildGrid();
    }, 200);
  });

  /* =========================================================
     7. VIEW TOGGLE
     ========================================================= */
  viewGridBtn.addEventListener("click", () => {
    currentView = "grid";
    grid.classList.remove("is-list");
    viewGridBtn.classList.add("is-active");
    viewListBtn.classList.remove("is-active");
  });

  viewListBtn.addEventListener("click", () => {
    currentView = "list";
    grid.classList.add("is-list");
    viewListBtn.classList.add("is-active");
    viewGridBtn.classList.remove("is-active");
  });

  /* =========================================================
     8. LIGHTBOX
     ========================================================= */
  function openLightbox(idx) {
    lbIndex = idx;
    updateLightbox();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    const item = filteredItems[lbIndex];
    const imgSrc = item.src.startsWith("http") ? item.src : GH_BASE + item.src;
    lbImg.src = imgSrc;
    lbImg.alt = item.name;
    lbCaption.textContent = item.name;
    lbCounter.textContent = `${lbIndex + 1} / ${filteredItems.length}`;
    // Restart zoom animation
    lbImg.style.animation = "none";
    lbImg.offsetHeight; // reflow
    lbImg.style.animation = "";
  }

  lbClose.addEventListener("click", closeLightbox);
  lbBdrop.addEventListener("click", closeLightbox);

  lbPrev.addEventListener("click", () => {
    lbIndex = (lbIndex - 1 + filteredItems.length) % filteredItems.length;
    updateLightbox();
  });

  lbNext.addEventListener("click", () => {
    lbIndex = (lbIndex + 1) % filteredItems.length;
    updateLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") { lbIndex = (lbIndex - 1 + filteredItems.length) % filteredItems.length; updateLightbox(); }
    if (e.key === "ArrowRight") { lbIndex = (lbIndex + 1) % filteredItems.length; updateLightbox(); }
  });

  // Touch/swipe support for lightbox
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx > 0) { lbIndex = (lbIndex - 1 + filteredItems.length) % filteredItems.length; }
      else        { lbIndex = (lbIndex + 1) % filteredItems.length; }
      updateLightbox();
    }
  }, { passive: true });

  /* =========================================================
     9. DARK / LIGHT MODE TOGGLE
     ========================================================= */
  const HTML = document.documentElement;

  function applyMode(mode) {
    HTML.setAttribute("data-mode", mode);
    modeLabel.textContent = mode === "dark" ? "Dark" : "Light";
    try { localStorage.setItem("kmm_display_mode", mode); } catch(e) {}
  }

  // Restore saved preference
  try {
    const saved = localStorage.getItem("kmm_display_mode");
    if (saved === "light" || saved === "dark") applyMode(saved);
  } catch(e) {}

  modeToggle.addEventListener("click", () => {
    const current = HTML.getAttribute("data-mode") || "dark";
    applyMode(current === "dark" ? "light" : "dark");
  });

  /* =========================================================
     10. TAMIL MUSIC PLAYER
     ========================================================= */
  const TRACKS = [
    { name: "Carnatic Veena Meditation",  artist: "Classical Tamil",   url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { name: "Flute Raaga Bhairavi",       artist: "Carnatic Classical", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { name: "Mridangam Rhythms",          artist: "Percussion Tamil",   url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { name: "Nadaswaram Melody",          artist: "Temple Music",       url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { name: "Harmonium Devotional",       artist: "Bhakti Classical",   url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { name: "Tabla & Sitar Fusion",       artist: "Indo-Classical",     url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { name: "Thavil & Nadesaram",         artist: "Tamil Folk Music",   url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { name: "Kolattam Folk Beats",        artist: "Tamil Village Folk",  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  ];

  let currentTrack  = 0;
  let isPlaying     = false;
  let audio         = null;

  const musicWidget    = document.getElementById("music-player-widget");
  const musicToggle    = document.getElementById("music-toggle");
  const musicPanel     = document.getElementById("music-panel");
  const musicClose     = document.getElementById("music-panel-close");
  const musicPlayPause = document.getElementById("music-play-pause");
  const musicPrev      = document.getElementById("music-prev");
  const musicNext      = document.getElementById("music-next");
  const musicVolume    = document.getElementById("music-volume");
  const musicTrackName = document.getElementById("music-track-name");
  const musicArtist    = document.getElementById("music-track-artist");
  const musicTrackList = document.getElementById("music-track-list");
  const musicDisk      = document.getElementById("music-disk");

  function initAudio() {
    if (!audio) {
      audio = new Audio();
      audio.volume = musicVolume.value / 100;
      audio.addEventListener("ended", nextTrack);
      audio.addEventListener("error", () => {
        // fallback: skip to next on error
        setTimeout(nextTrack, 800);
      });
    }
  }

  function loadTrack(idx) {
    initAudio();
    currentTrack = idx;
    const t = TRACKS[idx];
    audio.src = t.url;
    musicTrackName.textContent = t.name;
    musicArtist.textContent    = t.artist;
    updateTrackListUI();
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }

  function playPause() {
    initAudio();
    if (!audio.src) loadTrack(currentTrack);
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      musicPlayPause.innerHTML = "&#9654;";
      musicPlayPause.setAttribute("aria-label", "Play");
      musicWidget.classList.remove("is-playing");
    } else {
      audio.play().catch(() => {
        window.KMM_TOAST && window.KMM_TOAST({ type: "info", title: "Music", message: "Tap play to enjoy background music." });
      });
      isPlaying = true;
      musicPlayPause.innerHTML = "&#9646;&#9646;";
      musicPlayPause.setAttribute("aria-label", "Pause");
      musicWidget.classList.add("is-playing");
    }
  }

  function nextTrack() {
    currentTrack = (currentTrack + 1) % TRACKS.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play().catch(() => {});
  }

  function prevTrack() {
    currentTrack = (currentTrack - 1 + TRACKS.length) % TRACKS.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play().catch(() => {});
  }

  function buildTrackList() {
    musicTrackList.innerHTML = "";
    TRACKS.forEach((t, i) => {
      const item = document.createElement("div");
      item.className = "music-track-item" + (i === currentTrack ? " is-active" : "");
      item.innerHTML = `<span class="music-track-num">${i + 1}</span><span>${t.name}</span>`;
      item.addEventListener("click", () => {
        loadTrack(i);
        if (!isPlaying) { playPause(); }
        else { audio.play().catch(() => {}); }
      });
      musicTrackList.appendChild(item);
    });
  }

  function updateTrackListUI() {
    musicTrackList.querySelectorAll(".music-track-item").forEach((el, i) => {
      el.classList.toggle("is-active", i === currentTrack);
    });
  }

  // Music panel open/close
  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    musicWidget.classList.toggle("panel-open");
    if (musicWidget.classList.contains("panel-open")) {
      buildTrackList();
      musicTrackName.textContent = TRACKS[currentTrack].name;
      musicArtist.textContent    = TRACKS[currentTrack].artist;
    }
  });

  musicClose.addEventListener("click", () => {
    musicWidget.classList.remove("panel-open");
  });

  document.addEventListener("click", (e) => {
    if (!musicWidget.contains(e.target)) {
      musicWidget.classList.remove("panel-open");
    }
  });

  musicPlayPause.addEventListener("click", playPause);
  musicPrev.addEventListener("click", prevTrack);
  musicNext.addEventListener("click", nextTrack);

  musicVolume.addEventListener("input", () => {
    if (audio) audio.volume = musicVolume.value / 100;
  });

  // Init first track name display
  musicTrackName.textContent = TRACKS[0].name;
  musicArtist.textContent    = TRACKS[0].artist;

  /* =========================================================
     11. INITIAL BUILD
     ========================================================= */
  buildGrid();

})();
  