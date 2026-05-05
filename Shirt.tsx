import React from "react";

export type ShirtView = "front" | "back" | "left" | "right";
export type FabricTexture = "smooth" | "cotton" | "heather" | "ribbed" | "denim";

interface ShirtProps {
  color: string;
  view: ShirtView;
  texture: FabricTexture;
  children?: React.ReactNode; // print area contents
  printAreaRef?: React.RefObject<SVGRectElement | null>;
  showPrintArea?: boolean;
  svgRef?: React.Ref<SVGSVGElement>;
  onBackgroundClick?: () => void;
}

// SVG viewBox is 400 x 480 for all views.
// Print area defined per view.
export const PRINT_AREAS: Record<ShirtView, { x: number; y: number; w: number; h: number }> = {
  front: { x: 130, y: 150, w: 140, h: 180 },
  back: { x: 130, y: 140, w: 140, h: 200 },
  left: { x: 170, y: 170, w: 70, h: 90 },
  right: { x: 170, y: 170, w: 70, h: 90 },
};

function FabricPattern({ id, texture, color }: { id: string; texture: FabricTexture; color: string }) {
  // Build a subtle texture pattern overlay using SVG patterns.
  switch (texture) {
    case "smooth":
      return (
        <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill={color} />
        </pattern>
      );
    case "cotton":
      return (
        <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill={color} />
          <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.18)" />
          <circle cx="4" cy="3" r="0.4" fill="rgba(0,0,0,0.10)" />
          <circle cx="2" cy="5" r="0.4" fill="rgba(255,255,255,0.10)" />
        </pattern>
      );
    case "heather":
      return (
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={color} />
          <path d="M0 0 L8 8 M-2 6 L2 10 M6 -2 L10 2" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
          <path d="M0 8 L8 0" stroke="rgba(0,0,0,0.12)" strokeWidth="0.5" />
        </pattern>
      );
    case "ribbed":
      return (
        <pattern id={id} width="6" height="2" patternUnits="userSpaceOnUse">
          <rect width="6" height="2" fill={color} />
          <line x1="0" y1="0" x2="6" y2="0" stroke="rgba(0,0,0,0.18)" strokeWidth="0.4" />
          <line x1="0" y1="1.4" x2="6" y2="1.4" stroke="rgba(255,255,255,0.18)" strokeWidth="0.3" />
        </pattern>
      );
    case "denim":
      return (
        <pattern id={id} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill={color} />
          <path d="M0 0 L3 3" stroke="rgba(255,255,255,0.20)" strokeWidth="0.5" />
          <path d="M0 1.5 L1.5 3 M1.5 0 L3 1.5" stroke="rgba(0,0,0,0.18)" strokeWidth="0.4" />
        </pattern>
      );
  }
}

function darken(hex: string, amount = 0.18): string {
  // Simple darken for shading.
  const c = hex.replace("#", "");
  const num = parseInt(
    c.length === 3 ? c.split("").map((x) => x + x).join("") : c,
    16
  );
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));
  return `rgb(${r}, ${g}, ${b})`;
}

// Path data for each view of the shirt body (excluding sleeves overlap nuances kept simple).
const SHIRT_PATHS: Record<ShirtView, string> = {
  front:
    // Main body with crew neckline
    "M120,80 L80,110 L40,170 L70,210 L100,190 L100,420 L300,420 L300,190 L330,210 L360,170 L320,110 L280,80 C260,110 230,120 200,120 C170,120 140,110 120,80 Z",
  back:
    // Same silhouette but with a higher, smaller back collar
    "M120,80 L80,110 L40,170 L70,210 L100,190 L100,420 L300,420 L300,190 L330,210 L360,170 L320,110 L280,80 C265,95 235,102 200,102 C165,102 135,95 120,80 Z",
  left:
    // Side view: body curves with one sleeve visible to the right
    "M150,90 L130,110 L120,160 L120,420 L260,420 L260,180 L290,200 L320,160 L290,110 L240,80 C220,100 195,110 180,110 C165,110 158,100 150,90 Z",
  right:
    "M250,90 L270,110 L280,160 L280,420 L140,420 L140,180 L110,200 L80,160 L110,110 L160,80 C180,100 205,110 220,110 C235,110 242,100 250,90 Z",
};

