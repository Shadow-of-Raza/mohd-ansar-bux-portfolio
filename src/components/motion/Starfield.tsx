"use client";

import { useEffect, useRef } from "react";

type Layer = 1 | 2 | 3; // 1 = far, 2 = mid, 3 = near
type Star = {
  x: number;
  y: number;
  z: Layer;
  r: number;      // radius in CSS px
  base: number;   // base alpha
  speed: number;  // twinkle speed, radians per 60fps frame
  phase: number;
  a: number;      // alpha this frame
};

// Space background tuning (docs/context/03 §2, 04 §4.8). Values are per 60fps frame.
const AREA_PER_STAR = 1400;        // 1 star per 1400 CSS px² of viewport (increased density for small stars)
const MAX_STARS = 2000;            // desktop cap
const MAX_STARS_LIGHT = 900;       // mobile (< 768px) and low-end devices
const LAYER_SPLIT = [0.70, 0.92] as const; // 70% micro · 22% small · 8% crisp
const SIZE: Record<Layer, readonly [number, number]> = {
  1: [0.35, 0.4], // radius 0.35 - 0.75 px
  2: [0.6, 0.4],  // radius 0.60 - 1.00 px
  3: [0.85, 0.3], // radius 0.85 - 1.15 px
}; // [min, range] — big sizes removed; small crisp stars only
const BASE_ALPHA = [0.3, 0.7] as const;
const TWINKLE_SPEED = [0.01, 0.03] as const;
const TWINKLE_AMP = 0.35;
const MIN_ALPHA = 0.1;
const DRIFT = 0.075;               // ambient bottom-to-top drift (speed reduced by 70% from 0.25), px per frame
const LIGHT_FPS = 30;              // fps cap on mobile / low-end devices

const rand = ([min, range]: readonly [number, number] | [number, number]) => min + Math.random() * range;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Colours come from the @theme tokens — no hex in components.
    const css = getComputedStyle(document.documentElement);
    const starColor = css.getPropertyValue("--color-star").trim() || "white";

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const lowEnd =
      (nav.hardwareConcurrency ?? 8) <= 4 ||
      (nav.deviceMemory ?? 8) <= 4 ||
      nav.connection?.saveData === true;
    const light = lowEnd || window.innerWidth < 768;
    const minFrameMs = light ? 1000 / LIGHT_FPS - 1 : 0; // -1ms tolerance for rAF jitter
    const dpr = lowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    const stars: Star[] = [];
    let raf = 0;
    let last = 0;

    const makeStar = (x: number, y: number): Star => {
      const roll = Math.random();
      const z: Layer = roll < LAYER_SPLIT[0] ? 1 : roll < LAYER_SPLIT[1] ? 2 : 3;
      const base = rand(BASE_ALPHA);
      return { x, y, z, r: rand(SIZE[z]), base, speed: rand(TWINKLE_SPEED), phase: Math.random() * Math.PI * 2, a: base };
    };

    const targetCount = () => {
      const cap = lowEnd || width < 768 ? MAX_STARS_LIGHT : MAX_STARS;
      return Math.min(cap, Math.floor((width * height) / AREA_PER_STAR));
    };

    // Rescale existing stars instead of regenerating them (no flash on resize).
    const resize = (w: number, h: number) => {
      if (w === 0 || h === 0) return;
      const sx = width ? w / width : 1;
      const sy = height ? h / height : 1;
      width = w;
      height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const s of stars) {
        s.x *= sx;
        s.y *= sy;
      }
      const n = targetCount();
      while (stars.length < n) stars.push(makeStar(Math.random() * w, Math.random() * h));
      if (stars.length > n) stars.length = n;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = starColor;
      for (const s of stars) {
        s.a = clamp(s.base + Math.sin(s.phase) * TWINKLE_AMP, MIN_ALPHA, 1);
        ctx.globalAlpha = s.a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const step = (now: number) => {
      // 30 fps cap on light devices: skip this frame, keep the maths frame-rate independent.
      if (now - last < minFrameMs) {
        raf = requestAnimationFrame(step);
        return;
      }

      const f = Math.min((now - last) / (1000 / 60), 3); // frames elapsed at 60fps, capped after tab switches
      last = now;

      for (const s of stars) {
        // Automatic upward drift (bottom-to-top), reduced by 70%. No scroll displacement.
        s.y -= DRIFT * (0.7 + s.z * 0.3) * f;
        if (s.y < 0) {
          s.y += height;
          s.x = Math.random() * width;
        }
        s.phase += s.speed * f;
      }

      draw();
      raf = requestAnimationFrame(step);
    };

    // Runs on mount, on tab visibility change and on reduced-motion change.
    const start = () => {
      cancelAnimationFrame(raf);
      if (reducedMotion.matches || document.hidden) {
        draw(); // static starfield, no twinkle, no drift
        return;
      }
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      resize(entry.contentRect.width, entry.contentRect.height);
      if (reducedMotion.matches) draw();
    });

    resize(canvas.clientWidth, canvas.clientHeight);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", start);
    reducedMotion.addEventListener("change", start);
    start();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      reducedMotion.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 block size-full" />;
}
