"use client";

import { useEffect, useRef, useState } from "react";

export type Wheel = {
  id: string;
  rawInput: string;
  names: string[];
  lastResult?: string;
  error?: string;
  selectedIndex?: number;
  spinId?: string;
};

type Props = {
  wheel: Wheel;
  onChange: (id: string, rawInput: string) => void;
  onRemove: (id: string) => void;
  canRemove?: boolean;
  onSpinEnd?: (result: string) => void;
  colors?: string[];
};

export default function SpinningWheel({
  wheel,
  onChange,
  onRemove,
  canRemove = true,
  onSpinEnd,
  colors = ["#ef4444", "#f59e0b", "#10b981", "#0ea5e9", "#8b5cf6"],
}: Props) {
  const { rawInput, lastResult, error } = wheel;

  const segmentCount = Math.max(wheel.names.length, 1);
  const segmentAngle = 360 / segmentCount;

  // Animation state driven by spinId changes
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(0);
  const lastSpinIdRef = useRef<string | undefined>(undefined);
  const rotationRef = useRef<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  useEffect(() => {
    if (!wheel.spinId || wheel.spinId === lastSpinIdRef.current) return;
    lastSpinIdRef.current = wheel.spinId;

    if (wheel.selectedIndex == null || segmentCount < 1) return;

    // Compute target rotation relative to current so it always spins forward
    const current = rotationRef.current;
    const centerAngle = segmentAngle * (wheel.selectedIndex + 0.5); // 0deg is pointer (3 o'clock)
    const normalize = (deg: number) => ((deg % 360) + 360) % 360;
    const deltaToCenter = normalize(-centerAngle - normalize(current));
    const fullSpins = 6 + Math.floor(Math.random() * 3); // 6-8 full spins consistently
    const target = current + fullSpins * 360 + deltaToCenter;
    const duration = 2600 + Math.floor(Math.random() * 800); // 2.6s - 3.4s

    setIsSpinning(true);
    setDurationMs(duration);
    rotationRef.current = target;
    requestAnimationFrame(() => setRotationDeg(target));
  }, [wheel.spinId, wheel.selectedIndex, segmentAngle, segmentCount]);

  return (
    <section className="border rounded-lg p-4 bg-white/50 dark:bg-black/20">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold">Wheel</h2>
        <button
          type="button"
          className="px-2 py-1 rounded border text-sm disabled:opacity-50"
          onClick={() => onRemove(wheel.id)}
          disabled={!canRemove}
          aria-disabled={!canRemove}
          aria-label="Remove wheel"
        >
          – Remove
        </button>
      </div>

      <div className="mt-3 grid grid-cols-[200px_1fr] gap-4 items-start">
        <div className="relative flex items-center justify-center">
          <div
            className="w-[180px] h-[180px] rounded-full border relative overflow-hidden"
            style={{
              transform: `rotate(${rotationDeg}deg)`,
              transition: durationMs
                ? `transform ${durationMs}ms cubic-bezier(0.17, 0.67, 0.33, 1)`
                : undefined,
            }}
            onTransitionEnd={() => {
              setIsSpinning(false);
              if (
                wheel.selectedIndex != null &&
                wheel.names[wheel.selectedIndex]
              ) {
                onSpinEnd?.(wheel.names[wheel.selectedIndex]);
              }
            }}
            aria-label="Spinning wheel"
            role="img"
          >
            <svg
              viewBox="0 0 180 180"
              width="180"
              height="180"
              className="block"
            >
              <g transform="translate(90,90)">
                {Array.from({ length: segmentCount }).map((_, i) => {
                  const start = i * segmentAngle;
                  const end = (i + 1) * segmentAngle;
                  const largeArc = end - start > 180 ? 1 : 0;
                  const r = 88;
                  const rad = (deg: number) => (deg * Math.PI) / 180;
                  const x1 = Math.cos(rad(start)) * r;
                  const y1 = Math.sin(rad(start)) * r;
                  const x2 = Math.cos(rad(end)) * r;
                  const y2 = Math.sin(rad(end)) * r;
                  const shouldHighlight =
                    !isSpinning &&
                    wheel.selectedIndex === i &&
                    wheel.names.length > 0;
                  const baseColor = colors[i % colors.length] ?? "#e5e7eb";
                  const fill = shouldHighlight ? baseColor : `${baseColor}26`;
                  const mid = start + segmentAngle / 2;
                  const labelR = 60;
                  const lx = Math.cos(rad(mid)) * labelR;
                  const ly = Math.sin(rad(mid)) * labelR;
                  const name = wheel.names[i] ?? "";
                  return (
                    <g key={i}>
                      <path
                        d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={fill}
                        stroke="rgba(0,0,0,0.12)"
                      />
                      {wheel.names.length > 0 && (
                        <text
                          x={lx}
                          y={ly}
                          fontSize="10"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ fontWeight: shouldHighlight ? 600 : 400 }}
                        >
                          {name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
          <div
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-red-500"
            aria-hidden
          />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium"
            htmlFor={`names-${wheel.id}`}
          >
            Names
          </label>
          <textarea
            id={`names-${wheel.id}`}
            className="w-full min-h-[120px] rounded border p-2 text-sm focus:outline-none focus:ring-2"
            placeholder="Enter names (one per line)"
            value={rawInput}
            onChange={(e) => onChange(wheel.id, e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `names-${wheel.id}-error` : undefined}
          />
          {error ? (
            <p id={`names-${wheel.id}-error`} className="text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <p className="text-sm">
            <span className="font-medium">Result:</span> {lastResult ?? "—"}
          </p>
        </div>
      </div>
    </section>
  );
}
