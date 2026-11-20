// ---------- 1. MENÚ HAMBURGUESA (HU-039) Y ALTO CONTRASTE (HU-026) ----------
const btnMenu = document.getElementById('btnMenu');
const navPrincipal = document.getElementById('navPrincipal');
const btnContraste = document.getElementById('btnContraste');

btnMenu.addEventListener('click', () => {
  const abierto = navPrincipal.classList.toggle('abierto');
  btnMenu.setAttribute('aria-expanded', abierto);
});

navPrincipal.querySelectorAll('a').forEach(enlace => {
  enlace.addEventListener('click', () => {
    navPrincipal.classList.remove('abierto');
    btnMenu.setAttribute('aria-expanded', 'false');
  });
});

btnContraste.addEventListener('click', () => {
  const activo = document.body.classList.toggle('alto-contraste');
  btnContraste.setAttribute('aria-pressed', activo);
});

// ---------- 2. REGISTRO DE USUARIOS AL INICIO (HU-001, HU-003) ----------
const registroForm = document.getElementById('registroForm');
const registroMensaje = document.getElementById('registroMensaje');

registroForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('regNombre').value.trim();
  const correo = document.getElementById('regCorreo').value.trim();
  const celular = document.getElementById('regCelular').value.trim();
  const password = document.getElementById('regPassword').value;

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  const celularValido = /^\d{9}$/.test(celular);

  if (!nombre || !correo || !celular || !password) {
    registroMensaje.textContent = 'Completa todos los campos obligatorios.';
    registroMensaje.style.color = '#D32F2F';
    return;
  }
  if (!emailValido) {
    registroMensaje.textContent = 'Ingresa un correo electrónico válido.';
    registroMensaje.style.color = '#D32F2F';
    return;
  }
  if (!celularValido) {
    registroMensaje.textContent = 'El celular debe tener exactamente 9 dígitos numéricos.';
    registroMensaje.style.color = '#D32F2F';
    return;
  }
  if (password.length < 6) {
    registroMensaje.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    registroMensaje.style.color = '#D32F2F';
    return;
  }

  registroMensaje.textContent = `¡Registro exitoso, ${nombre}! Tu cuenta de SeniorShield está lista.`;
  registroMensaje.style.color = '#388E3C';
  registroForm.reset();
});

// ---------- 3. PESTAÑAS DEL SIMULADOR ----------
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const celularPantalla = document.getElementById('celularPantalla');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => {
      b.classList.remove('activo');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(p => p.classList.remove('activo'));

    btn.classList.add('activo');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById(btn.dataset.tab).classList.add('activo');
    celularPantalla.scrollTop = 0;
  });
});

// ---------- 4. SIMULADOR MODO ADULTO MAYOR ----------
const simuladorForm = document.getElementById('simuladorForm');
const mensajeInput = document.getElementById('mensajeInput');
const estadoCarga = document.getElementById('estadoCarga');
const tarjetaDiag = document.getElementById('tarjetaDiagnostico');
const diagIcono = document.getElementById('diag