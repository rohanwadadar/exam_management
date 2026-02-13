# 📝 Exam Management System

A full-featured online examination platform built with **Spring Boot** and **MySQL**. Students can register, enroll in exams, and take MCQ-based tests with **automated answer checking**. Admins have complete control over exams, questions, students, departments, and results.

---

## 🚀 Features

### 👨‍🎓 Student Portal
- **Registration** — Sign up with department, semester, registration number
- **Browse Exams** — View active exams filtered by department
- **Enroll for Exams** — Register for upcoming examinations
- **Take MCQ Exams** — Full exam interface with live countdown timer
- **Auto-Graded Results** — Instant score, percentage, pass/fail status
- **View Results** — Detailed breakdown of correct, wrong, and attempted questions

### 🔑 Admin Dashboard
- **Manage Departments** — Add, view, and delete departments
- **Manage Exams** — Create exams with subject, department, semester, duration, and passing percentage
- **Manage MCQ Questions** — Add/edit/delete questions with 4 options and correct answer key
- **Manage Students** — View all registered students with full profiles
- **View Answer Sheets** — Compare student answers vs correct answers (color-coded)
- **View All Results** — Complete results dashboard across all students and exams
- **Auto-Grading Engine** — Answers are automatically checked against pre-uploaded correct answers

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
|-------------|-------------------------------|
| Backend      | Java 17, Spring Boot 3.2.2    |
| Database     | MySQL                         |
| ORM          | Spring Data JPA / Hibernate   |
| Frontend     | HTML5, CSS3, JavaScript (Vanilla) |
| UI Framework | Bootstrap 5.3                 |
| Build Tool   | Maven                         |

---

## 📦 Project Structure

```
exam_management/
├── src/main/java/com/exam/
│   ├── ExamManagementApplication.java
│   ├── controller/
│   │   ├── HomeController.java
│   │   ├── UserController.java
│   │   ├── ExamController.java
│   │   ├── QuestionController.java
│   │   ├── ExamResultController.java
│   │   └── DepartmentController.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Exam.java
│   │   ├── Question.java
│   │   ├── Enrollment.java
│   │   ├── ExamResult.java
│   │   └── Department.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ExamRepository.java
│   │   ├── QuestionRepository.java
│   │   ├── EnrollmentRepository.java
│   │   ├── ExamResultRepository.java
│   │   └── DepartmentRepository.java
│   └── service/
│       ├── UserService.java
│       ├── ExamService.java
│       ├── QuestionService.java
│       ├── ExamResultService.java
│       └── DepartmentService.java
├── src/main/resources/
│   ├── application.properties
│   └── static/
│       ├── index.html
│       ├── style.css
│       └── app.js
└── pom.xml
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Java 17** or higher
- **MySQL** server running on `localhost:3306`
- **Maven** installed

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohanwadar/exam_management.git
   cd exam_management
   ```

2. **Configure MySQL**  
   Make sure MySQL is running. The database `exam_portal` will be created automatically.  
   Update credentials in `src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/exam_portal?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=
   ```

3. **Build & Run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

---

## 🔐 Default Credentials

| Role    | Username | Password      |
|---------|----------|---------------|
| Admin   | `admin`  | `admin123456` |
| Student | *(Sign up via registration form)* | — |

> Admin account is auto-created on first startup. No signup needed.

---

## 📡 API Endpoints

### User APIs
| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| POST   | `/user/`               | Register new user     |
| POST   | `/user/login`          | Login                 |
| GET    | `/user/{id}`           | Get user by ID        |
| GET    | `/user/students`       | Get all students      |
| PUT    | `/user/`               | Update user           |
| DELETE | `/user/{id}`           | Delete user           |

### Exam APIs
| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| POST   | `/exam/admin/`                    | Create exam                    |
| PUT    | `/exam/admin/`                    | Update exam                    |
| DELETE | `/exam/admin/{examId}`            | Delete exam                    |
| GET    | `/exam/`                          | Get all exams                  |
| GET    | `/exam/{id}`                      | Get exam by ID                 |
| GET    | `/exam/active`                    | Get active exams               |
| GET    | `/exam/department/{deptId}`       | Get exams by department        |
| GET    | `/exam/filter?departmentId=&semester=` | Filter exams            |
| POST   | `/exam/student/register?userId=&examId=` | Enroll for exam       |
| GET    | `/exam/student/registrations/{userId}` | Get student enrollments  |

### Question APIs
| Method | Endpoint                     | Description                        |
|--------|------------------------------|------------------------------------|
| POST   | `/question/admin/{examId}`   | Add question to exam               |
| POST   | `/question/admin/bulk/{examId}` | Add multiple questions          |
| GET    | `/question/admin/{examId}`   | Get questions with answers (admin) |
| GET    | `/question/student/{examId}` | Get questions without answers      |
| PUT    | `/question/admin/`           | Update question                    |
| DELETE | `/question/admin/{id}`       | Delete question                    |

### Result APIs
| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| POST   | `/result/submit?studentId=&examId=`   | Submit exam (auto-grade) |
| GET    | `/result/student/{studentId}`         | Get student results      |
| GET    | `/result/exam/{examId}`               | Get results by exam      |
| GET    | `/result/all`                         | Get all results          |
| GET    | `/result/check?studentId=&examId=`    | Check specific result    |

### Department APIs
| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| GET    | `/department/`      | Get all departments |
| POST   | `/department/`      | Add department      |
| DELETE | `/department/{id}`  | Delete department   |

---

## 🧠 How Auto-Grading Works

1. **Admin uploads MCQ questions** with 4 options (A, B, C, D) and marks the correct answer
2. **Student takes the exam** — answers are submitted as `{ questionId: "selectedOption" }`
3. **Backend compares** each student answer against the stored correct answer
4. **Score is calculated** — correct answers × marks per question
5. **Pass/Fail** is determined based on the exam's passing percentage
6. **Result is stored** with full breakdown: correct, wrong, attempted, percentage
7. **Admin can review** the full answer sheet with color-coded comparison

---

## 🎨 UI Design

- **Dark glassmorphism theme** with premium aesthetics
- **Responsive design** using Bootstrap 5
- **Live exam timer** with pulse animation when time is low
- **Color-coded answer sheets** — green for correct, red for wrong
- **Animated cards** with smooth fade-in transitions
- **Modern stat cards** for result breakdowns

---

## 📋 Default Departments

The following departments are auto-created on first run:

| Department              | Code |
|------------------------|------|
| Computer Science        | CS   |
| Electronics             | ECE  |
| Mechanical              | ME   |
| Civil                   | CE   |
| Information Technology  | IT   |
| Electrical              | EE   |

---

## 📄 License

This project is open source and available for educational purposes.
