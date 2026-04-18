package com.example.swagger.controller;

import com.example.swagger.model.ApiError;
import com.example.swagger.model.Task;
import com.example.swagger.model.TaskPriority;
import com.example.swagger.model.TaskStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "タスク管理API")
public class TaskController {

    private final Map<Long, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public TaskController() {
        // サンプルデータ
        Task task1 = new Task(idCounter.getAndIncrement(), "Swagger定義の作成",
                "OpenAPI仕様でAPIを定義する", TaskStatus.TODO, TaskPriority.HIGH, 1L);
        Task task2 = new Task(idCounter.getAndIncrement(), "フロントエンド実装",
                "Next.jsでUIを構築する", TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM, 2L);
        Task task3 = new Task(idCounter.getAndIncrement(), "テスト作成",
                "APIの単体テストを書く", TaskStatus.DONE, TaskPriority.LOW, 1L);
        tasks.put(task1.getId(), task1);
        tasks.put(task2.getId(), task2);
        tasks.put(task3.getId(), task3);
    }

    @GetMapping
    @Operation(summary = "タスク一覧取得", description = "タスクの一覧を取得します。ステータスや優先度でフィルタリング可能です。")
    @ApiResponse(responseCode = "200", description = "取得成功")
    public ResponseEntity<List<Task>> getAllTasks(
            @Parameter(description = "ステータスでフィルタ")
            @RequestParam(required = false) TaskStatus status,
            @Parameter(description = "優先度でフィルタ")
            @RequestParam(required = false) TaskPriority priority) {
        List<Task> result = new ArrayList<>(tasks.values());

        if (status != null) {
            result = result.stream()
                    .filter(t -> t.getStatus() == status)
                    .collect(Collectors.toList());
        }
        if (priority != null) {
            result = result.stream()
                    .filter(t -> t.getPriority() == priority)
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "タスク詳細取得", description = "指定したIDのタスク情報を取得します")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "取得成功"),
            @ApiResponse(responseCode = "404", description = "タスクが見つかりません",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<?> getTaskById(
            @Parameter(description = "タスクID", required = true, example = "1")
            @PathVariable Long id) {
        Task task = tasks.get(id);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(404, "Not Found", "タスクID " + id + " が見つかりません"));
        }
        return ResponseEntity.ok(task);
    }

    @PostMapping
    @Operation(summary = "タスク作成", description = "新しいタスクを作成します")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "作成成功"),
            @ApiResponse(responseCode = "400", description = "バリデーションエラー",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        task.setId(idCounter.getAndIncrement());
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        tasks.put(task.getId(), task);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @PutMapping("/{id}")
    @Operation(summary = "タスク更新", description = "指定したIDのタスク情報を更新します")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "更新成功"),
            @ApiResponse(responseCode = "404", description = "タスクが見つかりません",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<?> updateTask(
            @Parameter(description = "タスクID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody Task task) {
        if (!tasks.containsKey(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(404, "Not Found", "タスクID " + id + " が見つかりません"));
        }
        Task existing = tasks.get(id);
        task.setId(id);
        task.setCreatedAt(existing.getCreatedAt());
        task.setUpdatedAt(LocalDateTime.now());
        tasks.put(id, task);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "タスク削除", description = "指定したIDのタスクを削除します")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "削除成功"),
            @ApiResponse(responseCode = "404", description = "タスクが見つかりません",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<?> deleteTask(
            @Parameter(description = "タスクID", required = true)
            @PathVariable Long id) {
        if (!tasks.containsKey(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(404, "Not Found", "タスクID " + id + " が見つかりません"));
        }
        tasks.remove(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "タスクステータス更新", description = "指定したIDのタスクのステータスのみを更新します")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "更新成功"),
            @ApiResponse(responseCode = "404", description = "タスクが見つかりません",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<?> updateTaskStatus(
            @Parameter(description = "タスクID", required = true)
            @PathVariable Long id,
            @Parameter(description = "新しいステータス", required = true)
            @RequestParam TaskStatus status) {
        Task task = tasks.get(id);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(404, "Not Found", "タスクID " + id + " が見つかりません"));
        }
        task.setStatus(status);
        task.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(task);
    }
}
