"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const pos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };
    let rafId = 0;
    let hideTimer = 0;

    // Ocultar cursor nativo
    const style = document.createElement("style");
    style.textContent = "* { cursor: none !important; }";
    document.head.appendChild(style);

    const show = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const scheduleHide = () => {
      clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
      }, 3000);
    };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      show();
      scheduleHide();
    };

    const INTERACTIVE = "a, button, [role='button'], .pcard, .prod-card-premium, .bcard";

    const onEnter = () => {
      dot.style.width = "16px";
      dot.style.height = "16px";
      ring.style.width = "60px";
      ring.style.height = "60px";
    };

    const onLeave = () => {
      dot.style.width = "8px";
      dot.style.height = "8px";
      ring.style.width = "36px";
      ring.style.height = "36px";
    };

    // Lerp ring con RAF
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.12;
      ringPos.y += (pos.y - ringPos.y) * 0.12;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);

    // Hover delegado — captura elementos interactivos presentes y futuros (modal, etc.)
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) onEnter();
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) onLeave();
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafId);
      clearTimeout(hideTimer);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
