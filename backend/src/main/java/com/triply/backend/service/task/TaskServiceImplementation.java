package com.triply.backend.service.task;

import com.triply.backend.domain.dto.request.TaskRequest;
import com.triply.backend.domain.dto.response.TaskResponse;
import com.triply.backend.domain.entity.Task;
import com.triply.backend.domain.entity.ToDoList;
import com.triply.backend.domain.entity.User;
import com.triply.backend.domain.mapper.TaskMapper;
import com.triply.backend.exception.throwable.AccessDeniedException;
import com.triply.backend.exception.throwable.TaskNotFoundException;
import com.triply.backend.exception.throwable.UserNotFoundException;
import com.triply.backend.repository.TaskRepository;
import com.triply.backend.repository.ToDoRepository;
import com.triply.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import static com.triply.backend.domain.mapper.TaskMapper.mapToResponse;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImplementation implements TaskService {

    private final TaskRepository taskRepository;
    private final ToDoRepository toDoListRepository;
    private final UserRepository userRepository;

    @Override
    @SneakyThrows
    public ToDoList createToDoList(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        ToDoList toDoList = ToDoList.builder()
                .user(user)
                .build();

        return toDoListRepository.save(toDoList);
    }

    @Override
    public TaskResponse createTask(Long userId, TaskRequest request) {
        ToDoList toDoList = toDoListRepository.findByUserId(userId)
                .orElseGet(() -> createToDoList(userId));

        Task task = Task.builder()
                .content(request.getContent())
                .isCompleted(false)
                .toDoList(toDoList)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Override
    public Page<TaskResponse> getUserTasks(Long userId, Boolean completed, Integer offset, Byte size) {
        Page<Task> tasks = completed != null
                ? taskRepository.findAllByUserIdAndCompleted(userId, completed, PageRequest.of(offset, size))
                : taskRepository.findAllByUserId(userId, PageRequest.of(offset, size));

        return tasks.map(TaskMapper::mapToResponse);
    }

    @Override
    @SneakyThrows
    public TaskResponse toggleTask(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow(TaskNotFoundException::new);

        if (!task.getToDoList().getUser().getId().equals(userId)) {
            throw new AccessDeniedException();
        }

        task.setIsCompleted(!task.getIsCompleted());
        Task toggledTask = taskRepository.save(task);
        return TaskMapper.mapToResponse(toggledTask);
    }
}
