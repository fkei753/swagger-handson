package com.example.swagger.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Schema(description = "タスク情報")
public class Task {

    @Schema(description = "タスクID", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "タイトルは必須です")
    @Size(min = 1, max = 200, message = "タイトルは1〜200文字で入力してください")
    @Schema(description = "タスクのタイトル", example = "Swagger定義を作成する", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Size(max = 1000, message = "説明は1000文字以内で入力してください")
    @Schema(description = "タスクの詳細説明", example = "OpenAPI 3.0仕様に準拠したSwagger定義を作成する")
    private String description;

    @NotNull(message = "ステータスは必須です")
    @Schema(description = "タスクの状態", example = "TODO", requiredMode = Schema.RequiredMode.REQUIRED)
    private TaskStatus status;

    @NotNull(message = "優先度は必須です")
    @Schema(description = "タスクの優先度", example = "HIGH", requiredMode = Schema.RequiredMode.REQUIRED)
    private TaskPriority priority;

    @Schema(description = "担当ユーザーID", example = "1")
    private Long assigneeId;

    @Schema(description = "作成日時", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;

    @Schema(description = "更新日時", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime updatedAt;

    public Task() {}

    public Task(Long id, String title, String description, TaskStatus status, TaskPriority priority, Long assigneeId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.assigneeId = assigneeId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }
    public Long getAssigneeId() { return assigneeId; }
    public void setAssigneeId(Long assigneeId) { this.assigneeId = assigneeId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
