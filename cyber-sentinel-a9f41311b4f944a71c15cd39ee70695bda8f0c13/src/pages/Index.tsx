import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, Shield, Zap, RotateCcw, Cpu, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import RiskGauge from "@/components/RiskGauge";
import KillChain from "@/components/KillChain";
import ActivityTimeline, { TimelinePoint } from "@/components/ActivityTimeline";
import AlertsPanel from "@/components/AlertsPanel";
import {
  Alert,
  generateBehavior,
  predict,
  Prediction,
} from "@/lib/predict";

const POLL_MS = 1500;
const MAX_TIMELINE = 30;
const MAX_ALERTS = 25;

const Index = () => {
  const [prediction, setPrediction] = useState<Prediction>({
    risk_score: 0,
    predicted_stage: "Reconnaissance",
    stage_index: 0,
    alerts: [],
  });
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [attackIntensity, setAttackIntensity] = useState(0);
  const [attackActive, setAttackActive] = useState(false);
  const attackRef = useRef(0);

  // Keep ref in sync for the interval closure
  useEffect(() => {
    attackRef.current = attackIntensity;
  }, [attackIntensity]);

  // Ramp attack intensity over time when active
  useEffect(() => {
    if (!attackActive) return;
    const ramp = setInterval(() => {
      setAttackIntensity((prev) => {
        const next = Math.min(1, prev + 0.08);
        if (next >= 1) clearInterval(ramp);
        return next;
      });
    }, 600);
    return () => clearInterval(ramp);
  }, [attackActive]);

  // Polling loop — simulates frontend polling FastAPI /predict
  useEffect(() => {
    const tick = () => {
      const behavior = generateBehavior(attackRef.current);
      const result = predict(behavior);

      setPrediction(result);

      setTimeline((prev) => {
        const next: TimelinePoint = {
          t: new Date().toLocaleTimeString([], {
            minute: "2-digit",
            second: "2-digit",
          }),
          logins: behavior.failed_logins,
          files: behavior.file_access_count,
          network: Math.round(behavior.network_anomaly),
        };
        const merged = [...prev, next];
        return merged.slice(-MAX_TIMELINE);
      });

      if (result.alerts.length > 0) {
        setAlerts((prev) => {
          const merged = [...result.alerts, ...prev];
          return merged.slice(0, MAX_ALERTS);
        });
      }

      // Auto-decay when not actively attacking
      if (!attackActive && attackRef.current > 0) {
        setAttackIntensity((p) => Math.max(0, p - 0.05));
      }
    };

    tick();
    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
  }, [attackActive]);

  const handleSimulate = () => {
    setAttackActive(true);
  };

  const handleReset = () => {
    setAttackActive(false);
    setAttackIntensity(0);
    setAlerts([]);
    setTimeline([]);
  };

  const status = useMemo(() => {
    if (prediction.risk_score >= 70)
      return { label: "THREAT DETECTED", color: "text-destructive", dot: "bg-destructive" };
    if (prediction.risk_score >= 40)
      return { label: "MONITORING", color: "text-warning", dot: "bg-warning" };
    return { label: "SECURE", color: "text-success", dot: "bg-success" };
  }, [prediction.risk_score]);

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl glass-panel flex items-center justify-center glow-cyan">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-glow-cyan">
              APT-Predict
            </h1>
            <p className="text-xs text-muted-foreground tracking-wider">
              BEHAVIORAL ANOMALY · CYBER KILL CHAIN PREDICTION
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel">
            <span
              className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`}
            />
            <span className={`text-xs font-semibold tracking-wider ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>SOC-NODE-01</span>
          </div>
        </div>
      </header>

      {/* Top row: Gauge + Kill chain */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <section className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">
              THREAT INDEX
            </h2>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <RiskGauge score={prediction.risk_score} />
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Predicted stage:{" "}
            <span className="text-foreground font-semibold">
              {prediction.predicted_stage}
            </span>
          </p>
        </section>

        <section className="glass-panel rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">
              CYBER KILL CHAIN — PREDICTED PROGRESSION
            </h2>
            <Radio className="w-4 h-4 text-secondary animate-pulse" />
          </div>
          <KillChain currentStageIndex={prediction.stage_index} />

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={handleSimulate}
              disabled={attackActive && attackIntensity >= 1}
              className="bg-gradient-to-r from-destructive to-secondary hover:opacity-90 text-destructive-foreground font-semibold tracking-wide glow-red"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              {attackActive ? "Attack In Progress…" : "Simulate Attack"}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="border-border hover:bg-muted/30"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <div className="flex-1 min-w-[200px] flex items-center gap-2">
              <span className="text-xs text-muted-foreground tracking-wider">
                INTENSITY
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-warning to-destructive transition-all duration-500"
                  style={{ width: `${attackIntensity * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-foreground w-10 text-right">
                {Math.round(attackIntensity * 100)}%
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom row: Timeline + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="glass-panel rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">
              LIVE ACTIVITY TIMELINE
            </h2>
            <div className="flex gap-3 text-[10px] tracking-wider">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary" /> LOGINS
              </span>
              <span className="flex items-center gap-1.5 text-secondary">
                <span className="w-2 h-2 rounded-full bg-secondary" /> FILES
              </span>
              <span className="flex items-center gap-1.5 text-destructive">
                <span className="w-2 h-2 rounded-full bg-destructive" /> NETWORK
              </span>
            </div>
          </div>
          <ActivityTimeline data={timeline} />
        </section>

        <section className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">
              ANOMALY ALERTS
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {alerts.length} active
            </span>
          </div>
          <AlertsPanel alerts={alerts} />
        </section>
      </div>

      <footer className="mt-6 text-center text-[10px] text-muted-foreground/60 tracking-widest">
        APT-PREDICT · BEHAVIORAL THREAT INTELLIGENCE · DEMO BUILD
      </footer>
    </main>
  );
};

export default Index;