export const Shirt: React.FC<ShirtProps> = ({
  color,
  view,
  texture,
  children,
  printAreaRef,
  showPrintArea = true,
  svgRef,
  onBackgroundClick,
}) => {
  const fabricId = `fabric-${view}-${texture}`;
  const shadowColor = darken(color, 0.28);
  const highlightColor = "rgba(255,255,255,0.12)";
  const area = PRINT_AREAS[view];

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 480"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => {
        if (e.target === e.currentTarget && onBackgroundClick) onBackgroundClick();
      }}
    >
      <defs>
        <FabricPattern id={fabricId} texture={texture} color={color} />
        <radialGradient id={`shade-${view}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.28)" />
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="3" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`bodyClip-${view}`}>
          <path d={SHIRT_PATHS[view]} />
        </clipPath>
      </defs>

      {/* Drop shadow under shirt */}
      <ellipse cx="200" cy="445" rx="140" ry="10" fill="rgba(0,0,0,0.18)" />

      {/* Shirt body */}
      <g filter="url(#softShadow)">
        <path d={SHIRT_PATHS[view]} fill={`url(#${fabricId})`} stroke={shadowColor} strokeWidth="1.5" />
        {/* Shading overlay */}
        <path d={SHIRT_PATHS[view]} fill={`url(#shade-${view})`} />
      </g>

      {/* Collar / neckline detail */}
      <g clipPath={`url(#bodyClip-${view})`}>
        {view === "front" && (
          <path
            d="M155,82 C170,108 230,108 245,82 C235,118 165,118 155,82 Z"
            fill={shadowColor}
            opacity="0.85"
          />
        )}
        {view === "back" && (
          <path
            d="M160,82 C175,98 225,98 240,82 C235,100 165,100 160,82 Z"
            fill={shadowColor}
            opacity="0.9"
          />
        )}
        {view === "left" && (
          <path d="M180,90 C195,108 220,108 235,90 C225,115 190,115 180,90 Z" fill={shadowColor} opacity="0.85" />
        )}
        {view === "right" && (
          <path d="M165,90 C180,108 205,108 220,90 C210,115 175,115 165,90 Z" fill={shadowColor} opacity="0.85" />
        )}
      </g>

      {/* Side seams / sleeve hems */}
      <g stroke={shadowColor} strokeWidth="1" fill="none" opacity="0.45">
        <path d={SHIRT_PATHS[view]} />
        {view === "front" || view === "back" ? (
          <>
            <line x1="100" y1="190" x2="100" y2="210" />
            <line x1="300" y1="190" x2="300" y2="210" />
            <line x1="100" y1="418" x2="300" y2="418" />
          </>
        ) : null}
      </g>

      {/* Highlight strip */}
      <path
        d={SHIRT_PATHS[view]}
        fill="none"
        stroke={highlightColor}
        strokeWidth="2"
        opacity="0.6"
      />

      {/* Print area boundary */}
      {showPrintArea && (
        <rect
          ref={printAreaRef}
          x={area.x}
          y={area.y}
          width={area.w}
          height={area.h}
          fill="none"
          stroke="rgba(59,130,246,0.85)"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          rx="4"
        />
      )}

      {/* Print contents (clipped to print area) */}
      <defs>
        <clipPath id={`printClip-${view}`}>
          <rect x={area.x} y={area.y} width={area.w} height={area.h} rx="4" />
        </clipPath>
      </defs>
      <g clipPath={`url(#printClip-${view})`}>{children}</g>

      {/* View label tag */}
      <g>
        <rect x="16" y="16" rx="6" ry="6" width="74" height="22" fill="rgba(15,23,42,0.85)" />
        <text x="53" y="31" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="ui-sans-serif, system-ui">
          {view.toUpperCase()}
        </text>
      </g>
    </svg>
  );
};
