import type { RaceLeg } from "../types";

type RaceDayProps = {
  legs: RaceLeg[];
};

export function RaceDay({ legs }: RaceDayProps) {
  return (
    <>
      <h2 className="section">Pretekový deň · 11. 7.</h2>
      <div className="raceday">
        <h3>Štart 7:00 — STOP-čas T2 o 12:30</h3>
        <p className="raceday-intro">
          Plávanie + bicykel musíš stihnúť za 5,5 h. Vytvor si rezervu už na bicykli.
        </p>
        <div className="legs">
          {legs.map((leg) => (
            <div className={`leg ${leg.kind}`} key={leg.kind}>
              <div>
                <div className="lt">{leg.title}</div>
                <small>{leg.meta}</small>
              </div>
              <div className="ld">{leg.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
