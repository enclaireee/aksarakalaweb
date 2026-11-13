export interface LocalizedText {
  en: string;
  id: string;
}

export interface SpellEntry {
  id: string;
  script: "sunda" | "jawa";
  scriptLabel: LocalizedText;
  glyph: string;
  romanized: string;
  spellName: LocalizedText;
  saktiCost: number;
  color: string;
  effect: LocalizedText;
  /** Normalized [x, y] waypoints (0..1) for the tracing guide & burst origin */
  guidePath: Array<[number, number]>;
}

export const SPELLS: SpellEntry[] = [
  {
    id: "sunda_ka",
    script: "sunda",
    scriptLabel: { en: "Aksara Sunda", id: "Aksara Sunda" },
    glyph: "ᮊ",
    romanized: "Ka",
    spellName: { en: "Bolt (Panah Api)", id: "Bolt (Panah Api)" },
    saktiCost: 15,
    color: "#f49d5a",
    effect: {
      en: "Fires a piercing fiery bolt (36 dmg + burn). Also the glyph Laras writes on her torn lontar so you never forget her.",
      id: "Menembakkan panah api menembus musuh (36 dmg + bakar). Juga aksara yang ditulis Laras di lontar agar ingatanmu tak pudar.",
    },
    guidePath: [
      [0.25, 0.28],
      [0.25, 0.72],
      [0.25, 0.45],
      [0.52, 0.3],
      [0.52, 0.72],
      [0.75, 0.32],
      [0.75, 0.72],
    ],
  },
  {
    id: "sunda_ca",
    script: "sunda",
    scriptLabel: { en: "Aksara Sunda", id: "Aksara Sunda" },
    glyph: "ᮎ",
    romanized: "Ca",
    spellName: { en: "Burst (Ledakan)", id: "Burst (Ledakan)" },
    saktiCost: 30,
    color: "#5ef2ff",
    effect: {
      en: "Unleashes a radial shockwave (52 dmg, 72 px) that knocks enemies back and shatters cracked seals.",
      id: "Melepaskan gelombang kejut melingkar (52 dmg, 72 px) yang mendorong musuh dan menghancurkan segel retak.",
    },
    guidePath: [
      [0.28, 0.32],
      [0.28, 0.7],
      [0.7, 0.7],
      [0.7, 0.32],
      [0.45, 0.48],
    ],
  },
  {
    id: "sunda_ga",
    script: "sunda",
    scriptLabel: { en: "Aksara Sunda", id: "Aksara Sunda" },
    glyph: "ᮌ",
    romanized: "Ga",
    spellName: { en: "Ward (Perisai)", id: "Ward (Perisai)" },
    saktiCost: 25,
    color: "#fce09b",
    effect: {
      en: "Raises a protective barrier absorbing 60 dmg for 10s. Detonates in a 56 px shove when shattered.",
      id: "Membentuk perisai pelindung yang menyerap 60 dmg selama 10 detik. Meledak mendorong musuh saat pecah.",
    },
    guidePath: [
      [0.24, 0.32],
      [0.42, 0.72],
      [0.58, 0.36],
      [0.76, 0.72],
    ],
  },
  {
    id: "jawa_ha",
    script: "jawa",
    scriptLabel: { en: "Aksara Jawa", id: "Aksara Jawa" },
    glyph: "ꦲ",
    romanized: "Ha",
    spellName: { en: "Heal (Pulih)", id: "Heal (Pulih)" },
    saktiCost: 35,
    color: "#6ee7b7",
    effect: {
      en: "Restores 30% max HP immediately plus 20% over 5s while cleansing Curse, Burn, and Slow.",
      id: "Memulihkan 30% HP seketika dan 20% selama 5 detik sambil membersihkan Kutukan, Bakar, dan Lambat.",
    },
    guidePath: [
      [0.22, 0.68],
      [0.26, 0.34],
      [0.45, 0.68],
      [0.62, 0.34],
      [0.78, 0.68],
    ],
  },
  {
    id: "jawa_ka",
    script: "jawa",
    scriptLabel: { en: "Aksara Jawa", id: "Aksara Jawa" },
    glyph: "ꦏ",
    romanized: "Ka (Ombak)",
    spellName: { en: "Ombak (Tide Wave)", id: "Ombak (Gelombang)" },
    saktiCost: 35,
    color: "#38bdf8",
    effect: {
      en: "Earned at the Trial of the Waves in Segara Kidul. Sends a surging tide (44 dmg) that erases enemy projectiles.",
      id: "Diperoleh di Ujian Ombak Segara Kidul. Mengirim gelombang pasang (44 dmg) yang melenyapkan proyektil musuh.",
    },
    guidePath: [
      [0.22, 0.68],
      [0.28, 0.32],
      [0.48, 0.66],
      [0.66, 0.32],
      [0.76, 0.56],
      [0.62, 0.72],
    ],
  },
];

