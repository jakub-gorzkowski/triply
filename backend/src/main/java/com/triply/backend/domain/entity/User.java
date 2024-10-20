package com.triply.backend.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

    @Id
    private Long id;

    private String email;

    private String username;

    private String password;

    @OneToOne(mappedBy = "user")
    private ToDoList toDoList;

    @OneToMany(mappedBy = "user")
    private Set<Trip> tripSet = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Review> reviewSet = new HashSet<>();
}
