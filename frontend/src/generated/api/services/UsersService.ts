/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * ユーザー詳細取得
     * 指定したIDのユーザー情報を取得します
     * @param id ユーザーID
     * @returns any 取得成功
     * @throws ApiError
     */
    public static getUserById(
        id: number,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `ユーザーが見つかりません`,
            },
        });
    }
    /**
     * ユーザー更新
     * 指定したIDのユーザー情報を更新します
     * @param id ユーザーID
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static updateUser(
        id: number,
        requestBody: User,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `ユーザーが見つかりません`,
            },
        });
    }
    /**
     * ユーザー削除
     * 指定したIDのユーザーを削除します
     * @param id ユーザーID
     * @returns void
     * @throws ApiError
     */
    public static deleteUser(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `ユーザーが見つかりません`,
            },
        });
    }
    /**
     * ユーザー一覧取得
     * 登録されている全ユーザーの一覧を取得します
     * @returns User 取得成功
     * @throws ApiError
     */
    public static getAllUsers(): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
        });
    }
    /**
     * ユーザー作成
     * 新しいユーザーを作成します
     * @param requestBody
     * @returns User 作成成功
     * @throws ApiError
     */
    public static createUser(
        requestBody: User,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `バリデーションエラー`,
            },
        });
    }
}
