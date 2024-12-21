package com.triply.backend.repository;

import com.triply.backend.domain.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("SELECT t FROM Task t WHERE t.toDoList.user.id = :userId")
    Page<Task> findAllByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.toDoList.user.id = :userId AND t.isCompleted = :completed")
    Page<Task> findAllByUserIdAndCompleted(
            @Param("userId") Long userId,
            @Param("completed") Boolean completed,
            Pageable pageable
    );
}
