import type { ConfigSelections } from "../services/mockConfiguratorApi";

function humanize(value?: string) {
  if (!value) return "";
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function previewBorder(colour?: string) {
  switch (colour) {
    case "red":
      return "#b91c1c";
    case "blue":
      return "#1d4ed8";
    case "green":
      return "#166534";
    case "black":
      return "#111827";
    default:
      return "#F47A20";
  }
}

export default function DrawingPanel({
  selections,
  drawingLabel,
}: {
  selections: ConfigSelections;
  drawingLabel: string;
}) {
  const borderColour = previewBorder(selections.colour);

  return (
    <div className="rounded-[2rem] border border-[#D7D7D7] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6B6B6B]">
            Live drawing - Preview panel
          </p>

        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] bg-[#FFF9F4] p-4">
        <div
          className="flex min-h-[420px] items-center justify-center rounded-[1.5rem] bg-white p-6"
          style={{ border: `6px solid ${borderColour}` }}
        >
          <div className="relative flex h-[360px] w-[240px] items-center justify-center rounded-[0.5rem] border-2 border-[#B8B8B8] bg-[#FFF9F4]">
            <div className="absolute inset-y-0 left-2 border-l border-dashed border-[#B8B8B8]" />
            <div className="absolute inset-y-0 right-2 border-l border-dashed border-[#B8B8B8]" />
            <div className="absolute bottom-10 right-5 flex items-center gap-2">
              <div className="h-[2px] w-7 bg-[#7B847E]" />
              <div className="h-3 w-3 rounded-full border border-[#7B847E]" />
            </div>
            <div className="absolute inset-6 border border-[#E6DDD4]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_49.5%,#EBD7C8_50%,transparent_50.5%)] opacity-70" />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-[#FFF8F2]/95 px-3 py-2 text-center text-xs font-medium text-[#111111] shadow-sm">
              {humanize(selections.leafType) || "Door leaf"}
              {selections.handing ? ` · ${humanize(selections.handing)}` : ""}
              {selections.colour ? ` · ${humanize(selections.colour)}` : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-[#D7D7D7] bg-[#FFF9F4] p-5 ring-1 ring-[#F47A20]/10">
        <p className="text-sm font-semibold text-[#111111]">Preview status</p>
        <p className="mt-2 text-sm leading-6 text-[#2A2A2A]">{drawingLabel}</p>
      </div>
    </div>
  );
}
