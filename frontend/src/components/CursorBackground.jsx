import { useEffect, useRef } from "react";

const COLORS = [
  [201, 169, 110], // gold   (high weight)
  [201, 169, 110],
  [201, 169, 110],
  [124,  77, 255], // purple
  [192,  57,  43], // crimson
];

function mkParticle(w, h) {
  const c = COLORS[Math.floor(Math.random() * COLORS.length)];
  return {
    x:  Math.random() * w,
    y:  Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r:  Math.random() * 2 + 0.8,
    color: c,
    alpha: Math.random() * 0.5 + 0.25,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.018 + 0.006,
  };
}

export default function CursorBackground() {
  const canvasRef = useRef(null);
  const mouse     = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let raf;
    let t = 0;

    const particles = Array.from({ length: 55 }, () => mkParticle(W, H));

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t  += 0.012;
      ctx.clearRect(0, 0, W, H);

      // ── Cursor spotlight ──────────────────────────────────
      const { x: mx, y: my } = mouse.current;
      if (mx > -900) {
        const spot = ctx.createRadialGradient(mx, my, 0, mx, my, 260);
        spot.addColorStop(0,   "rgba(201,169,110,0.07)");
        spot.addColorStop(0.4, "rgba(124,77,255,0.03)");
        spot.addColorStop(1,   "transparent");
        ctx.fillStyle = spot;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Particles ─────────────────────────────────────────
      for (const p of particles) {
        // Cursor repulsion
        const dx   = mx - p.x;
        const dy   = my - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 0) {
          const f = ((140 - dist) / 140) * 0.016;
          p.vx -= (dx / dist) * f;
          p.vy -= (dy / dist) * f;
        }

        p.vx *= 0.984;
        p.vy *= 0.984;
        p.x  += p.vx;
        p.y  += p.vy;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const a    = p.alpha * (0.65 + 0.35 * Math.sin(t * p.speed * 80 + p.phase));
        const [r, g, b] = p.color;

        // Glow halo
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        gr.addColorStop(0,   `rgba(${r},${g},${b},${a})`);
        gr.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = gr;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, a * 1.8)})`;
        ctx.fill();
      }

      // ── Constellation lines ────────────────────────────────
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(201,169,110,${(1 - d / 115) * 0.09})`;
            ctx.stroke();
          }
        }
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize",    onResize);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize",    onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        opacity: 0.9,
      }}
    />
  );
}
