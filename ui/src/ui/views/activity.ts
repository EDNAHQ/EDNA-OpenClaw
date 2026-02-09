import { html, nothing } from "lit";
import type { ActivityEntry, ActivityFilter } from "../types/activity.ts";
import { icons } from "../icons.ts";

export type ActivityProps = {
  loading: boolean;
  error: string | null;
  entries: ActivityEntry[];
  filter: ActivityFilter;
  autoRefresh: boolean;
  onFilterChange: (filter: ActivityFilter) => void;
  onAutoRefreshToggle: () => void;
  onRefresh: () => void;
};

const FILTER_OPTIONS: { value: ActivityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "task", label: "Tasks" },
  { value: "memory", label: "Memory" },
  { value: "session", label: "Sessions" },
  { value: "config", label: "Config" },
  { value: "channel", label: "Channels" },
  { value: "cron", label: "Cron" },
  { value: "system", label: "System" },
];

function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function renderActivity(props: ActivityProps) {
  const filtered =
    props.filter === "all"
      ? props.entries
      : props.entries.filter((e) => e.type === props.filter);

  return html`
    <div class="activity-toolbar">
      <div class="filter-group">
        ${FILTER_OPTIONS.map(
          (opt) => html`
            <button
              class="filter-btn ${props.filter === opt.value ? "active" : ""}"
              @click=${() => props.onFilterChange(opt.value)}
            >
              ${opt.label}
            </button>
          `,
        )}
      </div>
      <button
        class="live-indicator ${props.autoRefresh ? "active" : ""}"
        @click=${props.onAutoRefreshToggle}
        title="${props.autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}"
      >
        <span class="live-dot"></span>
        LIVE
      </button>
      <button class="action-btn" @click=${props.onRefresh} ?disabled=${props.loading}>
        ${props.loading ? "Loading..." : "Refresh"}
      </button>
    </div>

    ${props.error
      ? html`<div class="callout info" style="margin-bottom: 16px;">${props.error}</div>`
      : nothing}

    ${filtered.length === 0 && !props.loading
      ? html`
          <div class="empty-state">
            <div class="empty-icon">${icons.clock}</div>
            <div class="empty-title">No Activity Yet</div>
            <div class="empty-desc">Activity will appear here as events occur.</div>
          </div>
        `
      : nothing}

    <div class="timeline">
      ${filtered.map(
        (entry, idx) => html`
          <div
            class="timeline-item type-${entry.type}"
            style="animation-delay: ${idx * 0.05}s"
          >
            <div class="timeline-date">${formatTimeAgo(entry.timestamp)}</div>
            <div class="timeline-content" @click=${(e: Event) => {
              const el = e.currentTarget as HTMLElement;
              el.classList.toggle("expanded");
            }}>
              <span class="timeline-tag ${entry.type}">${entry.type}</span>
              <div class="preview">${entry.message}</div>
              ${entry.detail
                ? html`<div class="timeline-detail" style="margin-top: 8px; font-size: 0.78rem; color: var(--muted); display: none;">${entry.detail}</div>`
                : nothing}
            </div>
          </div>
        `,
      )}
    </div>
  `;
}