export interface SealEntry {
  number: string;
  title: LocalizedText;
  legend: LocalizedText;
  description: LocalizedText;
}

export const GREAT_SEALS: SealEntry[] = [
  {
    number: "I",
    title: { en: "The Crater Seal", id: "Segel Kawah" },
    legend: { en: "Sangkuriang · Tangkuban Perahu", id: "Sangkuriang · Tangkuban Perahu" },
    description: {
      en: "Broken at Tangkuban Perahu, replaying the mythic flood. End the story again with the false dawn and Sunda Ca.",
      id: "Pecah di Tangkuban Perahu, mengulang legenda banjir purba. Akhiri kembali kisahnya dengan fajar palsu dan Sunda Ca.",
    },
  },
  {
    number: "II",
    title: { en: "The Royal Name of Galuh", id: "Nama Raja Galuh" },
    legend: { en: "Prabu Barma Wijaya · Batu Tulis", id: "Prabu Barma Wijaya · Batu Tulis" },
    description: {
      en: "A stolen name scraped off the Batu Tulis inscription. Unmask the false king and carve Nagawiru's true name.",
      id: "Nama agung yang terhapus dari Batu Tulis. Singkap raja palsu dan pahatkan kembali nama sejati Nagawiru.",
    },
  },
  {
    number: "III",
    title: { en: "The Thousand Temples", id: "Seribu Candi" },
    legend: { en: "Bandung Bondowoso · Candi Seribu", id: "Bandung Bondowoso · Candi Seribu" },
    description: {
      en: "Temples rising through the night under a broken oath. Sound the lesung rhythm and shatter the unanchored pillars.",
      id: "Candi-candi bangkit di tengah malam akibat sumpah yang terlanggar. Bunyikan lesung fajar dan runtuhkan pilar tanpa jangkar.",
    },
  },
  {
    number: "IV",
    title: { en: "The Seven-Generation Blade", id: "Keris Tujuh Turunan" },
    legend: { en: "Mpu Gandring · Eastern Shrine", id: "Mpu Gandring · Kuil Timur" },
    description: {
      en: "A cursed keris drawn at the Eastern Shrine, awakening the Eclipse of Batara Kala. Cleanse all seven stakes.",
      id: "Keris terkutuk yang terhunus di Kuil Timur, membangkitkan Gerhana Batara Kala. Bersihkan ketujuh pasak kutukan.",
    },
  },
];

export interface RegionEntry {
  id: string;
  index: number;
  name: string;
  areas: number;
  act: LocalizedText;
  folklore: LocalizedText;
  summary: LocalizedText;
  landmarks: string[];
  accent: string;
}

