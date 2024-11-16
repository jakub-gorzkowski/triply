package com.triply.backend.repository;

import com.triply.backend.domain.entity.ToDoList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ToDoRepository extends JpaRepository<ToDoList, Long> {

    Optional<ToDoList> findByUserId(Long userId);
}
