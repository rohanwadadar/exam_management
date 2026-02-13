package com.exam.service;

import com.exam.entity.Department;
import com.exam.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @PostConstruct
    public void initDepartments() {
        if (departmentRepository.count() == 0) {
            String[][] depts = {
                {"Computer Science", "CS", "Department of Computer Science & Engineering"},
                {"Electronics", "ECE", "Department of Electronics & Communication"},
                {"Mechanical", "ME", "Department of Mechanical Engineering"},
                {"Civil", "CE", "Department of Civil Engineering"},
                {"Information Technology", "IT", "Department of Information Technology"},
                {"Electrical", "EE", "Department of Electrical Engineering"}
            };
            for (String[] d : depts) {
                Department dept = new Department();
                dept.setName(d[0]);
                dept.setCode(d[1]);
                dept.setDescription(d[2]);
                departmentRepository.save(dept);
            }
        }
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartment(Long id) {
        return departmentRepository.findById(id).orElse(null);
    }

    public Department addDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}
