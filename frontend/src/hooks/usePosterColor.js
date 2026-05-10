import { useState, useEffect } from "react";
import { extractPosterColor } from "../utils/posterColor";

// Module-level cache — colours are extracted once per URL per session
const colorCache = new Map();

/**
 * usePosterColor(imageUrl)
 * Returns { r, g, b } of the poster's dominant colour.
 * Starts as muted gold, updates asynchronously after extraction.
 */
export function usePosterColor(imageUrl) {
  const [color, setColor] = useState({ r: 201, g: 169, b: 110 });

  useEffect(() => {
    if (!imageUrl) return;

    if (colorCache.has(imageUrl)) {
      setColor(colorCache.get(imageUrl));
      return;
    }

    extractPosterColor(imageUrl).then((c) => {
      colorCache.set(imageUrl, c);
      setColor(c);
    });
  }, [imageUrl]);

  return color;
}