export const REGIONS: RegionEntry[] = [
  {
    id: "desa_purwa",
    index: 0,
    name: "Desa Purwa",
    areas: 1,
    act: { en: "Prologue & Epilogue", id: "Prolog & Epilog" },
    folklore: { en: "Home Village · Torn Lontar", id: "Desa Asal · Lontar Robek" },
    summary: {
      en: "A quiet kampung where the story begins—and where everyone but you and Semar forgets Laras overnight.",
      id: "Kampung tenang tempat kisah bermula—dan tempat semua orang kecuali dirimu dan Semar melupakan Laras dalam semalam.",
    },
    landmarks: ["Rumah Ibu", "Sanggar Latihan", "Petilasan Purwa"],
    accent: "#fce09b",
  },
  {
    id: "tatar_sunda",
    index: 1,
    name: "Tatar Sunda",
    areas: 8,
    act: { en: "Act I · The Crater Seal", id: "Babak I · Segel Kawah" },
    folklore: { en: "Sangkuriang & Dayang Sumbi", id: "Sangkuriang & Dayang Sumbi" },
    summary: {
      en: "Lush tea hills, bamboo forests, and a rising volcanic crater lake. Learn the four foundational Aksara Sunda glyphs.",
      id: "Perbukitan teh, hutan bambu, dan danau kawah yang meluap. Pelajari empat aksara dasar Aksara Sunda.",
    },
    landmarks: ["Kampung Sunda", "Leuweung", "Kawah Tangkuban"],
    accent: "#6ee7b7",
  },
  {
    id: "keraton_galuh",
    index: 2,
    name: "Keraton Galuh",
    areas: 7,
    act: { en: "Act II · The Borrowed Face", id: "Babak II · Wajah Pinjaman" },
    folklore: { en: "Galuh Court & Batu Tulis", id: "Keraton Galuh & Batu Tulis" },
    summary: {
      en: "Palace courtyards, royal archives, and shadow intrigue where a king traded his true name to Kala.",
      id: "Pelataran keraton, pustaka kerajaan, dan intrik istana tempat seorang raja menukar nama sejatinya kepada Kala.",
    },
    landmarks: ["Alun-Alun", "Kaputren", "Pustaka Keraton"],
    accent: "#f49d5a",
  },
  {
    id: "mataram",
    index: 3,
    name: "Mataram",
    areas: 8,
    act: { en: "Act III · Blood on the Pamali", id: "Babak III · Darah di Pamali" },
    folklore: { en: "Bandung Bondowoso & Roro Jonggrang", id: "Bandung Bondowoso & Roro Jonggrang" },
    summary: {
      en: "Ancient candi ruins, rice terraces, and sacred Pamali stones. Master Aksara Jawa glyphs to halt the thousand temples.",
      id: "Reruntuhan candi purba, sawah terasering, dan batu Pamali. Kuasai Aksara Jawa untuk menghentikan seribu candi.",
    },
    landmarks: ["Candi Seribu", "Gapura Mataram", "Pasar Lama"],
    accent: "#c084fc",
  },
  {
    id: "tanah_timur",
    index: 4,
    name: "Tanah Timur",
    areas: 8,
    act: { en: "Act IV · The Seven-Generation Blade", id: "Babak IV · Keris Tujuh Turunan" },
    folklore: { en: "Mpu Gandring & Ken Arok", id: "Mpu Gandring & Ken Arok" },
    summary: {
      en: "Sun-baked savannas, sacred banyan groves, and wind-carved sands guarding the cursed forge.",
      id: "Sabana terik, hutan beringin keramat, dan padang pasir yang menjaga perapian keris terkutuk.",
    },
    landmarks: ["Beringin Agung", "Pesisir Timur", "Candi Timur"],
    accent: "#fb923c",
  },
  {
    id: "segara_kidul",
    index: 5,
    name: "Segara Kidul",
    areas: 7,
    act: { en: "Act V · The Sea Does Not Forget", id: "Babak V · Laut Tak Pernah Lupa" },
    folklore: { en: "Southern Sea & Nyai Roro Kidul", id: "Laut Selatan & Nyai Roro Kidul" },
    summary: {
      en: "Tidal cliffs, coral caves, and the submerged green court where the Ombak glyph is forged.",
      id: "Tebing karang, gua laut, dan keraton samudra tempat aksara Ombak ditempa.",
    },
    landmarks: ["Pantai Kidul", "Gua Karang", "Keraton Segara"],
    accent: "#5ef2ff",
  },
  {
    id: "gua_kala",
    index: 6,
    name: "Gua Kala",
    areas: 7,
    act: { en: "Act VI · Into the Maw of Time", id: "Babak VI · Menuju Mulut Waktu" },
    folklore: { en: "Batara Kala & The Eclipse", id: "Batara Kala & Gerhana" },
    summary: {
      en: "A cavern of forgotten names and shifting sand-clocks leading to the final confrontation with Batara Kala.",
      id: "Gua nama-nama yang terlupakan dan jam pasir waktu menuju pertarungan terakhir melawan Batara Kala.",
    },
    landmarks: ["Mulut Gua", "Jembatan Lupa", "Ruang Kala"],
    accent: "#f43f5e",
  },
];

export interface ClassEntry {
  id: string;
  school: "Warrior" | "Archer" | "Rogue" | "Mage";
  pathType: "First Path" | "Second Path";
  titleId: string;
  titleEn: string;
  weapon: string;
  signatureAksara: string;
  sprite: string;
  accent: string;
  description: LocalizedText;
}

