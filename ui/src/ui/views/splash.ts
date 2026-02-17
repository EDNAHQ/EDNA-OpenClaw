import { html } from "lit";
import type { Tab } from "../navigation.ts";

export interface SplashProps {
  onNavigate: (tab: Tab) => void;
  onSkip: () => void;
  basePath?: string;
}

const HUB_CARDS: Array<{ label: string; desc: string; tab: Tab }> = [
  { label: "Chat", desc: "AI Assistant", tab: "chat" },
  { label: "Pipeline", desc: "Deals & Leads", tab: "tasks" },
  { label: "Email", desc: "Inbox & Comms", tab: "activity" },
  { label: "Content", desc: "Create & Publish", tab: "documents" },
  { label: "Settings", desc: "Configure", tab: "config" },
];

export function renderSplash(props: SplashProps) {
  const { onNavigate, onSkip, basePath } = props;
  const logoSrc = basePath ? `${basePath}/favicon.svg` : "/favicon.svg";

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      onSkip();
    }
  };

  return html`
    <div class="splash" @keydown=${handleKeydown} tabindex="0">
      <!-- Animated background nodes -->
      <div class="splash-bg">
        <div class="splash-bg__node splash-bg__node--1"></div>
        <div class="splash-bg__node splash-bg__node--2"></div>
        <div class="splash-bg__node splash-bg__node--3"></div>
        <div class="splash-bg__line splash-bg__line--1"></div>
        <div class="splash-bg__line splash-bg__line--2"></div>
      </div>

      <div class="splash-content">
        <!-- Logo + Title -->
        <div class="splash-hero">
          <div class="splash-logo">
            <img src=${logoSrc} alt="" class="splash-logo__img" />
            <div class="splash-logo__glow"></div>
          </div>
          <div class="splash-brand">
            <h1 class="splash-brand__title">EDNA <span>OPENCLAW</span></h1>
            <p class="splash-brand__tagline">AI Command Center</p>
          </div>
        </div>

        <!-- Gradient divider -->
        <div class="splash-divider"></div>

        <!-- Hub cards -->
        <div class="splash-cards">
          ${HUB_CARDS.map(
            (card) => html`
              <button
                class="splash-card"
                @click=${() => onNavigate(card.tab)}
                aria-label=${`Go to ${card.label}`}
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onNavigate(card.tab);
                  }
                }}
              >
                <span class="splash-card__label">${card.label}</span>
                <span class="splash-card__desc">${card.desc}</span>
              </button>
            `,
          )}
        </div>

        <!-- Skip -->
        <button class="splash-enter" @click=${onSkip}>
          Enter Command Center
          <span class="splash-enter__hint">↵</span>
        </button>
      </div>
    </div>
  `;
}
