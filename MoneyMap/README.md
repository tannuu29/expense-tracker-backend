# Expense Management System Backend + Frontend

This project is the backend of the Expense Management System built using Spring Boot. It provides RESTful APIs to manage expenses, handle business logic, and interact with the database.

## Features

Create, read, update, and delete expenses

RESTful API architecture

Validation and exception handling

Supports filtering and total expense calculation

Layered architecture (Controller, Service, Repository)

## Tech Stack

Java

Spring Boot

Spring Web

Spring Data JPA

Hibernate

MySQL / H2 Database

Maven

## API Overview

The backend exposes REST APIs for expense management operations.

### Example endpoints:

GET /api/expenses – Fetch all expenses

POST /api/expenses – Add a new expense

PUT /api/expenses/{id} – Update an expense

DELETE /api/expenses/{id} – Delete an expense

## Database Configuration

Database configurations are defined in the application.properties file.

### Example:

spring.datasource.url=jdbc:mysql://localhost:3306/expense_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

## Installation and Setup
### Prerequisites

Java 17 or above

Maven

MySQL (if using MySQL)

### Steps to Run
git clone <[repository-url](https://github.com/tannuu29/ExpenseTracker-backend.git)>
cd expense-management-backend
mvn clean install
mvn spring-boot:run


The backend server will start on http://localhost:80.

Project Status

This backend application is under development and will be enhanced with authentication, authorization, and performance improvements.

# Expense Management System Frontend

This project is the frontend of an Expense Management System built using React. It provides a user-friendly interface to manage daily expenses and communicates with a Spring Boot backend using REST APIs.

## Features

Add, update, and delete expenses

View all expenses

Filter expenses by date, amount, and payment mode

Display total expenses dynamically

Responsive user interface

## Tech Stack

React

JavaScript (ES6)

HTML

CSS

Fetch API

## Backend Integration

The frontend integrates with a Spring Boot backend that exposes REST APIs for expense management operations. Ensure the backend server is running before starting the frontend application.

## Installation and Setup
### Prerequisites

Node.js

npm

### Steps to Run
git clone <[repository-url](https://github.com/tannuu29/ExpenseTracker-frontend.git)>
cd expense-management-frontend
npm install
npm run dev


The application will be available at http://localhost:5173.

## Project Status

This project is under active development and new features are being added regularly.
