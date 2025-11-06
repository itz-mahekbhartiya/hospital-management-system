# 🏥 Hospital Management System (MERN Stack)

This is a **full-stack Hospital Management System (HMS)** built with the **MERN stack (MongoDB, Express.js, React, Node.js)** and **Tailwind CSS**.

It provides a **secure, role-based platform** for managing patient appointments, medical documents, and system users. The application features a clean, responsive interface with dedicated dashboards for **Patients, Doctors, and Administrators**.

---

## 🚀 Key Features

### 🔐 Secure Authentication

* Full user registration and login system using **JWT (JSON Web Tokens)**.
* Passwords hashed using **bcrypt.js** for strong security.

### 🧠 Role-Based Access Control

* Access and routing are controlled based on user roles.
* Automatic dashboard redirection after login.

---

### 👩‍⚕️ Patient Dashboard

* View all **upcoming and past appointments**.
* **Book new appointments** with available doctors.
* **Cancel pending appointments**.
* **View and download** personal medical documents (prescriptions, lab results) via accordion-style tables.

### 🧑‍⚕️ Doctor Dashboard

* View a list of **assigned appointments**.
* **Confirm or complete** appointments.
* View **patient document history**.
* **Upload new medical documents** (PDFs/images) using **Multer**.

### 🧑‍💼 Admin Dashboard

* **User Management:** View, create, and manage all user accounts (Patients, Doctors, Admins).
* **Appointment Management:** View all hospital appointments.
* **Document Management:** View, download, or delete all uploaded documents.

---

## 🧭 User Roles & Authorization

| **Role**    | **Description**                   | **Key Permissions**                                                                    |
| ----------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| **PATIENT** | End-user of the hospital.         | Book, cancel, view own appointments. View/download own documents.                      |
| **DOCTOR**  | Medical staff / service provider. | View/update own appointments. Upload patient documents. View patient document history. |
| **ADMIN**   | System super-user.                | Create/read all users. Read all appointments. Read/delete all documents.               |

---

## 🧰 Technology Stack

### 🖥️ Backend

* Node.js
* Express.js (Routing & API)
* MongoDB (Database)
* Mongoose (Object Data Modeling)
* JSON Web Token (JWT) (Authentication)
* bcrypt.js (Password hashing)
* Multer (File/document uploads)
* CORS, dotenv

### 💻 Frontend

* React (UI Library)
* Vite (Build Tool)
* Zustand (Global state management)
* React Router v6 (Routing)
* Axios (API Requests)
* React Hook Form (Form validation)
* Tailwind CSS (Styling)
* Lucide React (Icons)

---

## ⚙️ Project Setup

To get this project running locally, set up both the **backend** and **frontend**.

### 🧩 Prerequisites

* Node.js (v18 or later)
* MongoDB (Local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1️⃣ Clone the Repository

```bash
git clone https://your-repo-url.com/hms-project.git
cd hms-project
```

---

### 2️⃣ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in `/backend` root and add the following:

```bash
# --- Server Config ---
PORT=5001
NODE_ENV=development

# --- Database ---
# !!! REPLACE THIS with your own MongoDB connection string
MONGO_URI=your_mongodb_connection_string_here

# --- Security ---
JWT_SECRET=your_super_secret_key_123
JWT_EXPIRE=30d
```

> **Note:** Replace `MONGO_URI` with your actual connection string.

Run the backend server:

```bash
npm run server
```

Backend API runs at:
👉 **[http://localhost:5001](http://localhost:5001)**

---

### 3️⃣ Frontend Setup

From the root directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Frontend is configured to make API requests to **[http://localhost:5001/api](http://localhost:5001/api)**

Run the frontend server:

```bash
npm run dev
```

Your React app will run at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## ▶️ How to Run the Project

You must run both servers simultaneously in **two terminals**.

**1. Run Backend**

```bash
cd backend
npm run server
```

**2. Run Frontend**

```bash
cd frontend
npm run dev
```

Now open your browser at:
👉 **[http://localhost:5173](http://localhost:5173)**

You can register a new user and start exploring the application.

---

## 🧾 License

This project is open-source and available under the **MIT License**.

---

## 💡 Author

**Mahek Bhartiya (Mack)**
Final Year Computer Engineering Student
Focused on Full Stack Java Development & Freelance Projects
