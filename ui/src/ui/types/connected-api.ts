export type ApiStatus = "connected" | "disconnected" | "partial";

export type ApiCapabilityKind = "messaging" | "data" | "ai" | "search" | "media" | "automation";

export interface ApiCapability {
  label: string;
  kind: ApiCapabilityKind;
}

export interface ConnectedApi {
  id: string;
  name: string;
  provider?: string;
  description?: string;
  status: ApiStatus;
  iconClass?: string;
  iconEmoji?: string;
  capabilities: ApiCapability[];
  lastSeen?: string;
}
