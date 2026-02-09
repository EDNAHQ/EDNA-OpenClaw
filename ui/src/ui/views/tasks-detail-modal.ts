import { html, nothing } from "lit";
import type { Task, TaskStatus } from "../types/tasks.ts";
import { icons } from "../icons.ts";

export type TaskDetailModalProps = {
  task: Task | null;
  loading: boolean;
  onClose: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onSpawn: () => void;
  onDelete: () => void;
  onAddNote: (text: string) => void;
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function renderTaskDetailModal(props: TaskDetailModalProps) {
  if (!props.task) return nothing;
  const task = props.task;

  return html`
    <div class="modal-overlay detail-modal show" @click=${(e: Event) => {
      if ((e.target as HTMLElement).classList.contains("modal-overlay")) props.onClose();
    }}>
      <div class="modal" style="max-width: 720px; padding: 0; overflow: hidden;">
        <button class="modal-close" @click=${props.onClose}>&times;</button>

        <div class="detail-header">
          <div class="detail-status-row">
            <span class="status-badge status-${task.status}">${task.status}</span>
            <span class="kanban-card-priority ${task.priority}">${task.priority}</span>
            ${task.assignee
              ? html`<span class="task-card-assignee">${task.assignee}</span>`
              : nothing}
          </div>
          <div class="detail-title">${task.title}</div>
          <div class="detail-meta">
            <span>Created ${formatDateTime(task.createdAt)}</span>
            <span>Updated ${formatDateTime(task.updatedAt)}</span>
            ${task.agentId ? html`<span>Agent: ${task.agentId}</span>` : nothing}
            ${task.sessionKey ? html`<span>Session: ${task.sessionKey}</span>` : nothing}
          </div>
        </div>

        <div class="detail-body">
          ${task.description
            ? html`
                <div class="detail-section">
                  <div class="detail-section-title">Description</div>
                  <div class="detail-section-content">
                    <div class="detail-description">${task.description}</div>
                  </div>
                </div>
              `
            : nothing}

          ${task.content
            ? html`
                <div class="detail-section">
                  <div class="detail-section-title">Content</div>
                  <div class="detail-section-content">
                    <pre style="background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px; font-size: 0.82rem; overflow-x: auto; white-space: pre-wrap; color: var(--text); font-family: var(--mono);">${task.content}</pre>
                  </div>
                </div>
              `
            : nothing}

          ${task.output
            ? html`
                <div class="detail-section">
                  <div class="detail-section-title">Output</div>
                  <div class="detail-section-content">
                    <pre style="background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px; font-size: 0.82rem; overflow-x: auto; white-space: pre-wrap; color: var(--green, #2dd4a0); font-family: var(--mono);">${task.output}</pre>
                  </div>
                </div>
              `
            : nothing}

          ${task.notes.length > 0
            ? html`
                <div class="detail-section">
                  <div class="detail-section-title">Notes (${task.notes.length})</div>
                  <div class="detail-section-content">
                    ${task.notes.map(
                      (note) => html`
                        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; font-size: 0.82rem; color: var(--muted);">
                          <div style="font-size: 0.7rem; color: var(--muted); margin-bottom: 4px;">${formatDateTime(note.createdAt)}</div>
                          ${note.text}
                        </div>
                      `,
                    )}
                  </div>
                </div>
              `
            : nothing}

          ${task.attachments.length > 0
            ? html`
                <div class="detail-section">
                  <div class="detail-section-title">Attachments (${task.attachments.length})</div>
                  <div class="detail-section-content">
                    ${task.attachments.map(
                      (att) => html`
                        <div style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 6px; font-size: 0.82rem;">
                          ${icons.fileText}
                          <span style="flex: 1;">${att.name}</span>
                          <span class="muted">${(att.size / 1024).toFixed(1)}KB</span>
                        </div>
                      `,
                    )}
                  </div>
                </div>
              `
            : nothing}

          <div class="detail-section">
            <div class="detail-section-title">Add Note</div>
            <div class="detail-section-content">
              <div style="display: flex; gap: 8px;">
                <input
                  type="text"
                  class="form-input"
                  placeholder="Type a note..."
                  id="task-note-input"
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Enter") {
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        props.onAddNote(input.value.trim());
                        input.value = "";
                      }
                    }
                  }}
                />
                <button
                  class="action-btn primary"
                  @click=${() => {
                    const input = document.getElementById("task-note-input") as HTMLInputElement | null;
                    if (input?.value.trim()) {
                      props.onAddNote(input.value.trim());
                      input.value = "";
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-actions">
          <select
            class="form-select"
            style="width: auto; min-width: 140px;"
            .value=${task.status}
            @change=${(e: Event) =>
              props.onStatusChange((e.target as HTMLSelectElement).value as TaskStatus)}
          >
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
            <option value="failed">Failed</option>
          </select>
          <button class="action-btn" @click=${props.onSpawn}>
            ${icons.play} Spawn
          </button>
          <div style="flex: 1;"></div>
          <button class="action-btn danger" @click=${props.onDelete}>
            ${icons.trash} Delete
          </button>
        </div>
      </div>
    </div>
  `;
}
