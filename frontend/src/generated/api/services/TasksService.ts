/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Task } from '../models/Task';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TasksService {
    /**
     * タスク詳細取得
     * 指定したIDのタスク情報を取得します
     * @param id タスクID
     * @returns any 取得成功
     * @throws ApiError
     */
    public static getTaskById(
        id: number,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tasks/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `タスクが見つかりません`,
            },
        });
    }
    /**
     * タスク更新
     * 指定したIDのタスク情報を更新します
     * @param id タスクID
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static updateTask(
        id: number,
        requestBody: Task,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/tasks/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `タスクが見つかりません`,
            },
        });
    }
    /**
     * タスク削除
     * 指定したIDのタスクを削除します
     * @param id タスクID
     * @returns void
     * @throws ApiError
     */
    public static deleteTask(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/tasks/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `タスクが見つかりません`,
            },
        });
    }
    /**
     * タスク一覧取得
     * タスクの一覧を取得します。ステータスや優先度でフィルタリング可能です。
     * @param status ステータスでフィルタ
     * @param priority 優先度でフィルタ
     * @returns Task 取得成功
     * @throws ApiError
     */
    public static getAllTasks(
        status?: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE',
        priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    ): CancelablePromise<Array<Task>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tasks',
            query: {
                'status': status,
                'priority': priority,
            },
        });
    }
    /**
     * タスク作成
     * 新しいタスクを作成します
     * @param requestBody
     * @returns Task 作成成功
     * @throws ApiError
     */
    public static createTask(
        requestBody: Task,
    ): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tasks',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `バリデーションエラー`,
            },
        });
    }
    /**
     * タスクステータス更新
     * 指定したIDのタスクのステータスのみを更新します
     * @param id タスクID
     * @param status 新しいステータス
     * @returns any 更新成功
     * @throws ApiError
     */
    public static updateTaskStatus(
        id: number,
        status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE',
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/tasks/{id}/status',
            path: {
                'id': id,
            },
            query: {
                'status': status,
            },
            errors: {
                404: `タスクが見つかりません`,
            },
        });
    }
}
