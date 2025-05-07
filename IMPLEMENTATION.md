# IMPLEMENTATION.md

## 🏦 Tech Stack

### Backend:

* **Node.js** with **Express.js** for building RESTful APIs
* **Sequelize ORM** for interacting with the PostgreSQL database
* **PostgreSQL** as the relational database
* **express-validator** for input validation
* **Dotenv** for environment variable management
* **CORS** for cross-origin resource sharing

Todo Management: IMPLEMENTED
Todo Details : IMPLEMENTED
List View Features : IMPLEMENTED
Data Export : IMPLEMENTED
User Management : IMPLEMENTED

### Frontend:

* **Next.js** (React-based framework) for server-side rendering and routing
* **TypeScript** for type safety
* **Native Fetch API** for API requests
* **Tailwind CSS** for styling
* **Radix UI** for accessible UI components

---

## 🚀 How to Run the Application

### Prerequisites:

* Node.js (v16+)
* PostgreSQL installed and running
* npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/project-name.git
cd project-name
```

### 2. Backend Setup

```bash
cd backend
yarn install # or npm install
```

* Create a `.env` file in the backend folder with the following:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=your_database_name
DB_PORT=5432
```

* Run migrations to set up the database:

```bash
yarn sequelize-cli db:migrate # or npx sequelize-cli db:migrate
```
* Run seeders:

```bash
yarn sequelize-cli db:seed:all # or npx sequelize-cli db:seed:all 
```

* Start the backend:

```bash
yarn dev # or npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
yarn install # or npm install
```

* Create a `.env.local` file in the frontend folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

* Start the frontend:

```bash
yarn dev # or npm run dev
```

---

## 📌 Assumptions and Design Decisions

* Sequelize was chosen for ease of ORM and database migrations with PostgreSQL.
* Backend and frontend are developed as separate services for modularity and scalability.
* Environment variables are used for managing sensitive credentials and configuration.
* The application architecture is RESTful, and folder structure follows MVC patterns.
* Input validation is handled using express-validator in the backend.
* The frontend uses the native fetch API for all HTTP requests.
* UI is built with Next.js, Tailwind CSS, and Radix UI components for accessibility and rapid development.

---

## 🌟 Additional Features / Improvements

* **Pagination and Filtering** on resource-heavy endpoints
* **Global Error Handling Middleware** in the backend
* **Reusable API Layer** in the frontend using fetch
* **Custom Hooks** for fetching data in the frontend
* **Input Validation** using express-validator
* **Loading and Error States** on the frontend for better UX
* **TypeScript** for type safety across the frontend
* **Radix UI** for accessible and customizable UI components


## 🌟 Additional Features / Improvements that can be implemted later
* **JWT, Oauth and Session management** Json WEB Token based authentication system for user sessions and authorization.
* **Redis** For caching frequently accessed data and improving performance.
* **GraphQL** Instead of REST for more efficient querying and mutations.
* **Testing**: Unit tests for both backend and frontend using Jest respectively.