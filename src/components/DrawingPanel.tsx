import type { ConfigSelections } from "../services/mockConfiguratorApi";

export default function DrawingPanel({
  selections,
  drawingLabel,
}: {
  selections: ConfigSelections;
  drawingLabel: string;
}) {
  const isDouble = selections.doorType?.includes("double");
  const isVision = selections.doorType?.includes("vision");
  const isLouvre = selections.doorType?.includes("louvre");

  return (
    <div className="rounded-[2rem] border border-[#DCE5DD] bg-[#F8FAF8] p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8A908C]">
            Live drawing
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#40584A]">Configuration preview</h2>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-[#DCE5DD] bg-white p-6">
        <svg viewBox="0 0 360 440" className="mx-auto h-auto w-full max-w-[22rem]">
          <rect x="40" y="20" width="280" height="390" rx="8" fill="#e8eeea" stroke="#40584A" strokeWidth="8" />
          {isDouble ? (
            <>
              <rect x="62" y="42" width="114" height="346" fill="#f8fbf8" stroke="#40584A" strokeWidth="6" />
              <rect x="184" y="42" width="114" height="346" fill="#f8fbf8" stroke="#40584A" strokeWidth="6" />
              <line x1="180" y1="42" x2="180" y2="388" stroke="#40584A" strokeWidth="4" />
            </>
          ) : (
            <rect x="72" y="42" width="216" height="346" fill="#f8fbf8" stroke="#40584A" strokeWidth="6" />
          )}

          {isVision && (
            <rect x={isDouble ? 88 : 102} y="88" width={isDouble ? 184 : 156} height="96" fill="#dce8ef" stroke="#40584A" strokeWidth="5" />
          )}

          {isLouvre && (
            <>
              {[0, 1, 2, 3, 4].map((row) => (
                <line
                  key={row}
                  x1={isDouble ? 88 : 106}
                  y1={124 + row * 28}
                  x2={isDouble ? 272 : 254}
                  y2={124 + row * 28}
                  stroke="#7c8f82"
                  strokeWidth="8"
                />
              ))}
            </>
          )}

          <circle cx={isDouble ? 164 : 264} cy="212" r="6" fill="#40584A" />
          {isDouble && <circle cx="196" cy="212" r="6" fill="#40584A" />}
        </svg>
      </div>

      <div className="mt-4 rounded-[1.25rem] bg-white px-4 py-3 text-sm text-[#4B4F4C]">
        {drawingLabel}
      </div>
    </div>
  );
}
