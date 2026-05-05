// A small library of inline SVG graphics. Each is drawn in a 100x100 coord space
// and uses currentColor so it can be tinted via CSS color.

export interface GraphicAsset {
  id: string;
  name: string;
  svg: string;
}

export const GRAPHICS: GraphicAsset[] = [
  {
    id: "star",
    name: "Star",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 61,38 96,38 67,58 78,92 50,71 22,92 33,58 4,38 39,38" fill="currentColor"/></svg>`,
  },
  {
    id: "heart",
    name: "Heart",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 88 L12 50 C2 40 6 22 20 18 C32 15 44 22 50 32 C56 22 68 15 80 18 C94 22 98 40 88 50 Z" fill="currentColor"/></svg>`,
  },
  {
    id: "lightning",
    name: "Lightning",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="55,4 18,55 45,55 35,96 82,40 54,40 66,4" fill="currentColor"/></svg>`,
  },
  {
    id: "skull",
    name: "Skull",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 8 C25 8 12 28 12 48 C12 60 18 70 26 76 L26 88 L40 88 L40 80 L60 80 L60 88 L74 88 L74 76 C82 70 88 60 88 48 C88 28 75 8 50 8 Z" fill="currentColor"/><circle cx="36" cy="48" r="7" fill="#000"/><circle cx="64" cy="48" r="7" fill="#000"/><rect x="46" y="60" width="8" height="10" fill="#000"/></svg>`,
  },
  {
    id: "peace",
    name: "Peace",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="6"/><line x1="50" y1="8" x2="50" y2="92" stroke="currentColor" stroke-width="6"/><line x1="50" y1="50" x2="20" y2="80" stroke="currentColor" stroke-width="6"/><line x1="50" y1="50" x2="80" y2="80" stroke="currentColor" stroke-width="6"/></svg>`,
  },
  {
    id: "smile",
    name: "Smile",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="currentColor"/><circle cx="36" cy="42" r="5" fill="#000"/><circle cx="64" cy="42" r="5" fill="#000"/><path d="M30 60 Q50 80 70 60" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/></svg>`,
  },
  {
    id: "music",
    name: "Music",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M40 70 L40 20 L80 12 L80 60" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="34" cy="72" r="10" fill="currentColor"/><circle cx="74" cy="62" r="10" fill="currentColor"/></svg>`,
  },
  {
    id: "anchor",
    name: "Anchor",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="5"/><line x1="50" y1="28" x2="50" y2="80" stroke="currentColor" stroke-width="5"/><line x1="38" y1="38" x2="62" y2="38" stroke="currentColor" stroke-width="5"/><path d="M20 60 Q30 88 50 88 Q70 88 80 60" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
  },
  {
    id: "diamond",
    name: "Diamond",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 88,40 50,92 12,40" fill="currentColor"/><polygon points="50,10 88,40 50,92 12,40" fill="none" stroke="#000" stroke-width="2" opacity="0.3"/><line x1="12" y1="40" x2="88" y2="40" stroke="#000" stroke-width="2" opacity="0.3"/></svg>`,
  },
  {
    id: "leaf",
    name: "Leaf",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20 80 C20 30 50 10 88 12 C90 50 70 88 22 88 Z" fill="currentColor"/><path d="M20 80 L80 20" stroke="#000" stroke-width="2" opacity="0.25"/></svg>`,
  },
];

export const GARMENT_COLORS = [
  { name: "White", hex: "#f8f8f6" },
  { name: "Heather Gray", hex: "#b8bcc1" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "Navy", hex: "#1f2a44" },
  { name: "Royal Blue", hex: "#1e40af" },
  { name: "Sky", hex: "#7dd3fc" },
  { name: "Forest", hex: "#1f3d2b" },
  { name: "Olive", hex: "#6b7142" },
  { name: "Mustard", hex: "#d4a017" },
  { name: "Burgundy", hex: "#6b1f2a" },
  { name: "Red", hex: "#c0392b" },
  { name: "Pink", hex: "#f8a5c2" },
  { name: "Purple", hex: "#6b3fa0" },
  { name: "Sand", hex: "#d8c9a3" },
];

export const FONT_OPTIONS = [
  { name: "Sans", value: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" },
  { name: "Serif", value: "ui-serif, Georgia, Cambria, Times New Roman, serif" },
  { name: "Mono", value: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" },
  { name: "Display", value: "Impact, Haettenschweiler, Arial Narrow Bold, sans-serif" },
];
