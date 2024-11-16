package com.triply.backend.controller;

import com.triply.backend.domain.dto.request.CreateTaskRequest;
import com.triply.backend.domain.dto.response.TaskResponse;
import com.triply.backend.domain.entity.User;
import com.triply.backend.service.task.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/todo")
@RequiredArgsConstructor
public class ToDoListController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @AuthenticationPrincipal User user,
            @RequestBody CreateTaskRequest request
    ) {
        TaskResponse taskResponse = taskService.createTask(user.getId(), request);
        return new ResponseEntity<>(taskResponse, HttpStatus.CREATED);

    }

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getUserTasks(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "completed", required = false) Boolean completed,
            @RequestParam(value = "offset", defaultValue = "0") Integer offset,
            @RequestParam(value = "size", defaultValue = "10") Byte size
    ) {
        Page<TaskResponse> tasks = taskService.getUserTasks(user.getId(), completed, offset, size);
        Page<TaskResponse> page = new PageImpl<>(
                tasks.toList(),
                PageRequest.of(offset, size),
                tasks.getTotalPages()
        );
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @PatchMapping(path = "/toggle")
    public ResponseEntity<TaskResponse> toggleTask(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "id") Long id
    ) {
        TaskResponse taskResponse = taskService.toggleTask(user.getId(), id);
        return new ResponseEntity<>(taskResponse, HttpStatus.OK);
    }
}