import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const base = import.meta.env.BASE_URL;

type Photo = { src: string; alt: string };

function RevealTitle({ children, kicker }: { children: ReactNode; kicker?: string }) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLElement>({ disabled: reduced });

  return (
    <header ref={ref} className={`report-reveal-head${inView ? " is-in" : ""}`}>
      {kicker ? <p className="report-kicker">{kicker}</p> : null}
      <h2 className="report-reveal-title">
        <span className="report-reveal-title-text">{children}</span>
        <span className="report-reveal-underline" aria-hidden />
      </h2>
    </header>
  );
}

function Stagger({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ disabled: reduced });

  return (
    <div ref={ref} className={`report-stagger${inView ? " is-in" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}

function Gallery({ photos }: { photos: Photo[] }) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ disabled: reduced });

  return (
    <div
      ref={ref}
      className={`report-gallery report-stagger${inView ? " is-in" : ""}`}
      style={{ "--gallery-count": photos.length } as CSSProperties}
    >
      {photos.map((photo, i) => (
        <figure
          className="report-gallery-item"
          key={photo.src}
          style={{ "--i": i } as CSSProperties}
        >
          <img src={photo.src} alt={photo.alt} loading="lazy" />
        </figure>
      ))}
    </div>
  );
}

/**
 * Full-bleed photo moment.
 * Curtain wipe + parallax live on the inner media — the observed root stays
 * unclipped so IntersectionObserver geometry stays correct.
 */
function Space({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const reduced = usePrefersReducedMotion();
  const [rootRef, inView] = useInView<HTMLElement>({
    disabled: reduced,
    threshold: 0.15,
    rootMargin: "0px 0px -10% 0px",
  });
  const mediaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;

    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const shift = (clamped - 0.5) * 64;
      media.style.setProperty("--space-shift", `${shift.toFixed(2)}px`);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reduced, rootRef]);

  return (
    <figure
      ref={rootRef}
      className={`report-space${inView ? " is-in" : ""}${reduced ? " is-static" : ""}`}
    >
      <div className="report-space-frame">
        <div className="report-space-media" ref={mediaRef}>
          <img src={src} alt={alt} loading="lazy" />
        </div>
        <div className="report-space-curtain" aria-hidden />
      </div>
      {caption ? <figcaption className="report-space-caption">{caption}</figcaption> : null}
    </figure>
  );
}

export function Report() {
  return (
    <article className="report">
      <header className="report-hero">
        <div className="report-hero-copy">
          <p className="report-kicker">XTRI Solo Point Five · Zuberec</p>
          <h1>
            Report z <em>Oravamana</em>
          </h1>
          <p className="report-sub">
            11. júl 2026 · finisheri, bicykle a jedna spoločná fotka pred zeleným bannerom.
          </p>
          <p className="report-lede">
            Šesť týždňov prípravy, jeden víkend v Orave a cieľ, ktorý sa počíta:{" "}
            <strong>dobehnúť</strong>.
          </p>
        </div>
        <div className="report-hero-media">
          <img
            src={`${base}report/spolu.png`}
            alt="Spoločná fotka po Oravamane pred bannerom XTRI"
          />
        </div>
      </header>

      <section className="report-section report-section--course">
        <div className="report-section-inner">
          <RevealTitle kicker="Na trati">Cez Oravu tempom pretekov</RevealTitle>
          <Stagger className="report-section-copy">
            <p>
              Mokrá asfaltka, hory v pozadí a potom tráva medzi banermi XTRI. Stále spolu — od
              bicykla až po posledné metre behu.
            </p>
          </Stagger>
          <Gallery
            photos={[
              {
                src: `${base}report/bicykel.png`,
                alt: "Cyklistická časť Oravamana v horskom údolí",
              },
              {
                src: `${base}report/beh.png`,
                alt: "Beh po trávnatej trati Oravamana",
              },
            ]}
          />
        </div>
      </section>

      <Space
        src={`${base}report/voda.png`}
        alt="Osveženie vodou pri cieľovej zóne"
        caption="Cieľová zóna · voda, tráva, úľava"
      />

      <section className="report-section report-section--after">
        <div className="report-section-inner">
          <RevealTitle kicker="Po pretekoch">Finisher režim</RevealTitle>
          <Stagger className="report-section-copy">
            <p>
              Medaila, tričko a koláč na stole. Na chladničke ostane Oravaman — Liptovská Mara,
              Pribiskô, Brestová.
            </p>
          </Stagger>
          <Gallery
            photos={[
              {
                src: `${base}report/finisher.png`,
                alt: "Oslava s koláčom v tričku Finisher",
              },
              {
                src: `${base}report/magnetky.png`,
                alt: "Magnetky Oravaman Finisher na chladničke",
              },
            ]}
          />
        </div>
      </section>

      <Space
        src={`${base}report/spolu.png`}
        alt="Spoločná finisher fotka pred bannerom Oravaman"
        caption="Spolu pred bannerom · 15th anniversary"
      />
    </article>
  );
}
