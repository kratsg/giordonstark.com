/**
 * Proton-proton collision animation driven by GSAP ScrollTrigger.
 * Three phases: approach → collision → particle tracks
 * Canvas is fixed behind the hero/About section, aria-hidden for accessibility.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  phase: number; // random per-particle offset for scroll-driven wiggle
}

interface Track {
  x0: number;
  y0: number;
  curvature: number;
  angle: number;
  length: number;
  alpha: number;
  color: string;
  charge: number; // +1 or -1 for bending direction
}

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let rafId = 0;

// State driven by GSAP scroll progress (0 → 1)
let scrollProgress = 0;

// Particles for the two proton bunches
const leftBunch: Particle[] = [];
const rightBunch: Particle[] = [];

// Post-collision track particles
const tracks: Track[] = [];

const COLORS = {
  bunch1: "#f97316", // warm orange
  bunch2: "#fb923c", // lighter orange
  track1: "#c53030", // brand accent (red)
  track2: "#ffffff", // white
  track3: "#94a3b8", // cool gray
  glow: "rgba(249, 115, 22, 0.4)",
};

function isMobile(): boolean {
  return window.innerWidth < 768;
}

function particleCount(): number {
  return isMobile() ? 30 : 70;
}

function trackCount(): number {
  return isMobile() ? 80 : 200;
}

function initBunches(w: number, h: number): void {
  const cy = h / 2;
  const count = particleCount();
  leftBunch.length = 0;
  rightBunch.length = 0;

  for (let i = 0; i < count; i++) {
    const spread = isMobile() ? 18 : 28;
    leftBunch.push({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * spread,
      vy: (Math.random() - 0.5) * spread,
      radius: Math.random() * 2.2 + 1.1,
      alpha: Math.random() * 0.6 + 0.4,
      color: Math.random() > 0.5 ? COLORS.bunch1 : COLORS.bunch2,
      phase: Math.random() * Math.PI * 2,
    });
    rightBunch.push({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * spread,
      vy: (Math.random() - 0.5) * spread,
      radius: Math.random() * 2.2 + 1.1,
      alpha: Math.random() * 0.6 + 0.4,
      color: Math.random() > 0.5 ? COLORS.bunch1 : COLORS.bunch2,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Build tracks
  tracks.length = 0;
  const tc = trackCount();
  for (let i = 0; i < tc; i++) {
    const angle = Math.random() * Math.PI * 2;
    const trackColors = [COLORS.track1, COLORS.track2, COLORS.track3];
    tracks.push({
      x0: w / 2,
      y0: cy,
      curvature: (Math.random() - 0.5) * 0.04,
      angle,
      length: Math.random() * (isMobile() ? 120 : 260) + 60,
      alpha: Math.random() * 0.7 + 0.3,
      color: trackColors[Math.floor(Math.random() * trackColors.length)],
      charge: Math.random() > 0.5 ? 1 : -1,
    });
  }
}

function drawGlow(x: number, y: number, radius: number, alpha: number): void {
  if (!ctx) return;
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, `rgba(249,115,22,${alpha})`);
  grad.addColorStop(1, "rgba(249,115,22,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function render(): void {
  if (!canvas || !ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  const cy = h / 2;

  ctx.clearRect(0, 0, w, h);

  const p = scrollProgress; // 0..1

  // Phase thresholds
  const approachEnd = 0.4;
  const collisionEnd = 0.45; // short glow window so tracks appear quickly

  if (p < approachEnd) {
    // Approach phase: bunches move from edges toward center, wiggling vertically
    const t = p / approachEnd; // 0..1
    const leftX = t * (w / 2);
    const rightX = w - t * (w / 2);

    // Per-particle scroll-driven wiggle: fast frequency (12π = 6 cycles),
    // damps to zero as t→1 so particles settle at center on collision.
    const wiggleAmp = 24 * (1 - t);

    [leftBunch, rightBunch].forEach((bunch, bi) => {
      const bx = bi === 0 ? leftX : rightX;
      bunch.forEach((pt) => {
        const px = bx + pt.vx * (1 - t) * 0.5;
        const py =
          cy +
          pt.vy * (1 - t) * 0.5 +
          Math.sin(t * Math.PI * 12 + pt.phase) * wiggleAmp;
        ctx!.save();
        ctx!.globalAlpha = pt.alpha * (0.4 + t * 0.6);
        ctx!.fillStyle = pt.color;
        ctx!.beginPath();
        ctx!.arc(px, py, pt.radius, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      });
    });

    // Subtle glow as they approach
    if (t > 0.7) {
      drawGlow(w / 2, cy, (40 * (t - 0.7)) / 0.3, (0.3 * (t - 0.7)) / 0.3);
    }
  } else if (p < collisionEnd) {
    // Collision phase: bright burst at center
    const t = (p - approachEnd) / (collisionEnd - approachEnd); // 0..1
    const burstRadius = 20 + t * (isMobile() ? 60 : 100);
    const burstAlpha = 1 - t * 0.7;

    drawGlow(w / 2, cy, burstRadius, burstAlpha);
    drawGlow(w / 2, cy, burstRadius * 0.4, burstAlpha);

    // Flash dot
    ctx.save();
    ctx.globalAlpha = burstAlpha;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(w / 2, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else {
    // Track phase: particle tracks spray outward
    const t = (p - collisionEnd) / (1 - collisionEnd); // 0..1

    // Fading glow at center
    drawGlow(w / 2, cy, 30, Math.max(0, 0.4 - t * 0.4));

    tracks.forEach((track) => {
      const steps = Math.floor(track.length * t);
      if (steps < 2) return;

      ctx!.save();
      ctx!.globalAlpha = track.alpha * Math.max(0, 1 - t * 0.5);
      ctx!.strokeStyle = track.color;
      ctx!.lineWidth = 1;
      ctx!.beginPath();

      let x = track.x0;
      let y = track.y0;
      let angle = track.angle;
      const stepSize = 4;

      ctx!.moveTo(x, y);
      for (let s = 0; s < steps; s++) {
        angle += track.curvature * track.charge;
        x += Math.cos(angle) * stepSize;
        y += Math.sin(angle) * stepSize;
        ctx!.lineTo(x, y);
      }
      ctx!.stroke();
      ctx!.restore();
    });
  }

  rafId = requestAnimationFrame(render);
}

export function initCollision(canvasEl: HTMLCanvasElement): () => void {
  canvas = canvasEl;
  ctx = canvas.getContext("2d");

  function resize(): void {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initBunches(canvas.width, canvas.height);
  }

  resize();
  window.addEventListener("resize", resize);

  // Start render loop
  rafId = requestAnimationFrame(render);

  // GSAP ScrollTrigger drives scrollProgress
  ScrollTrigger.create({
    trigger: "#about",
    start: "top top",
    end: "bottom top",
    scrub: 1,
    onUpdate(self) {
      scrollProgress = self.progress;
    },
  });

  // Return cleanup function
  return function cleanup(): void {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}
