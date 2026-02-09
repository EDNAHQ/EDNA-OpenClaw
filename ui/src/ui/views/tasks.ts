import { html, nothing } from "lit";
import type { Task, TaskStatus } from "../types/tasks.ts";
import { icons } from "../icons.ts";
import { renderTasksKanban, type TasksKanbanProps } from "./tasks-kanban.ts";

export type TasksProps = {
  loading: boolean;
  error: string | null;
  tasks: Task[];
  viewMode: "list" | "kanban";
  statusFilter: string;
  searchQuery: string;
  batchSelection: string[];
  onViewModeChange: (mode: "list" | "kanban") => void;
  onStatusFilterChange: (status: string) => void;
  onSearchChange: (query: string) => void;
  onBatchToggle: (id: string) => void;
  onBatchClear: () => void;
  onCreateOpen: () => void;
  onTaskClick: (id: string) => void;
  onTaskStatusChange: (id: string, status: TaskStatus) => void;
  onTaskDelete: (id: string) => void;
  onRefresh: () => void;
};

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "failed", label: "Failed" },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function renderTasks(props: TasksProps) {
  const query = props.searchQuery.toLowerCase().trim();
  let filtered = props.tasks;
  if (props.statusFilter !== "all") {
    filtered = filtered.filter((t) => t.status === props.statusFilter);
  }
  if (query) {
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.description ?? "").toLowerCase().includes(query),
    );
  }

  return html`
    <div class="tasks-toolbar">
      <div class="tasks-toolbar-left">
        <div class="filter-group">
          ${STATUS_FILTERS.map(
            (f) => html`
              <button
                class="filter-btn ${props.statusFilter === f.value ? "active" : ""}"
                @click=${() => props.onStatusFilterChange(f.value)}
              >
                ${f.label}
                ${f.value !== "all"
                  ? html`<span class="filter-count">${props.tasks.filter((t) => t.status === f.value).length}</span>`
                  : nothing}
              </button>
            `,
          )}
        </div>
        <input
          type="text"
          class="task-search-input"
          placeholder="Search tasks..."
          .value=${props.searchQuery}
          @input=${(e: InputEvent) => props.onSearchChange((e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="tasks-toolbar-right">
        <div class="view-toggle">
          <button
            class="view-toggle-btn ${props.viewMode === "list" ? "active" : ""}"
            @click=${() => props.onViewModeChange("list")}
            title="List view"
          >
            ${icons.list}
          </button>
          <button
            class="view-toggle-btn ${props.viewMode === "kanban" ? "active" : ""}"
            @click=${() => props.onViewModeChange("kanban")}
            title="Kanban view"
          >
            ${icons.columns}
          </button>
        </div>
        <button class="task-create-btn" @click=${props.onCreateOpen}>
          ${icons.plus} New Task
        </button>
      </div>
    </div>

    ${props.error
      ? html`<div class="callout info" style="margin-bottom: 16px;">${props.error}</div>`
      : nothing}

    ${props.batchSelection.length > 0
      ? html`
          <div class="batch-bar">
            <span>${props.batchSelection.length} selected</span>
            <button class="action-btn" @click=${props.onBatchClear}>Clear</button>
          </div>
        `
      : nothing}

    ${props.viewMode === "kanban"
      ? renderTasksKanban({
          tasks: filtered,
          onTaskClick: props.onTaskClick,
          onTaskStatusChange: props.onTaskStatusChange,
        } as TasksKanbanProps)
      : html`
          ${filtered.length === 0 && !props.loading
            ? html`
                <div class="empty-state">
                  <div class="empty-icon">${icons.checkSquare}</div>
                  <div class="empty-title">No Tasks</div>
                  <div class="empty-desc">
                    ${props.tasks.length === 0
                      ? "Create your first task to get started."
                      : "No tasks match your current filters."}
                  </div>
                  ${props.tasks.length === 0
                    ? html`<button class="task-create-btn" style="margin: 12px auto 0;" @click=${props.onCreateOpen}>
                        ${icons.plus} Create Task
                      </button>`
                    : nothing}
                </div>
              `
            : nothing}

          <div class="task-list">
            ${filtered.map(
              (task) => html`
                <div
                  class="task-card priority-${task.priority}"
                  @click=${() => props.onTaskClick(task.id)}
                >
                  <div class="task-card-left">
                    <input
                      type="checkbox"
                      class="task-checkbox"
                      .checked=${props.batchSelection.includes(task.id)}
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        props.onBatchToggle(task.id);
                      }}
                    />
                    <div class="task-card-content">
                      <div class="task-card-title">${task.title}</div>
                      ${task.description
                        ? html`<div class="task-card-desc">${task.description}</div>`
                        : nothing}
                    </div>
                  </div>
                  <div class="task-card-right">
                    <span class="status-badge status-${task.status}">${task.status}</span>
                    <span class="task-card-date">${formatDate(task.updatedAt)}</span>
                    ${task.assignee
                      ? html`<span class="task-card-assignee">${task.assignee}</span>`
                      : nothing}
                  </div>
                </div>
              `,
            )}
          </div>
        `}

    ${props.loading
      ? html`<div class="muted" style="text-align:center;padding:20px;font-size:0.82rem;">Loading tasks...</div>`
      : nothing}
  `;
}
