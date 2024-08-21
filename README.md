# Restaurant Review Service

This project is a RESTful API for managing restaurant reviews, built using Node.js, Express, and MySQL.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Node.js package manager (comes with Node.js).
- **MySQL**: A running MySQL database.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/KumaravelPkvel/restaurant-review-service.git
cd restaurant-review-service
```

### 2. Run the project
**create env file as follows**
```bash
DB_HOST=localhost
DB_USER=your mySQL username
DB_PASSWORD=your mySQL password
DB_NAME=restaurant_reviews
JWT_SECRET=sdf6erzERfw56qKl
DB_PORT=3306
```
**To run follow this commands**

```bash
npm install
node src/app.mjs
```

There is a file called Schema.sql which has all the sql tables to be created please run 


