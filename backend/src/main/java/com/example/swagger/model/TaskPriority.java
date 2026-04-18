package com.example.swagger.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "タスクの優先度")
public enum TaskPriority {
    @Schema(description = "低")
    LOW,

    @Schema(description = "中")
    MEDIUM,

    @Schema(description = "高")
    HIGH,

    @Schema(description = "緊急")
    CRITICAL
}
