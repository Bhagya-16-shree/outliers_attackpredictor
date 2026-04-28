import { AlertTriangle, ShieldAlert, Info, Flame } from "lucide-react";
import { Alert } from "@/lib/predict";

interface AlertsPanelProps {
  alerts: Alert[];
}

const SEVERITY = {
  low: { color: "text-muted-foreground border-muted-foreground/30 bg-muted/20", icon: Info, label: "LOW" },
  medium: { color: "text-warning border-warning/40 bg-warning/10", icon: AlertTriangle, label: "MED" },
  high: { color: "text-destructive border-destructive/40 bg-destructive/10", icon: ShieldAlert, label: "HIGH" },
  critical: { color: "text-destructive border-destructive bg-destructive/20 glow-red", icon: Flame, label: "CRIT" },
} as const;

const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ShieldAlert className="w-10 h-10 mb-2 opacity-40" />
        <p className="text-sm">No active anomalies detected</p>
        <p className="text-xs opacity-60 mt-1">Systems nominal</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
      {alerts.map((a) => {
        const cfg = SEVERITY[a.severity];
        const Icon = cfg.icon;
        const time = new Date(a.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return (
          <li
            key={a.id}
            className={`animate-fade-in-up flex items-start gap-3 p-3 rounded-lg border ${cfg.color} transition-all`}
          >
            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground">
                  {a.title}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border tracking-wider ${cfg.color}`}
                >
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {a.detail}
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">
                {time}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default AlertsPanel;
