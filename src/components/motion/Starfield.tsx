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
const AREA_PER_STAR = 2200;        // 1 star per 2200 CSS px² of viewport
const MAX_STARS = 1400;            // desktop cap
const MAX_STARS_LIGHT = 600;       // mobile (< 768px) and low-end devices
const LAYER_SPLIT = [0.65, 0.9] as const;
const SIZE: Record<Layer, readonly [number, number]> = { 1: [0.5, 0.9], 2: [0.8, 1.3], 3: [1.2, 1.8] }; // [min, range]
const BASE_ALPHA = [0.3, 0.7] as const;
const TWINKLE_SPEED = [0.01, 0.03] as const;
const TWINKLE_AMP = 0.35;
const MIN_ALPHA = 0.1;
const DRIFT = 0.25;                // ambient upward drift, px per frame × layer
const SCROLL_GAIN = 0.15;          // scrolled px → velocity
const FRICTION = 0.92;             // velocity decay per frame
const PARALLAX = 0.5;              // velocity × layer × this = px per frame (raise for a stronger 3D feel)
const MAX_VELOCITY = 40;
const TWINKLE_SCROLL_BOOST = 0.15; // twinkle runs up to 4× faster while scrolling
const GLOW = { minRadius: 1.4, scale: 2.2, alpha: 0.3 };
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
    const glowColor = css.getPropertyValue("--color-star-glow").trim() || starColor;

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
    let lastScroll = window.scrollY;
    let velocity = 0;

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

      ctx.fillStyle = glowColor;
      for (const s of stars) {
        if (s.z !== 3 || s.r <= GLOW.minRadius) continue;
        ctx.globalAlpha = s.a * GLOW.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * GLOW.scale, 0, Math.PI * 2);
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

      // Sample scroll once per frame — no scroll listeners.
      const scrollY = window.scrollY;
      const delta = scrollY - lastScroll;
      lastScroll = scrollY;
      if (Math.abs(delta) < height) velocity += delta * SCROLL_GAIN; // ignore route-change jumps to top
      velocity = clamp(velocity, -MAX_VELOCITY, MAX_VELOCITY) * Math.pow(FRICTION, f);

      const twinkleBoost = 1 + Math.min(Math.abs(velocity), 20) * TWINKLE_SCROLL_BOOST;

      for (const s of stars) {
        // Scrolling down moves stars up; near stars move faster (parallax). Constant slow upward drift.
        s.y += (-velocity * s.z * PARALLAX - DRIFT * s.z) * f;
        if (s.y < 0) {
          s.y += height;
          s.x = Math.random() * width;
        } else if (s.y > height) {
          s.y -= height;
          s.x = Math.random() * width;
        }
        s.phase += s.speed * twinkleBoost * f;
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
      lastScroll = window.scrollY;
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
