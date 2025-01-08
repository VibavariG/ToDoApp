# To-Do List Web Application

This project is a full-stack web application for managing a to-do list, where users can Create, Edit and Delete tasks. The tasks will be displayed by date, priority, with overdue tasks highlighted. For future scope, users can also see the trends of how many tasks they completed this year, and most recurring tasks.

## Features
1. User Registration and Login (JWT Authentication)
2. CRUD Operations for Tasks
3. Task Categorization (Work, Personal, etc.)
4. Sorting and Filtering by Deadline and Priority
5. Responsive UI

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## Setup Instructions
### Prerequisites
1. Install [Node.js](https://nodejs.org/) and npm.
2. Install [MongoDB](https://www.mongodb.com/).

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/VibavariG/ToDoApp.git
   cd ToDoApp
2. npm install
   ```bash
   cd backend 
   npm install

   cd ../frontend
   npm install
3. .env file
   ```bash
   cd backend
   vi .env
   
   JWT_SECRET=<secret>
   MONGODB_URI=<url>


