const mysql = require('mysql2/promise');
require('dotenv').config();

// Permite configurar mediante DATABASE_URL o variables individuales (estándar en Coolify)
function getPoolConfig() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ''),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'proa_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(getPoolConfig());

// Función para inicializar la base de datos con reintentos (clave para Coolify mientras levanta MySQL)
async function initDatabase(retries = 10, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[DB] Intentando conectar a MySQL (Intento ${attempt}/${retries})...`);
      const connection = await pool.getConnection();
      console.log('[DB] Conexión establecida con éxito.');

      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS visitors (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;

      await connection.query(createTableSQL);
      console.log('[DB] Tabla `visitors` verificada/creada correctamente.');
      connection.release();
      return true;
    } catch (err) {
      console.error(`[DB] Error al conectar/inicializar la base de datos (intento ${attempt}):`, err.message);
      if (attempt < retries) {
        console.log(`[DB] Reintentando en ${delayMs / 1000}s...`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        console.error('[DB] No se pudo conectar a MySQL tras múltiples intentos.');
      }
    }
  }
  return false;
}

module.exports = {
  pool,
  initDatabase
};

