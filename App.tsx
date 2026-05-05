import { useMemo, useRef, useState } from "react";
import { Shirt, type ShirtView, type FabricTexture, PRINT_AREAS } from "./components/Shirt";
import { DesignLayer, type DesignItem } from "./components/DesignLayer";
import { GARMENT_COLORS, GRAPHICS, FONT_OPTIONS } from "./data/graphics";

const VIEWS: ShirtView[] = ["front", "back", "left", "right"];
const TEXTURES: { id: FabricTexture; name: string; desc: string }[] = [
  { id: "smooth", name: "Smooth", desc: "Soft jersey" },
  { id: "cotton", name: "Cotton", desc: "100% combed" },
  { id: "heather", name: "Heather", desc: "Mottled blend" },
  { id: "ribbed", name: "Ribbed", desc: "Knit ribbing" },
  { id: "denim", name: "Denim", desc: "Heavy weave" },
];

const uid = () => Math.random().toString(36).slice(2, 9);

export default function App() {
  const [view, setView] = useState<ShirtView>("front");
  const [color, setColor] = useState<string>(GARMENT_COLORS[0].hex);
  const [texture, setTexture] = useState<FabricTexture>("cotton");
  const [items, setItems] = useState<DesignItem[]>([
    {
      id: uid(),
      type: "text",
      view: "front",
      x: 200,
      y: 230,
      width: 110,
      height: 28,
      rotation: 0,
      text: "TEESTUDIO",
      font: FONT_OPTIONS[3].value,
      color: "#1a1a1a",
      weight: 800,
      italic: false,
    },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"product" | "text" | "graphics" | "fabric">("product");

  const svgRef = useRef<SVGSVGElement | null>(null);

  const visibleItems = useMemo(() => items.filter((i) => i.view === view), [items, view]);
  const selectedItem = items.find((i) => i.id === selectedId) || null;

  const updateItem = (next: DesignItem) => {
    setItems((prev) => prev.map((i) => (i.id === next.id ? next : i)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const addText = () => {
    const area = PRINT_AREAS[view];
    const newItem: DesignItem = {
      id: uid(),
      type: "text",
      view,
      x: area.x + area.w / 2,
      y: area.y + area.h / 2,
      width: 100,
      height: 24,
      rotation: 0,
      text: "Your Text",
      font: FONT_OPTIONS[0].value,
      color: "#000000",
      weight: 700,
      italic: false,
    };
    setItems((p) => [...p, newItem]);
    setSelectedId(newItem.id);
    setTab("text");
  };

  const addGraphic = (svg: string) => {
    const area = PRINT_AREAS[view];
    const newItem: DesignItem = {
      id: uid(),
      type: "graphic",
      view,
      x: area.x + area.w / 2,
      y: area.y + area.h / 2,
      width: 80,
      height: 80,
      rotation: 0,
      svg,
      tint: "#1a1a1a",
    };
    setItems((p) => [...p, newItem]);
    setSelectedId(newItem.id);
  };

  // --- Side panel: product (color picker) ---
  const renderProductPanel = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Garment Color</h3>
        <div className="grid grid-cols-7 gap-2">
          {GARMENT_COLORS.map((c) => (
            <button
              key={c.hex}
              title={c.name}
              onClick={() => setColor(c.hex)}
              className={`relative h-9 w-9 rounded-full border-2 transition ${
                color === c.hex ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-400"
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
          />
          <span className="text-xs text-slate-500">Custom: {color.toUpperCase()}</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Quick Add</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={addText}
            className="rounded-lg bg-slate-900 text-white text-sm py-2 hover:bg-slate-700 transition"
          >
            + Add Text
          </button>
          <button
            onClick={() => setTab("graphics")}
            className="rounded-lg border border-slate-300 text-sm py-2 hover:bg-slate-50 transition"
          >
            + Graphic
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Layers ({items.length})</h3>
        <div className="space-y-1 max-h-56 overflow-auto pr-1">
          {items.length === 0 && <p className="text-xs text-slate-400">No design elements yet.</p>}
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setView(item.view);
                setSelectedId(item.id);
              }}
              className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded border text-xs cursor-pointer transition ${
                selectedId === item.id
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                  {item.view}
                </span>
                <span className="truncate text-slate-700">
                  {item.type === "text" ? `"${item.text}"` : "Graphic"}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="text-slate-400 hover:text-red-500"
                aria-label="delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // --- Text panel ---
  const renderTextPanel = () => {
    if (!selectedItem || selectedItem.type !== "text") {
      return (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            Select a text element to edit, or add a new one.
          </p>
          <button
            onClick={addText}
            className="w-full rounded-lg bg-slate-900 text-white text-sm py-2 hover:bg-slate-700 transition"
          >
            + Add Text
          </button>
        </div>
      );
    }
    const t = selectedItem;
    return (
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600">Text</label>
          <input
            type="text"
            value={t.text}
            onChange={(e) => updateItem({ ...t, text: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Font</label>
          <select
            value={t.font}
            onChange={(e) => updateItem({ ...t, font: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.name} value={f.value} style={{ fontFamily: f.value }}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Color</label>
            <input
              type="color"
              value={t.color}
              onChange={(e) => updateItem({ ...t, color: e.target.value })}
              className="mt-1 w-full h-9 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Weight</label>
            <select
              value={t.weight}
              onChange={(e) => updateItem({ ...t, weight: parseInt(e.target.value) })}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white"
            >
              {[300, 400, 500, 600, 700, 800, 900].map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={t.italic}
              onChange={(e) => updateItem({ ...t, italic: e.target.checked })}
            />
            Italic
          </label>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">
            Size: {Math.round(t.height)}px
          </label>
          <input
            type="range"
            min={12}
            max={80}
            value={t.height}
            onChange={(e) => {
              const h = parseInt(e.target.value);
              const ratio = t.width / t.height;
              updateItem({ ...t, height: h, width: h * ratio });
            }}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">
            Rotation: {Math.round(t.rotation)}°
          </label>
          <input
            type="range"
            min={-180}
            max={180}
            value={t.rotation}
            onChange={(e) => updateItem({ ...t, rotation: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        <button
          onClick={() => removeItem(t.id)}
          className="w-full rounded-lg border border-red-200 text-red-600 text-sm py-2 hover:bg-red-50 transition"
        >
          Delete Text
        </button>
      </div>
    );
  };

  // --- Graphics panel ---
  const renderGraphicsPanel = () => (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Click a graphic to add it to the current view.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {GRAPHICS.map((g) => (
          <button
            key={g.id}
            onClick={() => addGraphic(g.svg)}
            title={g.name}
            className="aspect-square rounded-lg border border-slate-200 bg-white p-3 hover:border-blue-400 hover:bg-blue-50 transition text-slate-800"
            dangerouslySetInnerHTML={{ __html: g.svg }}
          />
        ))}
      </div>

      {selectedItem && selectedItem.type === "graphic" && (
        <div className="space-y-3 border-t border-slate-200 pt-4">
          <h4 className="text-sm font-semibold text-slate-700">Selected Graphic</h4>
          <div>
            <label className="text-xs font-medium text-slate-600">Tint Color</label>
            <input
              type="color"
              value={selectedItem.tint}
              onChange={(e) => updateItem({ ...selectedItem, tint: e.target.value })}
              className="mt-1 w-full h-9 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">
              Size: {Math.round(selectedItem.width)}px
            </label>
            <input
              type="range"
              min={20}
              max={140}
              value={selectedItem.width}
              onChange={(e) => {
                const w = parseInt(e.target.value);
                updateItem({ ...selectedItem, width: w, height: w });
              }}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">
              Rotation: {Math.round(selectedItem.rotation)}°
            </label>
            <input
              type="range"
              min={-180}
              max={180}
              value={selectedItem.rotation}
              onChange={(e) => updateItem({ ...selectedItem, rotation: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <button
            onClick={() => removeItem(selectedItem.id)}
            className="w-full rounded-lg border border-red-200 text-red-600 text-sm py-2 hover:bg-red-50 transition"
          >
            Delete Graphic
          </button>
        </div>
      )}
    </div>
  );

  // --- Fabric panel ---
  const renderFabricPanel = () => (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Choose a fabric finish. The shirt preview will update with a subtle texture overlay.
      </p>
      <div className="grid grid-cols-1 gap-2">
        {TEXTURES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTexture(t.id)}
            className={`flex items-center gap-3 rounded-lg border p-2 text-left transition ${
              texture === t.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            {/* Mini swatch */}
            <div className="h-12 w-16 rounded overflow-hidden border border-slate-200">
              <svg viewBox="0 0 64 48" className="w-full h-full">
                <defs>
                  <pattern
                    id={`mini-${t.id}`}
                    width={t.id === "ribbed" ? 6 : 6}
                    height={t.id === "ribbed" ? 2 : 6}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="6" height="6" fill={color} />
                    {t.id === "cotton" && (
                      <>
                        <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.3)" />
                        <circle cx="4" cy="3" r="0.4" fill="rgba(0,0,0,0.18)" />
                      </>
                    )}
                    {t.id === "heather" && (
                      <path d="M0 0 L6 6 M0 6 L6 0" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                    )}
                    {t.id === "ribbed" && (
                      <>
                        <line x1="0" y1="0" x2="6" y2="0" stroke="rgba(0,0,0,0.25)" strokeWidth="0.4" />
                        <line x1="0" y1="1.4" x2="6" y2="1.4" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" />
                      </>
                    )}
                    {t.id === "denim" && (
                      <path d="M0 0 L6 6 M0 3 L3 6 M3 0 L6 3" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
                    )}
                  </pattern>
                </defs>
                <rect width="64" height="48" fill={`url(#mini-${t.id})`} />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">{t.name}</div>
              <div className="text-xs text-slate-500">{t.desc}</div>
            </div>
            {texture === t.id && <span className="text-blue-500 text-sm">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            T
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">TeeStudio</h1>
            <p className="text-xs text-slate-500 leading-tight">Custom T-Shirt Designer</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setItems([]);
              setSelectedId(null);
            }}
            className="text-sm px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50"
          >
            Clear
          </button>
          <button className="text-sm px-3 py-1.5 rounded bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90">
            Save Design
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_180px] gap-4 p-4">
        {/* Left: tabs + panels */}
        <aside className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 text-xs font-medium">
            {[
              { id: "product", label: "Product" },
              { id: "text", label: "Text" },
              { id: "graphics", label: "Graphics" },
              { id: "fabric", label: "Fabric" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`flex-1 py-2.5 transition ${
                  tab === t.id
                    ? "text-blue-600 border-b-2 border-blue-500 bg-blue-50/50"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="p-4">
            {tab === "product" && renderProductPanel()}
            {tab === "text" && renderTextPanel()}
            {tab === "graphics" && renderGraphicsPanel()}
            {tab === "fabric" && renderFabricPanel()}
          </div>
        </aside>

        {/* Center: canvas */}
        <main className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_30%,#f1f5f9_0%,#e2e8f0_100%)] rounded-t-xl min-h-[480px]">
            <div className="w-full max-w-[480px] aspect-[400/480]">
              <Shirt
                color={color}
                view={view}
                texture={texture}
                svgRef={svgRef}
                onBackgroundClick={() => setSelectedId(null)}
              >
                <DesignLayer
                  items={visibleItems}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onChange={updateItem}
                  svgRef={svgRef}
                />
              </Shirt>
            </div>
          </div>

          {/* View switcher */}
          <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between bg-white rounded-b-xl">
            <div className="text-xs text-slate-500">
              Print area: <span className="font-mono text-slate-700">
                {PRINT_AREAS[view].w}×{PRINT_AREAS[view].h}
              </span>
            </div>
            <div className="flex gap-1.5">
              {VIEWS.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setView(v);
                    setSelectedId(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${
                    view === v
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* Right: thumbnails of all views */}
        <aside className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-3">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">All Views</h3>
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`w-full rounded-lg border-2 overflow-hidden transition ${
                view === v ? "border-blue-500" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="aspect-[400/480] bg-slate-50">
                <Shirt color={color} view={v} texture={texture} showPrintArea={false}>
                  {items
                    .filter((i) => i.view === v)
                    .map((item) => {
                      const halfW = item.width / 2;
                      const halfH = item.height / 2;
                      return (
                        <g
                          key={item.id}
                          transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation})`}
                        >
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
                              textLength={item.width}
                              lengthAdjust="spacingAndGlyphs"
                            >
                              {item.text}
                            </text>
                          ) : (
                            <g
                              transform={`translate(${-halfW}, ${-halfH}) scale(${item.width / 100}, ${item.height / 100})`}
                              style={{ color: item.tint }}
                              dangerouslySetInnerHTML={{ __html: item.svg }}
                            />
                          )}
                        </g>
                      );
                    })}
                </Shirt>
              </div>
              <div className="text-[10px] uppercase tracking-wide font-medium py-1 bg-white text-slate-600">
                {v}
              </div>
            </button>
          ))}
        </aside>
      </div>

      <footer className="text-center text-xs text-slate-400 py-4">
        Drag items in the print area • Use handles to resize/rotate • Switch views to design front, back & sleeves
      </footer>
    </div>
  );
}
