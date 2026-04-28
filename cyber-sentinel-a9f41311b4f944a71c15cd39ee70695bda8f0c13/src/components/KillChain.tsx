import {
  Search,
  Wrench,
  Send,
  Bug,
  Download,
  Radio,
  Target,
} from "lucide-react";
import { KILL_CHAIN, KillChainStage } from "@/lib/predict";

const ICONS = [Search, Wrench, Send, Bug, Download, Radio, Target];

interface KillChainProps {
  currentStageIndex: number;
}

const KillChain = ({ currentStageIndex }: KillChainProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-2">
        {KILL_CHAIN.map((stage: KillChainStage, idx) => {
          const Icon = ICONS[idx];
          const isActive = idx === currentStageIndex;
          const isPassed = idx < currentStageIndex;
          const isFuture = idx > currentStageIndex;

          return (
            <div key={stage} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center text-center min-w-0 flex-1">
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-500
                    ${
                      isActive
                        ? "border-destructive bg-destructive/15 glow-red animate-pulse-glow"
                        : isPassed
                        ? "border-secondary bg-secondary/10"
                        : "border-border bg-muted/20"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                      isActive
                        ? "text-destructive"
                        : isPassed
                        ? "text-secondary"
                        : "text-muted-foreground"
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive animate-ping" />
                  )}
                </div>
                <span
                  className={`mt-2 text-[10px] sm:text-xs font-medium leading-tight transition-colors ${
                    isActive
                      ? "text-destructive"
                      : isPassed
                      ? "text-secondary"
                      : "text-muted-foreground"
                  }`}
                >
                  {stage}
                </span>
                <span className="text-[9px] text-muted-foreground/60 mt-0.5">
                  STAGE {idx + 1}
                </span>
              </div>
              {idx < KILL_CHAIN.length - 1 && (
                <div className="flex-shrink-0 w-4 sm:w-8 h-0.5 mx-1 relative overflow-hidden rounded-full bg-muted">
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-700 ${
                      isFuture
                        ? "w-0"
                        : "w-full bg-gradient-to-r from-secondary to-destructive"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KillChain;
