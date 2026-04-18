"use client";

import type { User } from "@/generated/api/models/User";

type Props = {
  users: User[];
};

export function UserList({ users }: Props) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        ユーザーが登録されていません。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
              {user.name?.charAt(0) ?? "?"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">ID: {user.id}</div>
        </div>
      ))}
    </div>
  );
}