export const CLASSES: ClassEntry[] = [
  {
    id: "warrior",
    school: "Warrior",
    pathType: "First Path",
    titleId: "Hulubalang",
    titleEn: "Vanguard",
    weapon: "Kelewang",
    signatureAksara: "Sunda Ha (ᮠ)",
    sprite: "/assets/sprites/class_warrior.png",
    accent: "#ef4444",
    description: {
      en: "Frontline vanguard bearing a heavy Kelewang and round tameng shield, unleashing radial shockwaves.",
      id: "Garda depan bersenjata Kelewang berat dan perisai tameng, melancarkan gelombang kejut penghancur barisan.",
    },
  },
  {
    id: "lancer",
    school: "Warrior",
    pathType: "Second Path",
    titleId: "Prajurit",
    titleEn: "Palace Spearman",
    weapon: "Tombak",
    signatureAksara: "Jawa Ga (ꦒ)",
    sprite: "/assets/sprites/class_lancer.png",
    accent: "#f97316",
    description: {
      en: "Disciplined keraton spearman in black kuluk and lurik, piercing foes at mid-range with a tasseled Tombak.",
      id: "Prajurit keraton berkuluk hitam dan lurik, menusuk musuh dari jarak menengah dengan Tombak berumbai.",
    },
  },
  {
    id: "archer",
    school: "Archer",
    pathType: "First Path",
    titleId: "Pamanah",
    titleEn: "Bowman",
    weapon: "Gendewa",
    signatureAksara: "Sunda Pa (ᮕ)",
    sprite: "/assets/sprites/class_archer.png",
    accent: "#22c55e",
    description: {
      en: "Agile forest marksman armed with a Gendewa bow, kiting enemies with piercing multi-arrow spell fans.",
      id: "Pemanah rimba tangkas dengan busur Gendewa, menjaga jarak sambil menembakkan kipas panah mantra.",
    },
  },
  {
    id: "herder",
    school: "Archer",
    pathType: "Second Path",
    titleId: "Pangangon",
    titleEn: "Herder",
    weapon: "Bandring",
    signatureAksara: "Sunda Ba (ᮘ)",
    sprite: "/assets/sprites/class_herder.png",
    accent: "#eab308",
    description: {
      en: "Wandering shepherd wearing a wide straw caping, hurling high-velocity stones from a Sundanese Bandring sling.",
      id: "Penggembala bercaping jerami yang melontarkan batu berkecepatan tinggi dengan Bandring khas Sunda.",
    },
  },
  {
    id: "rogue",
    school: "Rogue",
    pathType: "First Path",
    titleId: "Pendekar",
    titleEn: "Silat Fighter",
    weapon: "Kujang",
    signatureAksara: "Jawa Pa (ꦥ)",
    sprite: "/assets/sprites/class_rogue.png",
    accent: "#f43f5e",
    description: {
      en: "Swift silat martial artist wielding a reverse-grip Kujang, excelling at flanking, binding, and backstabs.",
      id: "Pendekar silat lincah bersenjata Kujang, unggul dalam sergapan samping, ikatan mantra, dan serangan balik.",
    },
  },
  {
    id: "dancer",
    school: "Rogue",
    pathType: "Second Path",
    titleId: "Penari Topeng",
    titleEn: "Mask Dancer",
    weapon: "Kipas",
    signatureAksara: "Sunda Ta (ᮒ)",
    sprite: "/assets/sprites/class_dancer.png",
    accent: "#ec4899",
    description: {
      en: "Cirebon mask dancer weaving through combat with twin Kipas fans and flowing teal selendang silk.",
      id: "Penari topeng yang menari di tengah pertarungan dengan sepasang Kipas dan selendang sutra.",
    },
  },
  {
    id: "mage",
    school: "Mage",
    pathType: "First Path",
    titleId: "Wiku",
    titleEn: "Scribe-Sage",
    weapon: "Tongkat",
    signatureAksara: "Jawa Wa (ꦮ)",
    sprite: "/assets/sprites/class_mage.png",
    accent: "#5ef2ff",
    description: {
      en: "Scholar-mystic carrying a glowing lontar at the hip and ringed Tongkat, boasting rapid Sakti recharge.",
      id: "Resi penulis dengan lontar bercahaya dan Tongkat berlingkar, memiliki pemulihan Sakti tercepat.",
    },
  },
  {
    id: "dalang",
    school: "Mage",
    pathType: "Second Path",
    titleId: "Dalang",
    titleEn: "Shadow Puppeteer",
    weapon: "Kayon",
    signatureAksara: "Jawa La (ꦭ)",
    sprite: "/assets/sprites/class_dalang.png",
    accent: "#a855f7",
    description: {
      en: "Master of the shadow screen channeling wayang spirits and cosmic time through a sacred Kayon gunungan staff.",
      id: "Dalang penguasa kelir yang memanggil roh pewayangan dan waktu melalui tongkat suci Kayon gunungan.",
    },
  },
];

export const CONTROLS = [
  { key: "W A S D", action: { en: "8-Directional Move", id: "Gerak 8 Arah" } },
  { key: "LMB", action: { en: "3-Hit Melee / Ranged Combo", id: "Kombo 3 Pukulan / Tembakan" } },
  { key: "RMB (Hold)", action: { en: "Slow-Mo & Draw Aksara", id: "Gerak Lambat & Gambar Aksara" } },
  { key: "Space", action: { en: "Dodge Roll (i-frames)", id: "Menghindar (i-frames)" } },
  { key: "Q / E", action: { en: "Jamu Flask / Interact", id: "Minum Jamu / Interaksi" } },
  { key: "Tab / M", action: { en: "Grimoire & World Map", id: "Grimoire & Peta Dunia" } },
];
