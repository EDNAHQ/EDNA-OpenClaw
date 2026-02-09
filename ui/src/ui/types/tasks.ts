export type TaskStatus = "new" | "in-progress" | "done" | "failed";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskNote {
  id: string;
  text: string;
  createdAt: string;
  kind?: "user" | "output" | "status";
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  content?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  agentId?: string;
  sessionKey?: string;
  createdAt: string;
  updatedAt: string;
  notes: TaskNote[];
  attachments: TaskAttachment[];
  output?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  content?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  agentId?: string;
}
