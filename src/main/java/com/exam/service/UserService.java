package com.exam.service;

import com.exam.entity.User;
import com.exam.entity.Department;
import com.exam.repository.UserRepository;
import com.exam.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @PostConstruct
    public void initAdmin() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123456");
            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setEmail("admin@exam.com");
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }
    }

    public User createUser(User user) {
        try {
            // Set department if departmentId provided via the department object
            if (user.getDepartment() != null && user.getDepartment().getId() != null) {
                Department dept = departmentRepository.findById(user.getDepartment().getId()).orElse(null);
                user.setDepartment(dept);
            }
            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Error creating user: " + e.getMessage());
        }
    }

    public User login(String username, String password) {
        try {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null && user.getPassword().equals(password)) {
                return user;
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    public User getUser(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAllStudents() {
        return userRepository.findByRole("STUDENT");
    }

    public User updateUser(User user) {
        try {
            User existing = userRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            existing.setFirstName(user.getFirstName());
            existing.setLastName(user.getLastName());
            existing.setEmail(user.getEmail());
            existing.setPhone(user.getPhone());
            existing.setRegistrationNumber(user.getRegistrationNumber());
            existing.setSemester(user.getSemester());
            if (user.getDepartment() != null && user.getDepartment().getId() != null) {
                Department dept = departmentRepository.findById(user.getDepartment().getId()).orElse(null);
                existing.setDepartment(dept);
            }
            existing.setRole(user.getRole());
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                existing.setPassword(user.getPassword());
            }
            return userRepository.save(existing);
        } catch (Exception e) {
            throw new RuntimeException("Update failed: " + e.getMessage());
        }
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
