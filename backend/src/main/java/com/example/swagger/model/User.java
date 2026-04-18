package com.example.swagger.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "タスクを管理するユーザー情報")
public class User {

    @Schema(description = "ユーザーID", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "名前は必須です")
    @Size(min = 1, max = 100, message = "名前は1〜100文字で入力してください")
    @Schema(description = "ユーザー名", example = "田中太郎", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @NotBlank(message = "メールアドレスは必須です")
    @Email(message = "有効なメールアドレスを入力してください")
    @Schema(description = "メールアドレス", example = "tanaka@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    public User() {}

    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
