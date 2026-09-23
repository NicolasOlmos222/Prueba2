<script setup>
import { ref, onMounted } from 'vue';
import logoImg from './assets/logo.png';

// Si se define VITE_API_URL en Coolify (ej: https://api.tudominio.com), se usa esa base.
// Si no, se usa una ruta relativa (útil cuando hay proxy inverso o mismo dominio).
const API_BASE = import.meta.env.VITE_API_URL || '';

const name = ref('');
const visitors = ref([]);
const loading = ref(false);
const submitting = ref(false);
const message = ref({ text: '', type: '' });
const backendStatus = ref('checking'); // 'online' | 'offline' | 'checking'

// Obtener la lista de personas
async function fetchVisitors() {
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/api/visitors`);
    if (!res.ok) throw new Error('Error al consultar el servidor');
    visitors.value = await res.json();
    backendStatus.value = 'online';
  } catch (error) {
    console.error('Error fetching visitors:', error);
    backendStatus.value = 'offline';
  } finally {
    loading.value = false;
  }
}

// Comprobar salud del backend
async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      backendStatus.value = 'online';
    } else {
      backendStatus.value = 'offline';
    }
  } catch {
    backendStatus.value = 'offline';
  }
}

// Registrar nombre
async function handleSubmit() {
  const cleanName = name.value.trim();
  if (!cleanName) {
    message.value = { text: 'Por favor, ingresá un nombre válido.', type: 'error' };
    return;
  }

  submitting.value = true;
  message.value = { text: '', type: '' };

  try {
    const res = await fetch(`${API_BASE}/api/visitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: cleanName })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Error al guardar el nombre');
    }

    const newVisitor = await res.json();
    visitors.value.unshift(newVisitor);
    message.value = { text: `¡Bienvenido/a, ${cleanName}! Tu nombre fue guardado con éxito.`, type: 'success' };
    name.value = '';
    backendStatus.value = 'online';

    // Ocultar mensaje luego de 4 segundos
    setTimeout(() => {
      if (message.value.type === 'success') {
        message.value = { text: '', type: '' };
      }
    }, 4000);
  } catch (error) {
    console.error('Error saving visitor:', error);
    message.value = { text: error.message || 'No se pudo conectar con la base de datos.', type: 'error' };
  } finally {
    submitting.value = false;
  }
}

// Formatear fecha legible
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Obtener inicial
function getInitial(fullName) {
  return (fullName || '?').trim().charAt(0).toUpperCase();
}

onMounted(() => {
  fetchVisitors();
  checkHealth();
});
</script>

<template>
  <div class="container">
    <!-- Header principal -->
    <header class="header">
      <div class="logo-wrapper">
        <img :src="logoImg" alt="Proa Logo" class="brand-logo" />
      </div>

      <div class="badge">
        <span class="badge-dot"></span>
        En Construcción
      </div>

      <h1 class="title">Bienvenidos a Proa</h1>
      <p class="subtitle">
        Estamos trabajando en nuestra web. Mientras tanto, dejanos tu nombre para saber que nos visitaste.
      </p>
    </header>

    <!-- Contenido en 2 columnas: Formulario a la izquierda, Lista al costado -->
    <main class="main-grid">
      <!-- Tarjeta Formulario -->
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
            Dejanos tu nombre
          </h2>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="nameInput">¿Cómo te llamás?</label>
            <input
              id="nameInput"
              type="text"
              v-model="name"
              placeholder="Ej: Ana Paula"
              maxlength="100"
              :disabled="submitting"
              required
              autofocus
            />
          </div>

          <button type="submit" class="btn" :disabled="submitting">
            <svg v-if="!submitting" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span v-if="submitting">Guardando en la BD...</span>
            <span v-else>Registrarme</span>
          </button>
        </form>

        <!-- Mensajes de feedback -->
        <div v-if="message.text" :class="['alert', message.type === 'success' ? 'alert-success' : 'alert-error']">
          <span v-if="message.type === 'success'">✓</span>
          <span v-else>⚠️</span>
          {{ message.text }}
        </div>
      </section>

      <!-- Tarjeta Listado al costado -->
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Visitas Registradas
            <span class="counter-badge">{{ visitors.length }}</span>
          </h2>

          <button class="btn-icon" @click="fetchVisitors" title="Actualizar lista" :disabled="loading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
          </button>
        </div>

        <div v-if="loading && visitors.length === 0" class="empty-state">
          <p>Cargando registros desde MySQL...</p>
        </div>

        <div v-else-if="visitors.length === 0" class="empty-state">
          <div class="empty-state-icon">📋</div>
          <p>Aún no hay personas registradas.</p>
          <small style="color: #94a3b8;">¡Sé el primero en ingresar tu nombre!</small>
        </div>

        <ul v-else class="visitors-list">
          <li v-for="item in visitors" :key="item.id" class="visitor-item">
            <div class="visitor-info">
              <div class="avatar">{{ getInitial(item.name) }}</div>
              <div>
                <div class="visitor-name">{{ item.name }}</div>
                <div class="visitor-date">{{ formatDate(item.created_at) }}</div>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </main>

    <!-- Footer con estado de la conexión -->
    <footer class="footer">
      <div class="status-pill">
        <span :class="['status-dot', backendStatus]"></span>
        <span>
          Base de Datos / Backend:
          <strong v-if="backendStatus === 'online'">Conectado</strong>
          <strong v-else-if="backendStatus === 'offline'">Sin conexión</strong>
          <strong v-else>Verificando...</strong>
        </span>
      </div>
      <p>Escuela Proa &bull; Sistema de bienvenida y prueba para Coolify</p>
    </footer>
  </div>
</template>

