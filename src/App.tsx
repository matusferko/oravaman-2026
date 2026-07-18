import { useCallback, useEffect, useState } from "react";
import { Hero } from "./components/Hero";
import { WeekCard } from "./components/WeekCard";
import { PackingList } from "./components/PackingList";
import { Report } from "./components/Report";
import { plan } from "./data/plan";
import { useScrollToToday } from "./hooks/useScrollToToday";

function PlanView() {
  useScrollToToday();

  return (
    <>
      <Hero />

      <div className="chartcard">
        <img src={`${import.meta.env.BASE_URL}chart.png`} alt="Graf týždenného objemu tréningu" />
      </div>

      <h2 className="section">Týždeň po týždni</h2>
      {plan.weeks.map((week) => (
        <WeekCard week={week} key={week.tag} />
      ))}

      <div className="note">
        <b>Dôležité.</b> Nie som tréner ani lekár — plán je postavený na tvojich dátach a
        štandardných tréningových princípoch. Skok v behu (zo 7,7 km na 19,5 km) je agresívny,
        preto sú dlhé behy zámerne na traile, s run/walk na stúpaniach a stropom 16 km. Pri bolesti
        či únave radšej uber — dokončené preteky sú lepšie ako zranenie pred štartom. Spánok, jedlo
        a regenerácia sú súčasťou plánu rovnako ako tréning. Čísla (km/prevýšenie/čas) ber ako
        orientačné mantinely, nie dogmu.
      </div>
    </>
  );
}

type Tab = "report" | "plan" | "packing";

const DEFAULT_TAB: Tab = "report";

function readTabFromUrl(): Tab {
  const value = new URLSearchParams(window.location.search).get("tab");
  if (value === "plan" || value === "packing" || value === "report") return value;
  return DEFAULT_TAB;
}

export default function App() {
  const [tab, setTab] = useState<Tab>(readTabFromUrl);

  useEffect(() => {
    const onPopState = () => setTab(readTabFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.title =
      tab === "report"
        ? "Oravaman 2026 — Report"
        : "Oravaman 2026 — Plán prípravy";
    document.body.classList.toggle("is-report", tab === "report");
    return () => document.body.classList.remove("is-report");
  }, [tab]);

  const selectTab = useCallback((next: Tab) => {
    setTab(next);
    const url = new URL(window.location.href);
    if (next === DEFAULT_TAB) {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", next);
    }
    window.history.pushState(null, "", url);
  }, []);

  return (
    <div className={tab === "report" ? "wrap wrap-report" : "wrap"}>
      {tab !== "report" && (
        <nav className="tabs" aria-label="Sekcie">
          <button
            type="button"
            className={tab === "plan" ? "tab active" : "tab"}
            onClick={() => selectTab("plan")}
          >
            Plán
          </button>
          <button
            type="button"
            className={tab === "packing" ? "tab active" : "tab"}
            onClick={() => selectTab("packing")}
          >
            Balenie
          </button>
        </nav>
      )}

      {tab === "report" ? <Report /> : tab === "plan" ? <PlanView /> : <PackingList />}

      {tab !== "report" && (
        <div className="foot">
          Vytvorené z exportu Strava · activities.csv · 6 týždňov do 11. 7. 2026
        </div>
      )}
    </div>
  );
}
