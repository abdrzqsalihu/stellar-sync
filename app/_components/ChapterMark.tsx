const TOTAL = 3;

interface ChapterMarkProps {
  index: 1 | 2 | 3;
  label: string;
}

function ChapterMark({ index, label }: ChapterMarkProps) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <div className="flex items-center">
        {Array.from({ length: TOTAL }).map((_, i) => {
          const n = i + 1;
          return (
            <div key={n} className="flex items-center">
              <span
                className={
                  n === index
                    ? "h-1.5 w-1.5 rounded-full bg-[#5056FD]"
                    : "h-1.5 w-1.5 rounded-full bg-[#111827]/15"
                }
              />
              {n < TOTAL && (
                <span
                  className={`mx-1 h-px w-4 ${
                    n < index ? "bg-[#5056FD]/40" : "bg-[#111827]/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#5056FD]">
        {label}
      </span>
    </div>
  );
}

export default ChapterMark;
