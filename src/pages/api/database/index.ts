import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PSWD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0,
});

export const connection =
  (fn) =>
  async (...args) => {
    const conn: any = await pool.getConnection();
    const result = await fn(conn, ...args).catch((error) => {
      conn.connection.release();
      throw error;
    });

    conn.connection.release();
    return result;
  };

export const transaction =
  (fn) =>
  async (...args) => {
    const conn: any = await pool.getConnection();
    await conn.beginTransaction();
    const result = await fn(conn, ...args).catch(async (error) => {
      console.log(error);
      await conn.rollback();
      conn.connection.release();
      throw error;
    });

    await conn.commit();
    conn.connection.release();
    return result;
  };
