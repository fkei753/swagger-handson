package com.example.swagger.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "API共通エラーレスポンス")
public class ApiError {

    @Schema(description = "HTTPステータスコード", example = "400")
    private int status;

    @Schema(description = "エラーメッセージ", example = "リクエストが不正です")
    private String message;

    @Schema(description = "詳細情報", example = "タイトルは必須です")
    private String detail;

    public ApiError() {}

    public ApiError(int status, String message, String detail) {
        this.status = status;
        this.message = message;
        this.detail = detail;
    }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
}
