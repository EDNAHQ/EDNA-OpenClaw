import type { GatewayBrowserClient } from "../gateway.ts";
import type { ChannelsStatusSnapshot, ChannelAccountSnapshot } from "../types.ts";
import type { ConnectedApi, ApiCapability, ApiCapabilityKind } from "../types/connected-api.ts";

export type ConnectedApisState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  connectedApisLoading: boolean;
  connectedApisError: string | null;
  connectedApisList: ConnectedApi[];
  channelsSnapshot: ChannelsStatusSnapshot | null;
};

const CHANNEL_EMOJI: Record<string, string> = {
  whatsapp: "\uD83D\uDCAC",
  telegram: "\u2708\uFE0F",
  discord: "\uD83C\uDFAE",
  slack: "\uD83D\uDCBC",
  signal: "\uD83D\uDD12",
  nostr: "\uD83E\uDD18",
  imessage: "\uD83D\uDCF1",
  googlechat: "\uD83D\uDCE7",
  matrix: "\uD83C\uDF10",
  web: "\uD83C\uDF10",
};

const CHANNEL_CAPS: Record<string, ApiCapability[]> = {
  whatsapp: [
    { label: "Messaging", kind: "messaging" },
    { label: "Media", kind: "media" },
  ],
  telegram: [
    { label: "Messaging", kind: "messaging" },
    { label: "Media", kind: "media" },
    { label: "Commands", kind: "automation" },
  ],
  discord: [
    { label: "Messaging", kind: "messaging" },
    { label: "Media", kind: "media" },
    { label: "Commands", kind: "automation" },
  ],
  slack: [
    { label: "Messaging", kind: "messaging" },
    { label: "Data", kind: "data" },
  ],
  signal: [{ label: "Messaging", kind: "messaging" }],
  nostr: [
    { label: "Messaging", kind: "messaging" },
    { label: "Search", kind: "search" },
  ],
  imessage: [{ label: "Messaging", kind: "messaging" }],
  googlechat: [
    { label: "Messaging", kind: "messaging" },
    { label: "Data", kind: "data" },
  ],
};

function deriveStatus(accounts: ChannelAccountSnapshot[]): "connected" | "disconnected" | "partial" {
  if (accounts.length === 0) return "disconnected";
  const connectedCount = accounts.filter((a) => a.connected || a.running).length;
  if (connectedCount === accounts.length) return "connected";
  if (connectedCount > 0) return "partial";
  return "disconnected";
}

export function transformChannelsToApis(snapshot: ChannelsStatusSnapshot | null): ConnectedApi[] {
  if (!snapshot) return [];
  const apis: ConnectedApi[] = [];
  for (const channelId of snapshot.channelOrder) {
    const label = snapshot.channelLabels[channelId] ?? channelId;
    const accounts = snapshot.channelAccounts[channelId] ?? [];
    const meta = snapshot.channelMeta?.find((m) => m.id === channelId);
    apis.push({
      id: channelId,
      name: label,
      provider: meta?.detailLabel ?? channelId,
      description: `${accounts.length} account${accounts.length !== 1 ? "s" : ""} configured`,
      status: deriveStatus(accounts),
      iconEmoji: CHANNEL_EMOJI[channelId] ?? "\uD83D\uDD0C",
      capabilities: CHANNEL_CAPS[channelId] ?? [{ label: "Messaging", kind: "messaging" as ApiCapabilityKind }],
      lastSeen: accounts
        .map((a) => a.lastInboundAt ?? a.lastOutboundAt ?? 0)
        .reduce((max, v) => Math.max(max, v), 0)
        ? new Date(
            accounts
              .map((a) => a.lastInboundAt ?? a.lastOutboundAt ?? 0)
              .reduce((max, v) => Math.max(max, v), 0),
          ).toISOString()
        : undefined,
    });
  }
  return apis;
}

export async function loadConnectedApis(state: ConnectedApisState) {
  if (!state.client || !state.connected) return;
  if (state.connectedApisLoading) return;
  state.connectedApisLoading = true;
  state.connectedApisError = null;
  try {
    const res = await state.client.request<ChannelsStatusSnapshot | null>("channels.status", {
      probe: false,
      timeoutMs: 8000,
    });
    state.channelsSnapshot = res;
    state.connectedApisList = transformChannelsToApis(res);
  } catch (err) {
    state.connectedApisError = String(err);
  } finally {
    state.connectedApisLoading = false;
  }
}
