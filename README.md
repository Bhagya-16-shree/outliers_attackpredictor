# 🛡️ APT-Predict

**Behavioral anomaly detection & cyber kill chain prediction — a SOC dashboard that predicts attacks before they happen.**

APT-Predict is a dark-themed Security Operations Center (SOC) dashboard that simulates live behavioral telemetry (logins, file access, privilege escalations, network egress), scores it with a rule-based risk engine, and maps the predicted attacker stage onto the **Lockheed Martin Cyber Kill Chain**.

Built for hackathon demos: instant boot, no backend, no API keys, no database — just `npm run dev` and you're showing judges a live, animated threat console.

---

## ✨ Features

- **Live Threat Index** — animated SVG gauge, color-coded green → yellow → red
- **Cyber Kill Chain visualization** — 7-stage attack progression with neon glow on the active stage
- **Live Activity Timeline** — Recharts area chart streaming logins / file access / network anomalies
- **Anomaly Alerts panel** — severity-coded (Low / Medium / High / Critical) with timestamps
- **Attack Simulator** — one click ramps the system from idle to full APT scenario
- **Glassmorphism + neon dark theme** — built with Tailwind semantic tokens
- **Real prediction logic** — rule-based scoring engine in `src/lib/predict.ts`, not faked animations

---

## 🧠 How the prediction works

The engine in `src/lib/predict.ts` mirrors a `/predict` REST contract. Each polling tick:

1. `generateBehavior(intensity)` produces synthetic telemetry (`failed_logins`, `unusual_login_time`, `file_access_count`, `privilege_escalation`, `network_anomaly`).
2. `predict(behavior)` applies rule-based scoring:

| Signal | Threshold | Weight |
|---|---|---|
| Failed logins | `> 5` | +20 |
| Unusual login time | `true` | +15 |
| File access count | `> 50` | +25 |
| Privilege escalation | `true` | +30 |
| Network anomaly | `> 60` | +10 |

3. Final `risk_score` (0–100) maps to one of the 7 kill-chain stages:

```
Reconnaissance → Weaponization → Delivery → Exploitation
              → Installation → Command & Control → Actions on Objectives
```

---

## 🚀 Run it locally in VS Code

### Prerequisites
- **Node.js 18+** — https://nodejs.org
- **VS Code** — https://code.visualstudio.com

### Steps

```bash
# 1. Clone or unzip the project
git clone <your-repo-url> apt-predict
cd apt-predict

# 2. Open in VS Code
code .

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open **http://localhost:8080** — the dashboard is live.

### Production build (recommended for the demo itself)
```bash
npm run build
npm run preview
```
Serves the optimized build on **http://localhost:4173** — faster, smoother animations, what you should show the judges.

### Recommended VS Code extensions
- ESLint
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

---

## 📁 Project structure

```
apt-predict/
├── src/
│   ├── components/
│   │   ├── ActivityTimeline.tsx   # Recharts live area chart
│   │   ├── AlertsPanel.tsx        # Severity-coded alert feed
│   │   ├── KillChain.tsx          # 7-stage attack progression
│   │   ├── RiskGauge.tsx          # Animated SVG threat gauge
│   │   └── ui/                    # shadcn/ui primitives
│   ├── lib/
│   │   └── predict.ts             # Rule-based scoring engine
│   ├── pages/
│   │   └── Index.tsx              # Main SOC dashboard
│   ├── index.css                  # Design tokens + glow/glass utilities
│   └── main.tsx
├── tailwind.config.ts             # Dark theme + neon palette
├── vite.config.ts                 # Dev server on :8080
└── package.json
```

---

## 🎤 60-second pitch (paste into your submission)

> **APT-Predict** is a behavioral threat-prediction console that catches Advanced Persistent Threats in their earliest reconnaissance phase — before damage is done. Instead of reacting to alerts after a breach, it continuously scores user and network behavior, maps the activity to the Lockheed Martin Cyber Kill Chain, and tells defenders *which stage an attacker is currently in* and *what they'll likely do next*. Built as a real-time SOC dashboard with a rule-based anomaly engine, live telemetry visualization, and a one-click APT simulation mode for demonstration.

---

## 🛠️ Tech stack

React 18 · Vite 5 · TypeScript 5 · Tailwind CSS 3 · shadcn/ui · Recharts · Lucide Icons

---

## 📜 License

MIT — built for hackathon use, free to fork and extend.
