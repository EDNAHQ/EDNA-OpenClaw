import { html, nothing } from "lit";
import type { Task, TaskStatus } from "../types/tasks.ts";
import { icons } from "../icons.ts";

export type TasksKanbanProps = {
  tasks: Task[];
  onTaskClick: (id: string) => void;
  onTaskStatusChange: (id: string, status: TaskStatus) => void;
};

const COLUMNS: { status: TaskStatus; label: string; colorVar: string; emoji: string }[] = [
  { status: "new", label: "New", colorVar: "var(--yellow, #f2b347)", emoji: "\u2728" },
  { status: "in-progress", label: "In Progress", colorVar: "var(--blue, #f2b347)", emoji: "\u26A1" },
  { status: "done", label: "Done", colorVar: "var(--green, #2dd4a0)", emoji: "\u2705" },
  { status: "failed", label: "Failed", colorVar: "var(--red, #f85149)", emoji: "\u274C" },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function renderTasksKanban(props: TasksKanbanProps) {
  return html`
    <div class="kanban-board">
      ${COLUMNS.map((col) => {
        const tasks = props.tasks.filter((t) => t.status === col.status);
        return html`
          <div
            class="kanban-column"
            @dragover=${(e: DragEvent) => {
              e.preventDefault();
              if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
              (e.currentTarget as HTMLElement).classList.add("drag-over");
            }}
            @dragleave=${(e: DragEvent) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const x = e.clientX;
              const y = e.clientY;
              if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                (e.currentTarget as HTMLElement).classList.remove("drag-over");
              }
            }}
            @drop=${(e: DragEvent) => {
              e.preventDefault();
              (e.currentTarget as HTMLElement).classList.remove("drag-over");
              const taskId = e.dataTransfer?.getData("text/plain");
              if (taskId) {
                props.onTaskStatusChange(taskId, col.status);
              }
            }}
          >
            <div class="kanban-col-header">
              <div class="kanban-col-title">
                <span class="col-dot ${col.status}" style="background: ${col.colorVar}; box-shadow: 0 0 8px ${col.colorVar}40;"></span>
                ${col.label}
              </div>
              <span class="kanban-col-count">${tasks.length}</span>
            </div>
            <div class="kanban-col-body">
              ${tasks.length === 0
                ? html`<div class="kanban-drop-zone">
                    <span class="kanban-drop-icon">${col.emoji}</span>
                    <span class="kanban-drop-text">Drop tasks here</span>
                  </div>`
                : nothing}
              ${tasks.map(
                (task, idx) => html`
                  <div
                    class="kanban-card status-${task.status} priority-${task.priority}"
                    draggable="true"
                    style="animation-delay: ${idx * 0.04}s"
                    @dragstart=${(e: DragEvent) => {
                      e.dataTransfer?.setData("text/plain", task.id);
                      if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
                      requestAnimationFrame(() => {
                        (e.target as HTMLElement).classList.add("dragging");
                      });
                    }}
                    @dragend=${(e: DragEvent) => {
                      (e.currentTarget as HTMLElement).classList.remove("dragging");
                    }}
                    @click=${() => props.onTaskClick(task.id)}
                  >
                    <div class="kanban-card-title">${task.title}</div>
                    ${task.description
                      ? html`<div class="kanban-card-desc">${task.description}</div>`
                      : nothing}
                    <div class="kanban-card-footer">
                      <span class="kanban-card-priority-badge ${task.priority}">${task.priority}</span>
                      <span class="kanban-card-time">${timeAgo(task.updatedAt)}</span>
                      ${task.notes.length > 0
                        ? html`<span class="kanban-card-notes" title="${task.notes.length} notes">${icons.fileText} ${task.notes.length}</span>`
                        : nothing}
                      ${task.assignee
                        ? html`<span class="kanban-card-assignee" title="${task.assignee}">${task.assignee.slice(0, 2).toUpperCase()}</span>`
                        : nothing}
                    </div>
                  </div>
                `,
              )}
            </div>
          </div>
        `;
      })}
    </div>
  `;
}
