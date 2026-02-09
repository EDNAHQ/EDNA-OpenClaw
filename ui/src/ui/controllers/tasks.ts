import type { GatewayBrowserClient } from "../gateway.ts";
import type { Task, CreateTaskData } from "../types/tasks.ts";

export type TasksState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  tasksLoading: boolean;
  tasksError: string | null;
  tasksList: Task[];
  taskDetailId: string | null;
  taskDetail: Task | null;
  taskDetailLoading: boolean;
  taskCreateModalOpen: boolean;
  taskCreating: boolean;
  toasts: Array<{ id: string; message: string; type: "success" | "error" | "info" }>;
};

function addToast(state: TasksState, message: string, type: "success" | "error" | "info") {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  state.toasts = [...state.toasts, { id, message, type }];
  setTimeout(() => {
    state.toasts = state.toasts.filter((t) => t.id !== id);
  }, 3500);
}

export async function loadTasks(state: TasksState) {
  if (!state.client || !state.connected) return;
  if (state.tasksLoading) return;
  state.tasksLoading = true;
  state.tasksError = null;
  try {
    const res = await state.client.request<{ tasks: Task[] } | null>("tasks.list", {});
    state.tasksList = res?.tasks ?? [];
  } catch (err) {
    const msg = String(err);
    if (msg.includes("not found") || msg.includes("unknown method")) {
      state.tasksError = "Tasks API not available on this gateway. Upgrade to enable task management.";
      state.tasksList = [];
    } else {
      state.tasksError = msg;
    }
  } finally {
    state.tasksLoading = false;
  }
}

export async function createTask(state: TasksState, data: CreateTaskData) {
  if (!state.client || !state.connected) return;
  state.taskCreating = true;
  try {
    const res = await state.client.request<{ task: Task } | null>("tasks.create", data);
    if (res?.task) {
      state.tasksList = [res.task, ...state.tasksList];
      state.taskCreateModalOpen = false;
      addToast(state, `Task "${res.task.title}" created`, "success");
    }
  } catch (err) {
    addToast(state, `Failed to create task: ${err}`, "error");
  } finally {
    state.taskCreating = false;
  }
}

export async function updateTask(
  state: TasksState,
  taskId: string,
  patch: Partial<Task>,
) {
  if (!state.client || !state.connected) return;
  try {
    const res = await state.client.request<{ task: Task } | null>("tasks.update", {
      id: taskId,
      ...patch,
    });
    if (res?.task) {
      state.tasksList = state.tasksList.map((t) => (t.id === taskId ? res!.task : t));
      if (state.taskDetail?.id === taskId) {
        state.taskDetail = res.task;
      }
      addToast(state, "Task updated", "success");
    }
  } catch (err) {
    addToast(state, `Failed to update task: ${err}`, "error");
  }
}

export async function deleteTask(state: TasksState, taskId: string) {
  if (!state.client || !state.connected) return;
  try {
    await state.client.request("tasks.delete", { id: taskId });
    state.tasksList = state.tasksList.filter((t) => t.id !== taskId);
    if (state.taskDetailId === taskId) {
      state.taskDetailId = null;
      state.taskDetail = null;
    }
    addToast(state, "Task deleted", "info");
  } catch (err) {
    addToast(state, `Failed to delete task: ${err}`, "error");
  }
}

export async function addTaskNote(state: TasksState, taskId: string, text: string) {
  if (!state.client || !state.connected) return;
  try {
    const res = await state.client.request<{ task: Task } | null>("tasks.addNote", {
      id: taskId,
      text,
    });
    if (res?.task) {
      state.tasksList = state.tasksList.map((t) => (t.id === taskId ? res!.task : t));
      if (state.taskDetail?.id === taskId) {
        state.taskDetail = res.task;
      }
    }
  } catch (err) {
    addToast(state, `Failed to add note: ${err}`, "error");
  }
}

export async function spawnTask(state: TasksState, taskId: string) {
  if (!state.client || !state.connected) return;
  try {
    await state.client.request("tasks.spawn", { id: taskId });
    addToast(state, "Task spawned to agent", "success");
  } catch (err) {
    addToast(state, `Failed to spawn task: ${err}`, "error");
  }
}
