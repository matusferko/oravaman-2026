import { useCallback, useState } from "react";
import { packing } from "../data/packing";

const STORAGE_KEY = "oravaman-packing-v1";

type CheckedMap = Record<string, boolean>;

function loadChecked(): CheckedMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CheckedMap) : {};
  } catch {
    return {};
  }
}

function saveChecked(map: CheckedMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export function PackingList() {
  const [checked, setChecked] = useState<CheckedMap>(loadChecked);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecked(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    if (!window.confirm("Odškrtnúť celý zoznam?")) return;
    setChecked({});
    saveChecked({});
  }, []);

  const allItems = packing.flatMap((cat) => cat.items);
  const total = allItems.length;
  const done = allItems.filter((item) => checked[item.id]).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <>
      <h2 className="section">Čo zbaliť</h2>

      <div className="progress-summary">
        <div className="progress-summary-head">
          <span className="progress-summary-count">
            {done}/{total} zbalené
          </span>
          <span className="remaining-pct">{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {packing.map((cat) => {
        const catDone = cat.items.filter((item) => checked[item.id]).length;
        return (
          <section
            className="pack-cat"
            key={cat.title}
            style={{ ["--cat-color" as string]: cat.color }}
          >
            <div className="pack-cat-head">
              <span className="pack-cat-title">
                <span aria-hidden>{cat.icon}</span> {cat.title}
              </span>
              <span className="pack-cat-count">
                {catDone}/{cat.items.length}
              </span>
            </div>
            <ul className="pack-list">
              {cat.items.map((item) => {
                const isDone = !!checked[item.id];
                return (
                  <li className={`pack-item${isDone ? " done" : ""}`} key={item.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggle(item.id)}
                      />
                      <span className="pack-check" aria-hidden>
                        {isDone ? "✓" : ""}
                      </span>
                      <span className="pack-label">
                        {item.label}
                        {item.note ? <em className="pack-note"> — {item.note}</em> : null}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="pack-actions">
        <button type="button" className="strava-btn strava-btn-ghost" onClick={reset}>
          Vynulovať zoznam
        </button>
      </div>
    </>
  );
}
