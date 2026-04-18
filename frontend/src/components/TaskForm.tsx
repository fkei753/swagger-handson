"use client";

import { useState } from "react";
import type { Task } from "@/generated/api/models/Task";
import type { User } from "@/generated/api/models/User";

type Props = {
  onSubmit: (task: Task) => void;
  users: User[];
};

export function TaskForm({ onSubmit, users }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("TODO" as Task["status"]);
  const [priority, setPriority] = useState<Task["priority"]>("MEDIUM" as Task["priority"]);
  const [assigneeId, setAssigneeId] = useState<number | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description: description || undefined,
      status,
      priority,
      assigneeId,
    });

    setTitle("");
    setDescription("");
    setStatus("TODO" as Task["status"]);
    setPriority("MEDIUM" as Task["priority"]);
    setAssigneeId(undefined);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">新規タスク作成</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タイトル *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="タスクのタイトルを入力"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            説明
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="タスクの説明を入力"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ステータス *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task["status"])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="TODO">未着手</option>
            <option value="IN_PROGRESS">進行中</option>
            <option value="IN_REVIEW">レビュー中</option>
            <option value="DONE">完了</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            優先度 *
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="LOW">低</option>
            <option value="MEDIUM">中</option>
            <option value="HIGH">高</option>
            <option value="CRITICAL">緊急</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            担当者
          </label>
          <select
            value={assigneeId ?? ""}
            onChange={(e) =>
              setAssigneeId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">未割当</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          作成
        </button>
      </div>
    </form>
  );
}
