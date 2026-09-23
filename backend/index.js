const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint de verificación de estado (Healthcheck para Coolify)
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ status: 'error', database: error.message });
  }
});

// Obtener todas las personas registradas
app.get('/api/visitors', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, created_at FROM visitors ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener visitantes:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

// Registrar una nueva persona
app.post('/api/visitors', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const cleanName = name.trim().slice(0, 255);

    const [result] = await pool.query(
      'INSERT INTO visitors (name) VALUES (?)',
      [cleanName]
    );

    const newVisitor = {
      id: result.insertId,
      name: cleanName,
      created_at: new Date()
    };

    res.status(201).json(newVisitor);
  } catch (error) {
    console.error('Error al guardar visitante:', error);
    res.status(500).json({ error: 'Error al registrar en la base de datos' });
  }
});

// Eliminar un visitante (útil para pruebas)
app.delete('/api/visitors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM visitors WHERE id = ?', [id]);
    res.json({ success: true, message: 'Registro eliminado' });
  } catch (error) {
    console.error('Error al eliminar visitante:', error);
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});

// Iniciar servidor tras inicializar DB
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`[PROA BACKEND] Servidor corriendo en el puerto ${PORT}`);
  await initDatabase();
});

