package com.triply.backend.service.task;

import com.triply.backend.domain.dto.request.CreateTaskRequest;
import com.triply.backend.domain.dto.response.TaskResponse;
import com.triply.backend.domain.entity.ToDoList;
import org.springframework.data.domain.Page;

public interface TaskService {

    ToDoList createToDoList(Long userId);

    TaskResponse createTask(Long userId, CreateTaskRequest request);

    TaskResponse toggleTask(Long userId, Long taskId);

    Page<TaskResponse> getUserTasks(Long userId, Boolean completed, Integer offset, Byte size);
}
