import { html, nothing } from "lit";
import type { AgentsListResult, CronStatus, SessionsListResult } from "../types.ts";

export type AgentMonitorProps = {
  connected: boolean;
  agentsList: AgentsListResult | null;
  sessionsResult: SessionsListResult | null;
  cronStatus: CronStatus | null;
};

export function renderAgentMonitor(props: AgentMonitorProps) {
  const agents = props.agentsList?.agents ?? [];
  const mainAgent = agents.find((a) => a.id === (props.agentsList?.defaultId ?? "main")) ?? agents[0];
  const subAgentCount = Math.max(0, agents.length - 1);
  const sessionsCount = props.sessionsResult?.count ?? 0;
  const cronEnabled = props.cronStatus?.enabled ?? false;
  const cronJobs = props.cronStatus?.jobs ?? [];
  const activeHooks = agents.reduce(
    (acc, a) => acc + ((a as Record<string, unknown>).hookCount as number ?? 0),
    0,
  );

  return html`
    <div class="agent-monitor">
      <div class="agent-stat stat-main">
        <div class="agent-stat-header">
          <span class="agent-stat-icon">\u{1F916}</span>
          <span class="agent-stat-badge ${props.connected ? "active" : "idle"}">
            ${props.connected ? html`<span class="pulse-dot"></span> Online` : "Offline"}
          </span>
        </div>
        <div class="agent-stat-value val-active">${mainAgent?.id ?? "---"}</div>
        <div class="agent-stat-label">Main Agent</div>
      </div>

      <div class="agent-stat stat-subagent">
        <div class="agent-stat-header">
          <span class="agent-stat-icon">\u{1F465}</span>
        </div>
        <div class="agent-stat-value val-accent">${subAgentCount}</div>
        <div class="agent-stat-label">Sub-Agents</div>
        <div class="agent-stat-detail">${agents.length} total registered</div>
      </div>

      <div class="agent-stat stat-hook">
        <div class="agent-stat-header">
          <span class="agent-stat-icon">\u{26A1}</span>
        </div>
        <div class="agent-stat-value val-blue">${activeHooks}</div>
        <div class="agent-stat-label">Active Hooks</div>
        <div class="agent-stat-detail">event listeners</div>
      </div>

      <div class="agent-stat stat-cron">
        <div class="agent-stat-header">
          <span class="agent-stat-icon">\u{23F0}</span>
          <span class="agent-stat-badge ${cronEnabled ? "active" : "idle"}">
            ${cronEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <div class="agent-stat-value val-yellow">${cronJobs.length}</div>
        <div class="agent-stat-label">Cron Jobs</div>
      </div>

      <div class="agent-stat stat-total">
        <div class="agent-stat-header">
          <span class="agent-stat-icon">\u{1F4AC}</span>
        </div>
        <div class="agent-stat-value val-purple">${sessionsCount}</div>
        <div class="agent-stat-label">Sessions</div>
        <div class="agent-stat-detail">active</div>
      </div>
    </div>
  `;
}
