import { html, nothing } from "lit";
import type { CreateTaskData, TaskPriority, TaskStatus } from "../types/tasks.ts";
import { icons } from "../icons.ts";

export type TaskCreateModalProps = {
  open: boolean;
  creating: boolean;
  onClose: () => void;
  onCreate: (data: CreateTaskData) => void;
};

export function renderTaskCreateModal(props: TaskCreateModalProps) {
  if (!props.open) return nothing;

  return html`
    <div class="modal-overlay show" @click=${(e: Event) => {
      if ((e.target as HTMLElement).classList.contains("modal-overlay")) props.onClose();
    }}>
      <div class="modal">
        <button class="modal-close" @click=${props.onClose}>&times;</button>
        <h2>Create Task</h2>

        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-input" id="create-task-title" placeholder="Task title..." />
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" id="create-task-desc" placeholder="Optional description..." rows="3"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Content / Instructions</label>
          <textarea class="form-textarea" id="create-task-content" placeholder="Detailed instructions for the agent..." rows="4" style="font-family: var(--mono);"></textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Priority</label>
            <select class="form-select" id="create-task-priority">
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-select" id="create-task-status">
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Assignee (optional)</label>
          <input type="text" class="form-input" id="create-task-assignee" placeholder="Agent or user..." />
        </div>

        <div class="modal-actions">
          <button class="action-btn" @click=${props.onClose}>Cancel</button>
          <button
            class="action-btn primary"
            ?disabled=${props.creating}
            @click=${() => {
              const title = (document.getElementById("create-task-title") as HTMLInputElement)?.value?.trim();
              if (!title) return;
              const data: CreateTaskData = {
                title,
                description: (document.getElementById("create-task-desc") as HTMLTextAreaElement)?.value?.trim() || undefined,
                content: (document.getElementById("create-task-content") as HTMLTextAreaElement)?.value?.trim() || undefined,
                priority: ((document.getElementById("create-task-priority") as HTMLSelectElement)?.value ?? "medium") as TaskPriority,
                status: ((document.getElementById("create-task-status") as HTMLSelectElement)?.value ?? "new") as TaskStatus,
                assignee: (document.getElementById("create-task-assignee") as HTMLInputElement)?.value?.trim() || undefined,
              };
              props.onCreate(data);
            }}
          >
            ${props.creating ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  `;
}
