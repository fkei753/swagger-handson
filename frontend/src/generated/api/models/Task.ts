/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * タスク情報
 */
export type Task = {
    /**
     * タスクID
     */
    readonly id?: number;
    /**
     * タスクのタイトル
     */
    title: string;
    /**
     * タスクの詳細説明
     */
    description?: string;
    /**
     * タスクのステータス
     */
    status: Task.status;
    /**
     * タスクの優先度
     */
    priority: Task.priority;
    /**
     * 担当ユーザーID
     */
    assigneeId?: number;
    /**
     * 作成日時
     */
    readonly createdAt?: string;
    /**
     * 更新日時
     */
    readonly updatedAt?: string;
};
export namespace Task {
    /**
     * タスクのステータス
     */
    export enum status {
        TODO = 'TODO',
        IN_PROGRESS = 'IN_PROGRESS',
        IN_REVIEW = 'IN_REVIEW',
        DONE = 'DONE',
    }
    /**
     * タスクの優先度
     */
    export enum priority {
        LOW = 'LOW',
        MEDIUM = 'MEDIUM',
        HIGH = 'HIGH',
        CRITICAL = 'CRITICAL',
    }
}

