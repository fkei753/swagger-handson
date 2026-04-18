package com.example.swagger.controller;

import com.example.swagger.model.ApiError;
import com.example.swagger.model.User;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "ユーザー管理API")
public class UserController {

    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public UserController() {
        // サンプルデータ
        User user1 = new User(idCounter.getAndIncrement(), "田中太郎", "tanaka@example.com");
        User user2 = new User(idCounter.getAndIncrement(), "山田花子", "yamada@example.com");
        users.put(user1.getId(), user1);
        users.put(user2.getId(), user2);
    }

    @GetMapping
    @Operation(summary = "ユーザー一覧取得", description = "登録されている全ユーザーの一覧を取得します")
    @ApiResponse(responseCode = "200", description = "取得成功")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(new ArrayList<>(users.values()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "ユーザー詳細取得", description = "指定したIDのユーザー情報を取得します")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "取得成功"),
            @ApiResponse(responseCode = "404", description = "ユーザーが見つかりません",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<?> getUserById(
            @Parameter(description = "ユーザーID", required = true, example = "1")
            @PathVariable Long id) {
        User user = users.get(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(404, "Not Found", "ユーザーID " + id + " が見つかりません"));
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping
    @Operation(summary = "ユーザー作成", description = "新しいユーザーを作成します")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "作成成功"),
            @ApiResponse(responseCode = "400", description = "バリデーションエラー",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        user.setId(idCounter.getAndIncrement());
        users.put(user.getId(), user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{id}")
    @Operation(summary = "ユーザー更新", description = "指定したIDのユーザー情報を更新します")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "更新成功"),
            @ApiResponse(responseCode = "404", description = "ユーザーが見つかりません",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<?> updateUser(
            @Parameter(description = "ユーザーID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody User user) {
        if (!users.containsKey(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(404, "Not Found", "ユーザーID " + id + " が見つかりません"));
        }
        user.setId(id);
        users.put(id, user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "ユーザー削除", description = "指定したIDのユーザーを削除します")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "削除成功"),
            @ApiResponse(responseCode = "404", description = "ユーザーが見つかりません",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<?> deleteUser(
            @Parameter(description = "ユーザーID", required = true)
            @PathVariable Long id) {
        if (!users.containsKey(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(404, "Not Found", "ユーザーID " + id + " が見つかりません"));
        }
        users.remove(id);
        return ResponseEntity.noContent().build();
    }
}
