package com.triply.backend.domain.mapper;

import com.triply.backend.domain.dto.response.TaskResponse;
import com.triply.backend.domain.entity.Task;

public class TaskMapper {

    public static TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .content(task.getContent())
                .isCompleted(task.getIsCompleted())
                .build();
    }
}
