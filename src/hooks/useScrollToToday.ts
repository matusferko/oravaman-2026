import { useEffect } from "react";

export function useScrollToToday() {
  useEffect(() => {
    const scroll = () => {
      document.getElementById("plan-today")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    scroll();
    const id = window.setTimeout(scroll, 200);
    return () => window.clearTimeout(id);
  }, []);
}
