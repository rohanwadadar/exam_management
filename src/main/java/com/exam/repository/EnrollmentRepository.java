package com.exam.repository;

import com.exam.entity.Enrollment;
import com.exam.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(User student);
}
