/**
 * extractPosterColor
 * ------------------
 * Draws the poster image onto a tiny canvas (12×18 px) and finds
 * the most vibrant pixel. Falls back to muted gold if CORS fails.
 *
 * TMDB images are served with Access-Control-Allow-Origin: * so
 * canvas extraction works on localhost and on LAN deployments.
 */

const FALLBACK = { r: 201, g: 169, b: 110 }; // muted gold

/** Boost a colour's saturation so it reads well as a glow */
function boost({ r, g, b }) {
  const min = Math.min(r, g, b);
  const f   = 1.5;
  return {
    r: Math.min(255, Math.round(r + (r - min) * f)),
    g: Math.min(255, Math.round(g + (g - min) * f)),
    b: Math.min(255, Math.round(b + (b - min) * f)),
  };
}

export function extractPosterColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const W = 12, H = 18;
        const canvas = document.createElement("canvas");
        canvas.width  = W;
        canvas.height = H;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, W, H);

        const { data } = ctx.getImageData(0, 0, W, H);
        let best = FALLBACK;
        let bestScore = -1;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];

          // Convert RGB to HSL lightness + saturation
          const maxC = Math.max(r, g, b) / 255;
          const minC = Math.min(r, g, b) / 255;
          const l    = (maxC + minC) / 2;
          const s    = maxC === minC ? 0 : (maxC - minC) / (1 - Math.abs(2 * l - 1));

          // Prefer vivid colours in the mid-brightness range
          const lightPenalty = 1 - Math.abs(l - 0.45) * 2;
          const score = s * Math.max(0, lightPenalty);

          if (score > bestScore) {
            bestScore = score;
            best = { r, g, b };
          }
        }

        resolve(boost(best));
      } catch {
        resolve(FALLBACK);
      }
    };

    img.onerror = () => resolve(FALLBACK);
    img.src     = imageUrl;
  });
}
