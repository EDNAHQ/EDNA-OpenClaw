import { html, nothing } from "lit";
import type { ConnectedApi } from "../types/connected-api.ts";
import { icons } from "../icons.ts";

export type ConnectedApisProps = {
  loading: boolean;
  error: string | null;
  apis: ConnectedApi[];
  search: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
};

export function renderConnectedApis(props: ConnectedApisProps) {
  const query = props.search.toLowerCase().trim();
  const filtered = query
    ? props.apis.filter(
        (api) =>
          api.name.toLowerCase().includes(query) ||
          (api.provider ?? "").toLowerCase().includes(query),
      )
    : props.apis;

  const connectedCount = props.apis.filter((a) => a.status === "connected").length;
  const totalCount = props.apis.length;

  return html`
    <div class="apis-stats">
      <div class="api-stat-card">
        <div class="api-stat-value">${totalCount}</div>
        <div class="api-stat-label">Total APIs</div>
      </div>
      <div class="api-stat-card">
        <div class="api-stat-value">${connectedCount}</div>
        <div class="api-stat-label">Connected</div>
      </div>
      <div class="api-stat-card">
        <div class="api-stat-value">${totalCount - connectedCount}</div>
        <div class="api-stat-label">Disconnected</div>
      </div>
    </div>

    <div class="toolbar" style="margin-bottom: 16px;">
      <input
        type="text"
        class="task-search-input"
        placeholder="Search APIs..."
        .value=${props.search}
        @input=${(e: InputEvent) => props.onSearchChange((e.target as HTMLInputElement).value)}
      />
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
            <div class="empty-icon">${icons.globe}</div>
            <div class="empty-title">No APIs Found</div>
            <div class="empty-desc">
              ${props.apis.length === 0
                ? "No channels are configured yet. Add channels in the Channels tab."
                : "No APIs match your search."}
            </div>
          </div>
        `
      : nothing}

    <div class="apis-grid">
      ${filtered.map(
        (api) => html`
          <div class="api-card">
            <div class="api-card-header">
              <div class="api-icon">${api.iconEmoji ?? "\uD83D\uDD0C"}</div>
              <div class="api-card-info">
                <div class="api-card-name">
                  ${api.name}
                  <span class="api-status ${api.status}"></span>
                </div>
                <div class="api-card-provider">${api.provider ?? ""}</div>
              </div>
            </div>
            <div class="api-card-desc">${api.description ?? ""}</div>
            <div class="api-capabilities">
              ${api.capabilities.map(
                (cap) => html`
                  <span class="api-cap ${cap.kind}">${cap.label}</span>
                `,
              )}
            </div>
          </div>
        `,
      )}
    </div>
  `;
}
