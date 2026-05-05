import React, { useRef } from "react";

export type DesignItem =
  | {
      id: string;
      type: "text";
      view: "front" | "back" | "left" | "right";
      x: number; // center coords in svg space
      y: number;
      width: number;
      height: number;
      rotation: number;
      text: string;
      font: string;
      color: string;
      weight: number;
      italic: boolean;
    }
  | {
      id: string;
      type: "graphic";
      view: "front" | "back" | "left" | "right";
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
      svg: string; // raw svg markup for the graphic
      tint: string;
    };

interface DesignLayerProps {
  items: DesignItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (item: DesignItem) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

// Convert client coordinates to the SVG's internal viewBox coordinates.
function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: clientX, y: clientY };
  const inv = ctm.inverse();
  const { x, y } = pt.matrixTransform(inv);
  return { x, y };
}

export const DesignLayer: React.FC<DesignLayerProps> = ({
  items,
  selectedId,
  onSelect,
  onChange,
  svgRef,
}) => {
  return (
    <>
      {items.map((item) => (
        <DesignItemNode
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onSelect={onSelect}
          onChange={onChange}
          svgRef={svgRef}
        />
      ))}
    </>
  );
};

const DesignItemNode: React.FC<{
  item: DesignItem;
  selected: boolean;
  onSelect: (id: string | null) => void;
  onChange: (item: DesignItem) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}> = ({ item, selected, onSelect, onChange, svgRef }) => {
  const dragState = useRef<{
    mode: "move" | "resize" | "rotate" | null;
    startSvgX: number;
    startSvgY: number;
    startItem: DesignItem;
  }>({ mode: null, startSvgX: 0, startSvgY: 0, startItem: item });

  const handlePointerDown =
    (mode: "move" | "resize" | "rotate") => (e: React.PointerEvent) => {
      e.stopPropagation();
      if (!svgRef.current) return;
      (e.target as Element).setPointerCapture(e.pointerId);
      const { x, y } = clientToSvg(svgRef.current, e.clientX, e.clientY);
      dragState.current = { mode, startSvgX: x, startSvgY: y, startItem: { ...item } };
      onSelect(item.id);
    };

  const handlePointerMove = (e: React.PointerEvent) => {
    const ds = dragState.current;
    if (!ds.mode || !svgRef.current) return;
    const { x, y } = clientToSvg(svgRef.current, e.clientX, e.clientY);
    const dx = x - ds.startSvgX;
    const dy = y - ds.startSvgY;

    if (ds.mode === "move") {
      onChange({ ...ds.startItem, x: ds.startItem.x + dx, y: ds.startItem.y + dy });
    } else if (ds.mode === "resize") {
      const newW = Math.max(20, ds.startItem.width + dx);
      const ratio = ds.startItem.height / ds.startItem.width;
      onChange({ ...ds.startItem, width: newW, height: Math.max(16, newW * ratio) });
    } else if (ds.mode === "rotate") {
      const cx = ds.startItem.x;
      const cy = ds.startItem.y;
      const angle = (Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90;
      onChange({ ...ds.startItem, rotation: angle });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragState.current.mode) {
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {}
      dragState.current.mode = null;
    }
  };

  const halfW = item.width / 2;
  const halfH = item.height / 2;

  return (
    <g
      transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation})`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ cursor: selected ? "move" : "pointer" }}
    >
      {/* Hit/move area */}
      <rect
        x={-halfW}
        y={-halfH}
        width={item.width}
        height={item.height}
        fill="transparent"
        onPointerDown={handlePointerDown("move")}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.id);
        }}
      />

      {item.type === "text" ? (
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={item.height * 0.85}
          fontFamily={item.font}
          fontWeight={item.weight}
          fontStyle={item.italic ? "italic" : "normal"}
          fill={item.color}
          style={{ pointerEvents: "none", userSelect: "none" }}
          textLength={item.width}
          lengthAdjust="spacingAndGlyphs"
        >
          {item.text}
        </text>
      ) : (
        <g
          transform={`translate(${-halfW}, ${-halfH}) scale(${item.width / 100}, ${item.height / 100})`}
          style={{ pointerEvents: "none", color: item.tint }}
          dangerouslySetInnerHTML={{ __html: item.svg }}
        />
      )}

      {selected && (
        <g style={{ pointerEvents: "all" }}>
          {/* Bounding box */}
          <rect
            x={-halfW}
            y={-halfH}
            width={item.width}
            height={item.height}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* Resize handle (bottom-right) */}
          <rect
            x={halfW - 6}
            y={halfH - 6}
            width="12"
            height="12"
            fill="#fff"
            stroke="#3b82f6"
            strokeWidth="1.5"
            style={{ cursor: "nwse-resize" }}
            onPointerDown={handlePointerDown("resize")}
          />
          {/* Rotate handle (top center) */}
          <line
            x1={0}
            y1={-halfH}
            x2={0}
            y2={-halfH - 18}
            stroke="#3b82f6"
            strokeWidth="1"
          />
          <circle
            cx={0}
            cy={-halfH - 22}
            r="6"
            fill="#fff"
            stroke="#3b82f6"
            strokeWidth="1.5"
            style={{ cursor: "grab" }}
            onPointerDown={handlePointerDown("rotate")}
          />
        </g>
      )}
    </g>
  );
};
