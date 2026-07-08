export type PackingItem = {
  id: string;
  label: string;
  note?: string;
};

export type PackingCategory = {
  title: string;
  icon: string;
  color: string;
  items: PackingItem[];
};

// Stable ids are used as localStorage keys — do not rename them once shipped.
export const packing: PackingCategory[] = [
  {
    title: "Plávanie",
    icon: "🏊",
    color: "var(--swim)",
    items: [
      { id: "neopren", label: "Neoprén" },
      { id: "tri-plavky", label: "TRI plavky" },
      { id: "plavecka-ciapka", label: "Plavecká čiapka" },
      { id: "plavecke-okuliare", label: "Plavecké okuliare" },
    ],
  },
  {
    title: "Bicykel",
    icon: "🚴",
    color: "var(--bike)",
    items: [
      { id: "prilba", label: "Prilba" },
      { id: "ciapka-pod-prilbu", label: "Čiapka pod prilbu" },
      { id: "cyklodres", label: "Cyklodres" },
      { id: "cyklovesta", label: "Cyklovesta" },
      { id: "rukavniky", label: "Rukávniky" },
      { id: "cyklo-ponozky", label: "Cyklo ponožky" },
      { id: "rukavice", label: "Rukavice" },
      { id: "cyklookuliare", label: "Cyklookuliare" },
      { id: "tretry", label: "Tretry" },
      { id: "cykloflase", label: "Cyklofľaše" },
      { id: "servis", label: "Servis (náradie, duša, pumpička)" },
      { id: "bike-gely-tycinky", label: "Gély a tyčinky" },
    ],
  },
  {
    title: "Beh",
    icon: "🏃",
    color: "var(--run)",
    items: [
      { id: "bezecke-triko", label: "Tričko na beh" },
      { id: "bezecka-vesta", label: "Bežecká vesta" },
      { id: "racing-belt", label: "Racing belt" },
      { id: "siltovka", label: "Šiltovka" },
      { id: "bezecke-podkolienky", label: "Bežecké podkolienky" },
      { id: "run-flase", label: "Fľaše" },
      { id: "run-tycinky", label: "Tyčinky" },
      { id: "bunda-na-dazd", label: "Bunda na dážď" },
    ],
  },
  {
    title: "Oblečenie / ochrana",
    icon: "🧥",
    color: "var(--brick)",
    items: [
      { id: "mast-na-odery", label: "Masť na odery" },
      { id: "topanky", label: "Topánky" },
    ],
  },
  {
    title: "Výživa",
    icon: "🍫",
    color: "var(--summit)",
    items: [
      { id: "gely-tycinky", label: "Gély a tyčinky" },
      { id: "iontak", label: "Ionták" },
      { id: "datle", label: "Ďatle" },
      { id: "kesu", label: "Kešu oriešky" },
    ],
  },
  {
    title: "Lekárnička",
    icon: "💊",
    color: "var(--race)",
    items: [
      { id: "imodium", label: "Imodium" },
      { id: "stop-krcom", label: "Stop kŕčom" },
    ],
  },
  {
    title: "Komfort / ostatné",
    icon: "🛏️",
    color: "var(--rest)",
    items: [
      { id: "vankus", label: "Vankúš" },
      { id: "vino", label: "Víno" },
    ],
  },
];
