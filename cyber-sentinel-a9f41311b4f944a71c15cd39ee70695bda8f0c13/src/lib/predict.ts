// Behavioral anomaly prediction engine (mirrors the FastAPI /predict spec).
// Rule-based scoring + kill chain stage mapping.

export type KillChainStage =
  | "Reconnaissance"
  | "Weaponization"
  | "Delivery"
  | "Exploitation"
  | "Installation"
  | "Command & Control"
  | "Actions on Objectives";

export const KILL_CHAIN: KillChainStage[] = [
  "Reconnaissance",
  "Weaponization",
  "Delivery",
  "Exploitation",
  "Installation",
  "Command & Control",
  "Actions on Objectives",
];

export interface BehavioralData {
  failed_logins: number;
  unusual_login_time: boolean;
  file_access_count: number;
  privilege_escalation: boolean;
  network_anomaly: number; // 0-100
}

export interface Alert {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  detail: string;
  timestamp: number;
}

export interface Prediction {
  risk_score: number;
  predicted_stage: KillChainStage;
  stage_index: number;
  alerts: Alert[];
}

let alertCounter = 0;
const newAlert = (
  severity: Alert["severity"],
  title: string,
  detail: string
): Alert => ({
  id: `a-${Date.now()}-${alertCounter++}`,
  severity,
  title,
  detail,
  timestamp: Date.now(),
});

export function predict(data: BehavioralData): Prediction {
  let risk = 0;
  const alerts: Alert[] = [];

  if (data.failed_logins > 5) {
    risk += 20;
    alerts.push(
      newAlert(
        "high",
        "Multiple failed logins",
        `${data.failed_logins} failed authentication attempts detected`
      )
    );
  }
  if (data.unusual_login_time) {
    risk += 15;
    alerts.push(
      newAlert(
        "medium",
        "Unusual login time",
        "Access detected outside normal working hours"
      )
    );
  }
  if (data.file_access_count > 50) {
    risk += 25;
    alerts.push(
      newAlert(
        "high",
        "High data access",
        `${data.file_access_count} sensitive files accessed in window`
      )
    );
  }
  if (data.privilege_escalation) {
    risk += 30;
    alerts.push(
      newAlert(
        "critical",
        "Privilege escalation attempt",
        "Process attempted to elevate to admin/root context"
      )
    );
  }
  if (data.network_anomaly > 60) {
    risk += 10;
    alerts.push(
      newAlert(
        "medium",
        "Anomalous network egress",
        `Outbound traffic spike: ${data.network_anomaly.toFixed(0)}% above baseline`
      )
    );
  }

  risk = Math.min(100, risk);

  // Map score to kill chain stage
  const stage_index = Math.min(
    KILL_CHAIN.length - 1,
    Math.floor((risk / 100) * KILL_CHAIN.length)
  );
  const predicted_stage = KILL_CHAIN[stage_index];

  return { risk_score: risk, predicted_stage, stage_index, alerts };
}

// Simulator: generates realistic baseline noise; ramps up under attack mode.
export function generateBehavior(attackIntensity: number): BehavioralData {
  // attackIntensity: 0 (idle) -> 1 (full attack)
  const i = Math.max(0, Math.min(1, attackIntensity));
  const rand = (min: number, max: number) =>
    min + Math.random() * (max - min);

  return {
    failed_logins: Math.floor(rand(0, 3) + i * rand(4, 10)),
    unusual_login_time: Math.random() < 0.05 + i * 0.7,
    file_access_count: Math.floor(rand(5, 25) + i * rand(40, 90)),
    privilege_escalation: Math.random() < i * 0.6,
    network_anomaly: rand(5, 30) + i * rand(40, 70),
  };
}
