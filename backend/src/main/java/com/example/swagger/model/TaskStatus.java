package com.example.swagger.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "タスクのステータス")
public enum TaskStatus {
    @Schema(description = "未着手")
    TODO,

    @Schema(description = "進行中")
    IN_PROGRESS,

    @Schema(description = "レビュー中")
    IN_REVIEW,

    @Schema(description = "完了")
    DONE
}
