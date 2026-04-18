"use client";

import type { Task } from "@/generated/api/models/Task";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  TODO: { label: "未着手", color: "bg-gray-100 text-gray-800" },
  IN_PROGRESS: { label: "進行中", color: "bg-blue-100 text-blue-800" },
  IN_REVIEW: { label: "レビュー中", color: "bg-yellow-100 text-yellow-800" },
  DONE: { label: "完了", color: "bg-green-100 text-green-800" },
};

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  LOW: { label: "低", color: "bg-slate-100 text-slate-600" },
  MEDIUM: { label: "中", color: "bg-blue-100 text-blue-600" },
  HIGH: { label: "高", color: "bg-orange-100 text-orange-600" },
  CRITICAL: { label: "緊急", color: "bg-red-100 text-red-600" },
};

type Props = {
  tasks: Task[];
  onDelete: (id: number) => void;
  onStatusChange: (
    id: number,
    status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
  ) => void;
};

export function TaskList({ tasks, onDelete, onStatusChange }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        タスクがありません。新しいタスクを作成してください。
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const statusInfo = STATUS_LABELS[task.status] || STATUS_LABELS.TODO;
        const priorityInfo =
          PRIORITY_LABELS[task.priority] || PRIORITY_LABELS.MEDIUM;

        return (
          <div
            key={task.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityInfo.color}`}
                  >
                    {priorityInfo.label}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  {task.createdAt && (
                    <span>作成: {new Date(task.createdAt).toLocaleString("ja-JP")}</span>
                  )}
                  {task.assigneeId && (
                    <span>担当ID: {task.assigneeId}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <select
                  value={task.status}
                  onChange={(e) =>
                    task.id !== undefined &&
                    onStatusChange(
                      task.id,
                      e.target.value as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
                    )
                  }
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="TODO">未着手</option>
                  <option value="IN_PROGRESS">進行中</option>
                  <option value="IN_REVIEW">レビュー中</option>
                  <option value="DONE">完了</option>
                </select>
                <button
                  onClick={() => task.id !== undefined && onDelete(task.id)}
                  className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
