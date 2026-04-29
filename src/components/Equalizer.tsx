export function Equalizer({ className = "" }: { className?: string }) {
  const delays = [0, 0.15, 0.3, 0.45, 0.6];
  return (
    <div className={`flex items-end gap-[3px] h-4 ${className}`}>
      {delays.map((d, i) => (
        <span
          key={i}
          className="eq-bar w-[3px] rounded-full bg-warm"
          style={{ animationDelay: `${d}s`, height: "100%" }}
        />
      ))}
    </div>
  );
}
