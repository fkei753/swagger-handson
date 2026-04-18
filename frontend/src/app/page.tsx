"use client";

import { useEffect, useState } from "react";
import { OpenAPI } from "@/generated/api/core/OpenAPI";
import { TasksService } from "@/generated/api/services/TasksService";
import { UsersService } from "@/generated/api/services/UsersService";
import type { Task } from "@/generated/api/models/Task";
import type { User } from "@/generated/api/models/User";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { UserList } from "@/components/UserList";

// APIのベースURLを設定
OpenAPI.BASE = "http://localhost:8080";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"tasks" | "users">("tasks");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await TasksService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("タスクの取得に失敗しました:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await UsersService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("ユーザーの取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchTasks(), fetchUsers()]).finally(() => setLoading(false));
  }, []);

  const handleCreateTask = async (task: Task) => {
    try {
      await TasksService.createTask(task);
      await fetchTasks();
      setShowForm(false);
    } catch (error) {
      console.error("タスクの作成に失敗しました:", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await TasksService.deleteTask(id);
      await fetchTasks();
    } catch (error) {
      console.error("タスクの削除に失敗しました:", error);
    }
  };

  const handleStatusChange = async (
    id: number,
    status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
  ) => {
    try {
      await TasksService.updateTaskStatus(id, status);
      await fetchTasks();
    } catch (error) {
      console.error("ステータスの更新に失敗しました:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          📋 Swagger Hands-on Task Manager
        </h1>
        <p className="mt-2 text-gray-600">
          Spring Boot (Backend) → OpenAPI Spec → TypeScript Client (Frontend)
        </p>
      </header>

      {/* タブ切り替え */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`pb-2 px-1 font-medium transition-colors ${
            activeTab === "tasks"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          タスク管理
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-2 px-1 font-medium transition-colors ${
            activeTab === "users"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ユーザー管理
        </button>
      </div>

      {activeTab === "tasks" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              タスク一覧 ({tasks.length}件)
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showForm ? "キャンセル" : "+ 新規タスク"}
            </button>
          </div>

          {showForm && (
            <TaskForm onSubmit={handleCreateTask} users={users} />
          )}

          <TaskList
            tasks={tasks}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}

      {activeTab === "users" && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ユーザー一覧 ({users.length}名)
          </h2>
          <UserList users={users} />
        </div>
      )}

      {/* Swagger UI リンク */}
      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500">
        <p>
          🔗{" "}
          <a
            href="http://localhost:8080/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Swagger UI (Backend)
          </a>
          {" | "}
          <a
            href="http://localhost:8080/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            OpenAPI JSON
          </a>
        </p>
      </footer>
    </main>
  );
}
