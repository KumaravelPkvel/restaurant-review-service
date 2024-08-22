import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || "titansk3.c586m84y6h83.ap-southeast-2.rds.amazonaws.com",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "3KTitans",
  database: process.env.DB_NAME || "restaurant_reviews",
  port: process.env.DB_PORT || 3306 
});

export default pool.promise();