export type Palette = {
  id: string;
  name: string;
  colors: string[]; // hex strings like #RRGGBB
};

export const PALETTES: Palette[] = [
  {
    id: "tailwind-vivid",
    name: "Tailwind Vivid",
    colors: [
      "#ef4444", // red-500
      "#f97316", // orange-500
      "#f59e0b", // amber-500
      "#eab308", // yellow-500
      "#84cc16", // lime-500
      "#22c55e", // green-500
      "#10b981", // emerald-500
      "#14b8a6", // teal-500
      "#06b6d4", // cyan-500
      "#0ea5e9", // sky-500
      "#3b82f6", // blue-500
      "#6366f1", // indigo-500
      "#8b5cf6", // violet-500
      "#a855f7", // purple-500
      "#d946ef", // fuchsia-500
      "#ec4899", // pink-500
      "#f43f5e", // rose-500
    ],
  },
  {
    id: "material",
    name: "Material (Classic)",
    colors: [
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#03A9F4",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
    ],
  },
  {
    id: "nord",
    name: "Nord",
    colors: [
      "#5E81AC",
      "#81A1C1",
      "#88C0D0",
      "#8FBCBB",
      "#A3BE8C",
      "#EBCB8B",
      "#D08770",
      "#BF616A",
      "#B48EAD",
    ],
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: [
      "#FFB3BA",
      "#FFDFBA",
      "#FFFFBA",
      "#BAFFC9",
      "#BAE1FF",
      "#E5BAFF",
      "#FFC6FF",
      "#C7FFD8",
    ],
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: [
      "#023E8A",
      "#0077B6",
      "#0096C7",
      "#00B4D8",
      "#48CAE4",
      "#90E0EF",
      "#ADE8F4",
      "#CAF0F8",
    ],
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: [
      "#ff6b6b",
      "#f06595",
      "#e8590c",
      "#f08c00",
      "#ffd43b",
      "#94d82d",
      "#20c997",
      "#15aabf",
    ],
  },
  { id: "custom", name: "Custom (enter colors)", colors: [] },
];

export function isValidColorHex(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}
