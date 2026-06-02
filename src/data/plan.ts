import type { PlanContent } from "../types";

export const plan: PlanContent = {
  "facts": [
    {
      "value": "2 km",
      "label": "Plávanie · L. Mara"
    },
    {
      "value": "86 km / 1850 m",
      "label": "Bicykel"
    },
    {
      "value": "19,5 km / 1250 m",
      "label": "Beh · Brestová 1902 m"
    },
    {
      "value": "12:30",
      "label": "STOP-čas T2"
    }
  ],
  "weeks": [
    {
      "tag": "T1",
      "range": "1. – 7. 6.",
      "phase": "BUILD 1 · rozbeh objemu",
      "hours": "~9 h",
      "focus": "Naskočiť späť do objemu, zaradiť prvý trail beh a dlhší bike. Nič na silu — buduj základ.",
      "days": [
        {
          "key": false,
          "race": false,
          "date": "Po 1.6.",
          "color": "#5b6675",
          "type": "Voľno",
          "session": "Voľno / mobilita + core 20′ (deň už za tebou — ber ako reset)"
        },
        {
          "key": false,
          "race": false,
          "date": "Ut 2.6.",
          "color": "#3ec6e0",
          "type": "Plávanie",
          "session": "Plávanie 1,6 km technika + 6×50 m sviežo"
        },
        {
          "key": false,
          "race": false,
          "date": "St 3.6.",
          "color": "#f4a531",
          "type": "Bicykel",
          "session": "Bicykel 70 km / ~1200 m, vytrvalostné Z2, na konci 3×5′ tempovo"
        },
        {
          "key": false,
          "race": false,
          "date": "Št 4.6.",
          "color": "#3ec6e0",
          "type": "Plávanie",
          "session": "Regeneračné plávanie 1,2 km / alebo voľno"
        },
        {
          "key": false,
          "race": false,
          "date": "Pi 5.6.",
          "color": "#e3536b",
          "type": "Beh",
          "session": "Beh 9 km trail / ~250 m, posledné 2 km svižnejšie"
        },
        {
          "key": true,
          "race": false,
          "date": "So 6.6.",
          "color": "#b07cf0",
          "type": "Brick",
          "session": "Mini-brick: bicykel 55 km / ~900 m → hneď 15′ beh"
        },
        {
          "key": false,
          "race": false,
          "date": "Ne 7.6.",
          "color": "#3ec6e0",
          "type": "Plávanie",
          "session": "Plávanie 1,8 km súvislo (test tempa) + mobilita"
        }
      ]
    },
    {
      "tag": "T2",
      "range": "8. – 14. 6.",
      "phase": "BUILD 2 · prvý poriadny brick",
      "hours": "~11 h",
      "focus": "Prvé 2 km súvislé plávanie a prvý dlhý bike blízko pretekovej vzdialenosti s behom z kola.",
      "days": [
        {
          "key": false,
          "race": false,
          "date": "Po 8.6.",
          "color": "#5b6675",
          "type": "Voľno",
          "session": "Voľno / sila core 30′"
        },
        {
          "key": true,
          "race": false,
          "date": "Ut 9.6.",
          "color": "#3ec6e0",
          "type": "Plávanie",
          "session": "Plávanie 2,0 km súvislo (prvý raz plná vzdialenosť) + 4×100 m"
        },
        {
          "key": false,
          "race": false,
          "date": "St 10.6.",
          "color": "#e3536b",
          "type": "Beh",
          "session": "Beh 7 km, v ňom 6×1′ do kopca (vertikál intenzita)"
        },
        {
          "key": false,
          "race": false,
          "date": "Št 11.6.",
          "color": "#f4a531",
          "type": "Bicykel",
          "session": "Bicykel 60 km / ~1000 m Z2"
        },
        {
          "key": false,
          "race": false,
          "date": "Pi 12.6.",
          "color": "#5b6675",
          "type": "Voľno",
          "session": "Voľno alebo plávanie 1,5 km uvoľnene"
        },
        {
          "key": true,
          "race": false,
          "date": "So 13.6.",
          "color": "#b07cf0",
          "type": "Brick",
          "session": "KĽÚČOVÝ: bicykel 85 km / ~1500 m na podobnej trati, sleduj čas → hneď 20′ beh"
        },
        {
          "key": false,
          "race": false,
          "date": "Ne 14.6.",
          "color": "#e3536b",
          "type": "Beh",
          "session": "Beh 11 km trail / ~400 m pohodovo, na stúpaniach run/walk"
        }
      ]
    },
    {
      "tag": "T3",
      "range": "15. – 21. 6.",
      "phase": "PEAK · vertikál + race-sim bike",
      "hours": "~12,5 h",
      "focus": "Najviac stúpania v behu a generálka bicykla pod STOP-časom. Vrchol objemu.",
      "days": [
        {
          "key": false,
          "race": false,
          "date": "Po 15.6.",
          "color": "#5b6675",
          "type": "Voľno",
          "session": "Voľno / mobilita"
        },
        {
          "key": false,
          "race": false,
          "date": "Ut 16.6.",
          "color": "#3ec6e0",
          "type": "Plávanie",
          "session": "Plávanie 2,0 km + ak sa dá open-water test (neoprén, sighting)"
        },
        {
          "key": true,
          "race": false,
          "date": "St 17.6.",
          "color": "#e3536b",
          "type": "Beh",
          "session": "Beh do kopca 8 km / ~500 m — výstupová sila, dole opatrne (technika zbehu)"
        },
        {
          "key": false,
          "race": false,
          "date": "Št 18.6.",
          "color": "#f4a531",
          "type": "Bicykel",
          "session": "Bicykel 50 km / ~900 m, blok 3×8′ tempovo"
        },
        {
          "key": false,
          "race": false,
          "date": "Pi 19.6.",
          "color": "#5b6675",
          "type": "Voľno",
          "session": "Voľno"
        },
        {
          "key": true,
          "race": false,
          "date": "So 20.6.",
          "color": "#b07cf0",
          "type": "Brick",
          "session": "RACE-SIM: bicykel 90 km / ~1700 m (Orava/Liptov), drž pod STOP-časom → 15′ beh"
        },
        {
          "key": true,
          "race": false,
          "date": "Ne 21.6.",
          "color": "#e3536b",
          "type": "Beh",
          "session": "Beh 14 km trail / ~700 m — najdlhší a najkopcovitejší doteraz, run/walk"
        }
      ]
    },
    {
      "tag": "T4",
      "range": "22. – 28. 6.",
      "phase": "PEAK · generálka pretekov",
      "hours": "~12,5 h",
      "focus": "Plnohodnotná generálka so všetkými troma disciplínami a otestovaním výstroja a stravy.",
      "days": [
        {
          "key": false,
          "race": false,
          "date": "Po 22.6.",
          "color": "#5b6675",
          "type": "Voľno",
          "session": "Voľno / regenerácia"
        },
        {
          "key": true,
          "race": false,
          "date": "Ut 23.6.",
          "color": "#3ec6e0",
          "type": "Plávanie",
          "session": "Plávanie 2,0 km otvorená voda (neoprén) — generálka plávania"
        },
        {
          "key": false,
          "race": false,
          "date": "St 24.6.",
          "color": "#e3536b",
          "type": "Beh",
          "session": "Beh 7 km svižne + 5×30″ výbehy"
        },
        {
          "key": false,
          "race": false,
          "date": "Št 25.6.",
          "color": "#f4a531",
          "type": "Bicykel",
          "session": "Bicykel 55 km / ~1000 m Z2"
        },
        {
          "key": false,
          "race": false,
          "date": "Pi 26.6.",
          "color": "#5b6675",
          "type": "Voľno",
          "session": "Voľno"
        },
        {
          "key": true,
          "race": false,
          "date": "So 27.6.",
          "color": "#b07cf0",
          "type": "Brick",
          "session": "GENERÁLKA: plávanie 1–1,5 km → bike 80 km / ~1500 m → beh 45–50′. Otestuj jedlo, pitie, povinný batoh, prezúvanie."
        },
        {
          "key": true,
          "race": false,
          "date": "Ne 28.6.",
          "color": "#e3536b",
          "type": "Beh",
          "session": "Beh 16 km trail / ~900 m — najdlhší beh plánu (strop), pohodovo, run/walk"
        }
      ]
    },
    {
      "tag": "T5",
      "range": "29. 6. – 5. 7.",
      "phase": "OSTRENIE · objem dole, sviežosť hore",
      "hours": "~8 h",
      "focus": "Začína sa odľahčovanie. Krátke pretekové intenzity, telo regeneruje a ostrie sa.",
      "days": [
        {
          "key": false,
          "race": false,
          "date": "Po 29.6.",
          "color": "#5b6675",
          "type": "Voľno",
          "session": "Voľno"
        },
        {
          "key": false,
          "race": false,
          "date": "Ut 30.6.",
          "color": "#3ec6e0",
          "type": "Plávanie",
          "session": "Plávanie 1,5 km + 6×50 m sviežo"
        },
        {
          "key": false,
          "race": false,
          "date": "St 1.7.",
          "color": "#f4a531",
          "type": "Bicykel",
          "session": "Bicykel 50 km / ~900 m so 4×4′ v pretekovom tempe"
        },
        {
          "key": false,
          "race": false,
          "date": "Št 2.7.",
          "color": "#e3536b",
          "type": "Beh",
          "session": "Beh 8 km so 4×2′ do kopca"
        },
        {
          "key": false,
          "race": false,
          "date": "Pi 3.7.",
          "color": "#5b6675",
          "type": "Voľno",
          "session": "Voľno"
        },
        {
          "key": false,
          "race": false,
          "date": "So 4.7.",
          "color": "#b07cf0",
          "type": "Brick",
          "session": "Posledný dlhší brick: bicykel 50 km / ~800 m → 20′ beh, kontrolovane"
        },
        {
          "key": false,
          "race": false,
          "date": "Ne 5.7.",
          "color": "#e3536b",
          "type": "Beh",
          "session": "Beh 10 km / ~400 m pohodovo"
        }
      ]
    },
    {
      "tag": "T6",
      "range": "6. – 11. 7.",
      "phase": "TAPER + PRETEKY",
      "hours": "~4 h + preteky",
      "focus": "Vyladiť, oddýchnuť, pripraviť výstroj a logistiku. Žiadne hrdinstvá — nohy si pýtajú sviežosť.",
      "days": [
        {
          "key": false,
          "race": false,
          "date": "Po 6.7.",
          "color": "#5b6675",
          "type": "Voľno",
          "session": "Voľno / krátka mobilita"
        },
        {
          "key": false,
          "race": false,
          "date": "Ut 7.7.",
          "color": "#3ec6e0",
          "type": "Plávanie",
          "session": "Plávanie 1,2 km uvoľnene + pár krátkych zrýchlení"
        },
        {
          "key": false,
          "race": false,
          "date": "St 8.7.",
          "color": "#f4a531",
          "type": "Bicykel",
          "session": "Bicykel 40 km / ~600 m ľahko, 3×3′ pretekové tempo"
        },
        {
          "key": false,
          "race": false,
          "date": "Št 9.7.",
          "color": "#e3536b",
          "type": "Beh",
          "session": "Beh 5 km voľne + 4×20″ rozbehnutie; priprav a skontroluj výstroj"
        },
        {
          "key": true,
          "race": false,
          "date": "Pi 10.7.",
          "color": "#5b6675",
          "type": "Voľno",
          "session": "Cesta do Zuberca · registrácia 10:00–12:00 / 13:00–16:45 · bike do T1 · briefing 17:30 · povinný batoh na stenu 16:00–18:00 · 15′ výklus, nohy hore"
        },
        {
          "key": false,
          "race": true,
          "date": "So 11.7.",
          "color": "#36d399",
          "type": "PRETEKY",
          "session": "PRETEKY — štart 7:00 · STOP-čas T2 12:30"
        }
      ]
    }
  ],
  "legs": [
    {
      "kind": "s",
      "title": "PLÁVANIE",
      "meta": "2 km · 2 okruhy",
      "detail": "Neoprén, drž rovnomerné tempo, nešpurtuj. Orientácia (sighting) na bóje."
    },
    {
      "kind": "b",
      "title": "BICYKEL",
      "meta": "86 km · 1850 m",
      "detail": "Jedz a pi od prvej minúty. Stúpania do 12 %, sedlo Huty 3×. Doplnenie na Kolibe Holica. Cieľ: T2 s rezervou pred 12:30."
    },
    {
      "kind": "r",
      "title": "BEH",
      "meta": "19,5 km · 1250 m",
      "detail": "Povinný batoh: 1 l tekutín, bunda, čiapka/buff, mobil, gél. Výstup na Brestovú 1902 m — run/walk, šetri sily. Zbeh opatrne (technika). Občerstvenie: Spálená (10. km), Múzeum oravskej dediny (17. km)."
    }
  ]
};
