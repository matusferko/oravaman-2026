import { RaceCountdown } from "./RaceCountdown";
import { TrainingRemaining } from "./TrainingRemaining";

export function Hero() {
  return (
    <div className="hero">
      <svg
        className="topo"
        viewBox="0 0 800 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g fill="none" stroke="#f4a531" strokeWidth="1">
          <path d="M0,260 C140,210 250,250 380,200 C520,150 640,210 800,150" />
          <path d="M0,230 C150,180 260,220 390,165 C530,115 650,175 800,120" />
          <path d="M0,200 C160,150 270,185 400,135 C540,85 660,140 800,92" />
          <path d="M0,168 C170,122 285,150 410,108 C545,62 670,108 800,66" />
          <path d="M0,132 C180,92 300,116 420,80 C560,42 680,78 800,44" />
          <path d="M0,96 C190,62 310,82 430,54 C560,24 690,52 800,28" />
        </g>
      </svg>
      <div className="kicker">XTRI World Tour <br/>Zuberec · 11. júl 2026</div>
      <h1>
        ORAVAMAN <span>2026</span>
      </h1>
      <RaceCountdown />
      <TrainingRemaining />
    </div>
  );
}
