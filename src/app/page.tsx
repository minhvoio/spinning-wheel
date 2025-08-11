"use client";

import { useCallback, useMemo, useState } from "react";
import SpinningWheel, { Wheel } from "@/components/SpinningWheel";
import { PALETTES, isValidColorHex, type Palette } from "@/lib/palettes";

type AppState = {
  wheels: Wheel[];
  hasSpun: boolean;
  paletteId: string; // selected palette id
  customColors: string; // comma or space separated hexes
};

const createEmptyWheel = (): Wheel => ({
  id: crypto.randomUUID(),
  rawInput: "",
  names: [],
});

export default function Home() {
  const [state, setState] = useState<AppState>({
    wheels: [createEmptyWheel()],
    hasSpun: false,
    paletteId: "tailwind-vivid",
    customColors: "",
  });

  const canRemove = state.wheels.length > 1;

  const handleChange = useCallback((id: string, rawInput: string) => {
    setState((prev) => ({
      ...prev,
      wheels: prev.wheels.map((w) =>
        w.id === id
          ? {
              ...w,
              rawInput,
              names: rawInput
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0),
              error: undefined,
            }
          : w
      ),
    }));
  }, []);

  const handleRemove = useCallback((id: string) => {
    setState((prev) => {
      if (prev.wheels.length <= 1) return prev;
      return { ...prev, wheels: prev.wheels.filter((w) => w.id !== id) };
    });
  }, []);

  const handleAddWheel = useCallback(() => {
    setState((prev) => ({
      ...prev,
      wheels: [...prev.wheels, createEmptyWheel()],
    }));
  }, []);

  const handleReset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasSpun: false,
      wheels: prev.wheels.map((w) => ({
        ...w,
        rawInput: "",
        names: [],
        lastResult: undefined,
        error: undefined,
        selectedIndex: undefined,
        spinId: undefined,
      })),
    }));
  }, []);

  const handleStartOrRedo = useCallback(() => {
    setState((prev) => {
      const updated = prev.wheels.map((w) => {
        if (w.names.length < 1) {
          return {
            ...w,
            lastResult: undefined,
            error: "Add at least one name",
            selectedIndex: undefined,
            spinId: undefined,
          };
        }
        const index = Math.floor(Math.random() * w.names.length);
        return {
          ...w,
          // Set result after spin ends so highlight matches label
          lastResult: undefined,
          error: undefined,
          selectedIndex: index,
          spinId: crypto.randomUUID(),
        };
      });
      return { ...prev, wheels: updated, hasSpun: true };
    });
  }, []);

  const handleSpinEnd = useCallback((id: string, result: string) => {
    setState((prev) => ({
      ...prev,
      wheels: prev.wheels.map((w) =>
        w.id === id ? { ...w, lastResult: result } : w
      ),
    }));
  }, []);

  const startLabel = useMemo(
    () => (state.hasSpun ? "Redo" : "Start"),
    [state.hasSpun]
  );

  const activePalette = useMemo<Palette>(() => {
    const found = PALETTES.find((p) => p.id === state.paletteId) ?? PALETTES[0];
    if (found.id !== "custom") return found;
    const colors = state.customColors
      .split(/[\s,]+/)
      .map((c) => c.trim())
      .filter((c) => isValidColorHex(c));
    return {
      ...found,
      colors: colors.length ? colors : ["#3b82f6", "#f59e0b"],
    };
  }, [state.paletteId, state.customColors]);

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Spinning Wheel</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-foreground text-background text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={handleStartOrRedo}
              aria-label={startLabel}
            >
              {startLabel}
            </button>

            <button
              type="button"
              className="px-3 py-2 rounded border text-sm hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={handleReset}
              aria-label="Reset all wheels"
            >
              Reset
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded border text-sm hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={handleAddWheel}
              aria-label="Add wheel"
            >
              + Add Wheel
            </button>
            <div className="hidden sm:flex items-center gap-2">
              {/* <label htmlFor="palette" className="text-sm">
                Palette
              </label> */}
              <select
                id="palette"
                className="border rounded px-2 py-2 text-sm"
                value={state.paletteId}
                onChange={(e) =>
                  setState((p) => ({ ...p, paletteId: e.target.value }))
                }
                aria-label="Choose color palette"
              >
                {PALETTES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {state.paletteId === "custom" && (
                <input
                  type="text"
                  className="border rounded px-2 py-1 text-sm w-[260px]"
                  placeholder="#ff0000, #00ff00, #0000ff"
                  value={state.customColors}
                  onChange={(e) =>
                    setState((p) => ({ ...p, customColors: e.target.value }))
                  }
                  aria-label="Custom colors"
                />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
        {state.wheels.map((wheel) => (
          <SpinningWheel
            key={wheel.id}
            wheel={wheel}
            canRemove={canRemove}
            onChange={handleChange}
            onRemove={handleRemove}
            onSpinEnd={(result) => handleSpinEnd(wheel.id, result)}
            colors={activePalette.colors}
          />
        ))}
      </main>
    </div>
  );
}
