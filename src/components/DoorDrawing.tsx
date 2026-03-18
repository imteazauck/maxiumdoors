type DoorDrawingProps = {
  type: "single" | "double";
  frameClass: string;
  variant?: number;
};

export default function DoorDrawing({ type, frameClass, variant = 0 }: DoorDrawingProps) {
  const glassClass = variant % 2 === 0 ? "bg-zinc-200/30" : "bg-zinc-300/20";

  if (type === "double") {
    return (
      <div className={`relative flex h-[320px] w-[200px] gap-2 rounded-[1.2rem] border-[8px]  shadow-sm ${frameClass}`}>
        {[0, 1].map((leaf) => (
          <div key={leaf} className={`relative h-full flex-1 rounded-[0.7rem] border border-white/15 ${glassClass}`}>
            <div className="absolute left-1/2 top-[10px] bottom-[10px] w-px -translate-x-1/2 bg-white/35" />
            <div className="absolute left-[10px] right-[10px] top-1/3 h-px bg-white/35" />
            <div className="absolute left-[10px] right-[10px] top-2/3 h-px bg-white/35" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative h-[320px] w-[135px] rounded-[1.2rem] border-[8px] shadow-sm ${frameClass}`}>
      <div className={`absolute inset-[10px] rounded-[0.7rem] border border-white/15 ${glassClass}`} />
      <div className="absolute left-1/2 top-[10px] bottom-[10px] w-px -translate-x-1/2 bg-white/35" />
      <div className="absolute left-[10px] right-[10px] top-1/3 h-px bg-white/35" />
      <div className="absolute left-[10px] right-[10px] top-2/3 h-px bg-white/35" />
    </div>
  );
}