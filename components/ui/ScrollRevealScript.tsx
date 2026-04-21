"use client";

import { useEffect } from "react";

// Observa todos los elementos con clase .rv y les añade .v cuando entran en viewport
// Equivale al script del HTML original:
// const obs = new IntersectionObserver(...)
// document.querySelectorAll('.rv').forEach(el => obs.observe(el))
export default function ScrollRevealScript() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("v"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".rv").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return null;
}
