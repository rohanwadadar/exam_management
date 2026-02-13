package com.exam.repository;

import com.exam.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByDepartmentId(Long departmentId);
    List<Exam> findByActiveTrue();
    List<Exam> findBySemester(String semester);
    List<Exam> findByDepartmentIdAndSemester(Long departmentId, String semester);
}
