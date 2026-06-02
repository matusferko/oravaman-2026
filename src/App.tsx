import { Hero } from "./components/Hero";
import { RaceDay } from "./components/RaceDay";
import { WeekCard } from "./components/WeekCard";
import { plan } from "./data/plan";

export default function App() {
  return (
    <div className="wrap">
      <Hero facts={plan.facts} />

      <div className="callout">
        <b>Východisko (zo Stravy):</b> špecifická príprava reálne beží od začiatku mája (~4
        týždne). Najsilnejší bike (104 km), plávanie blízko cieľa, ale <b>beh je pozadu</b> —
        najdlhší 7,7 km / 158 m oproti pretekovým 19,5 km / 1250 m. Plán to rieši prioritne.
      </div>

      <div className="chartcard">
        <img src={`${import.meta.env.BASE_URL}chart.png`} alt="Graf týždenného objemu tréningu" />
      </div>

      <h2 className="section">Týždeň po týždni</h2>
      {plan.weeks.map((week) => (
        <WeekCard week={week} key={week.tag} />
      ))}

      <RaceDay legs={plan.legs} />

      <div className="note">
        <b>Dôležité.</b> Nie som tréner ani lekár — plán je postavený na tvojich dátach a
        štandardných tréningových princípoch. Skok v behu (zo 7,7 km na 19,5 km) je agresívny,
        preto sú dlhé behy zámerne na traile, s run/walk na stúpaniach a stropom 16 km. Pri bolesti
        či únave radšej uber — dokončené preteky sú lepšie ako zranenie pred štartom. Spánok, jedlo
        a regenerácia sú súčasťou plánu rovnako ako tréning. Čísla (km/prevýšenie/čas) ber ako
        orientačné mantinely, nie dogmu.
      </div>

      <div className="foot">
        Vytvorené z exportu Strava · activities.csv · 6 týždňov do 11. 7. 2026
      </div>
    </div>
  );
}
