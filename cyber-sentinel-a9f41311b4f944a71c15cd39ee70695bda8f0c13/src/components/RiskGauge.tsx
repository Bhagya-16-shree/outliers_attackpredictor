import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number; // 0-100
}

const RiskGauge = ({ score }: RiskGaugeProps) => {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const start = displayed;
    const delta = score - start;
    const duration = 600;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setDisplayed(start + delta * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const radius = 90;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const pct = displayed / 100;
  const offset = circumference * (1 - pct);

  const colorClass =
    displayed < 40
      ? "text-success"
      : displayed < 70
      ? "text-warning"
      : "text-destructive";

  const label =
    displayed < 40 ? "NORMAL" : displayed < 70 ? "ELEVATED" : "CRITICAL";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={220}
        height={220}
        viewBox="0 0 220 220"
        className={`${colorClass} transition-colors duration-500`}
      >
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
          </linearGradient>
          <filter id="gauge-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle
          cx={110}
          cy={110}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
          opacity={0.3}
        />
        {/* Progress */}
        <circle
          cx={110}
          cy={110}
          r={radius}
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 110 110)"
          filter="url(#gauge-glow)"
          style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
        />
        {/* Tick marks */}
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = (i / 40) * 2 * Math.PI - Math.PI / 2;
          const x1 = 110 + Math.cos(angle) * (radius + 10);
          const y1 = 110 + Math.sin(angle) * (radius + 10);
          const x2 = 110 + Math.cos(angle) * (radius + 16);
          const y2 = 110 + Math.sin(angle) * (radius + 16);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={1}
              opacity={i / 40 < pct ? 0.8 : 0.15}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-5xl font-bold tabular-nums ${colorClass} ${
            displayed >= 70 ? "text-glow-red animate-pulse-glow" : "text-glow-cyan"
          }`}
        >
          {Math.round(displayed)}
        </span>
        <span className="text-xs text-muted-foreground tracking-widest mt-1">
          RISK SCORE
        </span>
        <span
          className={`mt-2 text-[10px] font-semibold tracking-[0.3em] px-2 py-0.5 rounded-full border ${colorClass}`}
          style={{ borderColor: "currentColor" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default RiskGauge;
