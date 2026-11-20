

// Utilidad para mensajes de estado accesibles (evita colores inline rotos en alto contraste)
function mostrarEstado(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.classList.remove('estado-error', 'estado-ok', 'estado-aviso', 'estado-info');
  if (tipo) elemento.classList.add(`estado-${tipo}`);
}

// ---------- MENÚ HAMBURGUESA (HU-039) Y ALTO CONTRASTE (HU-026) ----------
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

// ---------- REGISTRO DE USUARIOS EN HERO (HU-001, HU-003) ----------
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
    mostrarEstado(registroMensaje, 'Completa todos los campos obligatorios.', 'error');
    return;
  }
  if (!emailValido) {
    mostrarEstado(registroMensaje, 'Ingresa un correo electrónico válido.', 'error');
    return;
  }
  if (!celularValido) {
    mostrarEstado(registroMensaje, 'El celular debe tener exactamente 9 dígitos numéricos.', 'error');
    return;
  }
  if (password.length < 6) {
    mostrarEstado(registroMensaje, 'La contraseña debe tener al menos 6 caracteres.', 'error');
    return;
  }

  mostrarEstado(registroMensaje, `¡Registro exitoso, ${nombre}! Tu cuenta de SeniorShield está lista.`, 'ok');
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
const diagIcono = document.getElementById('diagIcono');
const diagTitulo = document.getElementById('diagTitulo');
const diagExplicacion = document.getElementById('diagExplicacion');
const diagFeedback = document.getElementById('diagFeedback');
const btnSimularLink = document.getElementById('btnSimularLink');
const listaHistorialAdulto = document.getElementById('listaHistorialAdulto');
const respuestaFamiliarBox = document.getElementById('respuestaFamiliarBox');

let ultimoDiagnostico = null;
const historialAdulto = [];
const alertasSupervisor = [];

function analizarMensaje(textoOriginal) {
  if (!textoOriginal) return;

  tarjetaDiag.classList.add('oculto');
  mostrarEstado(diagFeedback, '', '');
  estadoCarga.classList.remove('oculto');

  setTimeout(() => {
    estadoCarga.classList.add('oculto');
    const msg = textoOriginal.toLowerCase();

    const urgencia = /urgente|bloqueada|suspendida|claves|contraseña|verificar tus datos/.test(msg);
    const premios = /ganaste|premio|regalamos dinero|oferta/.test(msg);
    const paquetes = /paquete retenido|aduanas|entrega fallida/.test(msg);
    const enlace = /http|www\.|\.com|bit\.ly|link|enlace/.test(msg);

    let nivel = 'verde';
    let icono = '✅';
    let titulo = 'Seguro';
    let explicacion = 'No encontramos señales de engaño en este mensaje. Igual mantén precaución si no conoces al remitente.';

    if ((urgencia || premios || paquetes) && enlace) {
      nivel = 'rojo';
      icono = '🛑';
      titulo = 'Riesgo Alto';
      explicacion = 'Cuidado: Este mensaje busca asustarte o apurarte para que entres a una página falsa. Tu banco nunca pide claves por mensaje.';
    } else if (urgencia || premios || paquetes || enlace) {
      nivel = 'ambar';
      icono = '⚠️';
      titulo = 'Precaución';
      explicacion = 'Este mensaje contiene un enlace externo o una promesa dudosa. Verifica directamente en la página oficial antes de responder.';
    }

    tarjetaDiag.className = `tarjeta-diagnostico riesgo-${nivel}`;
    diagIcono.textContent = icono;
    diagTitulo.textContent = titulo;
    diagExplicacion.textContent = explicacion;
    btnSimularLink.classList.toggle('oculto', nivel !== 'rojo');

    ultimoDiagnostico = {
      id: Date.now(),
      texto: textoOriginal,
      nivel,
      titulo,
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    historialAdulto.unshift(ultimoDiagnostico);
    renderHistorialAdulto();
  }, 400);
}

document.querySelectorAll('.btn-chip').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const texto = btn.dataset.ejemplo;
    mensajeInput.value = texto;
    analizarMensaje(texto);
  });
});

simuladorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  analizarMensaje(mensajeInput.value.trim());
});

function renderHistorialAdulto() {
  listaHistorialAdulto.innerHTML = historialAdulto.slice(0, 10).map(item => `
    <li><strong>[${item.titulo.toUpperCase()} - ${item.fecha}]</strong> ${item.texto.slice(0, 90)}</li>
  `).join('');
}

// ---------- MODALES ACCESIBLES (HU-013, HU-014, HU-037) ----------
let focoPrevio = null;

function abrirModal(modal, botonFoco) {
  focoPrevio = document.activeElement;
  modal.classList.remove('oculto');
  if (botonFoco) botonFoco.focus();
}

function cerrarModal(modal) {
  modal.classList.add('oculto');
  if (focoPrevio) focoPrevio.focus();
}

const modalEnlace = document.getElementById('modalEnlace');
const btnCancelarEnlace = document.getElementById('btnCancelarEnlace');
btnSimularLink.addEventListener('click', () => abrirModal(modalEnlace, btnCancelarEnlace));
btnCancelarEnlace.addEventListener('click', () => cerrarModal(modalEnlace));
document.getElementById('btnEntiendoRiesgo').addEventListener('click', () => {
  cerrarModal(modalEnlace);
  mostrarEstado(diagFeedback, 'Confirmación manual registrada. Recuerda nunca ingresar claves.', 'aviso');
});

const modalEliminar = document.getElementById('modalEliminar');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
document.getElementById('btnEliminarSeguro').addEventListener('click', () => {
  abrirModal(modalEliminar, btnCancelarEliminar);
});
btnCancelarEliminar.addEventListener('click', () => cerrarModal(modalEliminar));
document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
  cerrarModal(modalEliminar);
  mensajeInput.value = '';
  tarjetaDiag.classList.add('oculto');
  btnSimularLink.classList.add('oculto');
  respuestaFamiliarBox.textContent = 'La amenaza fue borrada de forma segura.';
  respuestaFamiliarBox.classList.remove('oculto');
});

document.getElementById('btnReportarFalso').addEventListener('click', () => {
  mostrarEstado(diagFeedback, 'Gracias por tu reporte anónimo. Ayudarás a mejorar el sistema.', 'ok');
});

// ---------- MODO FAMILIAR SUPERVISOR (HU-018 - HU-024) ----------
const badgeAlertas = document.getElementById('badgeAlertas');
const listaAlertasSupervisor = document.getElementById('listaAlertasSupervisor');
const filtroSoloRojo = document.getElementById('filtroSoloRojo');
const buscadorIncidentes = document.getElementById('buscadorIncidentes');

document.getElementById('btnConsultarFamiliar').addEventListener('click', () => {
  if (!ultimoDiagnostico) return;
  alertasSupervisor.unshift({
    ...ultimoDiagnostico,
    id: Date.now(),
    estado: 'Pendiente',
    respuesta: ''
  });
  mostrarEstado(diagFeedback, 'Consulta enviada. Cambia a "Modo Supervisor" arriba para responder.', 'info');
  renderAlertasSupervisor();
});

function renderAlertasSupervisor() {
  const pendientes = alertasSupervisor.filter(a => a.estado === 'Pendiente').length;
  badgeAlertas.textContent = pendientes;
  badgeAlertas.classList.toggle('oculto', pendientes === 0);

  const soloRojo = filtroSoloRojo.checked;
  const query = buscadorIncidentes.value.trim().toLowerCase();

  const filtradas = alertasSupervisor.filter(a => {
    if (soloRojo && a.nivel !== 'rojo') return false;
    if (query && !a.texto.toLowerCase().includes(query)) return false;
    return true;
  });

  if (filtradas.length === 0) {
    listaAlertasSupervisor.innerHTML = '<p class="vacio">No hay alertas que coincidan con el filtro.</p>';
    return;
  }

  listaAlertasSupervisor.innerHTML = filtradas.map(a => `
    <div class="alerta-item ${a.nivel === 'rojo' ? 'critica' : ''}">
      <p><strong>Estado:</strong> ${a.estado} | <strong>Nivel:</strong> ${a.titulo} | <strong>Hora:</strong> ${a.fecha}</p>
      <p class="alerta-privacidad">Remitente original oculto por privacidad (HU-020).</p>
      <p>"${a.texto}"</p>
      ${a.estado === 'Pendiente' ? `
        <div class="alerta-acciones">
          <button type="button" class="btn btn-peligro btn-full btn-responder" data-id="${a.id}" data-resp="Es estafa, bórralo">Es estafa, bórralo</button>
          <button type="button" class="btn btn-primario btn-full btn-responder" data-id="${a.id}" data-resp="Es seguro">Es seguro</button>
        </div>
      ` : `<p><strong>Respuesta enviada:</strong> ${a.respuesta}</p>`}
    </div>
  `).join('');
}

listaAlertasSupervisor.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-responder');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const textoRespuesta = btn.dataset.resp;
  const alerta = alertasSupervisor.find(a => a.id === id);
  if (!alerta || alerta.estado === 'Resuelto') return;

  alerta.estado = 'Resuelto';
  alerta.respuesta = textoRespuesta;
  renderAlertasSupervisor();

  respuestaFamiliarBox.textContent = `Respuesta de tu familiar: "${textoRespuesta}".`;
  respuestaFamiliarBox.classList.remove('oculto');
});

filtroSoloRojo.addEventListener('change', renderAlertasSupervisor);
buscadorIncidentes.addEventListener('input', renderAlertasSupervisor);

// ---------- FAQ Y POLÍTICA (HU-037) ----------
const detallesFaq = document.querySelectorAll('.faq-lista details');
detallesFaq.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      detallesFaq.forEach(otro => {
        if (otro !== item) otro.open = false;
      });
    }
  });
});

const modalPolitica = document.getElementById('modalPolitica');
const btnCerrarPolitica = document.getElementById('btnCerrarPolitica');
document.getElementById('btnPolitica').addEventListener('click', () => abrirModal(modalPolitica, btnCerrarPolitica));
btnCerrarPolitica.addEventListener('click', () => cerrarModal(modalPolitica));
modalPolitica.addEventListener('click', (e) => {
  if (e.target === modalPolitica) cerrarModal(modalPolitica);
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!modalPolitica.classList.contains('oculto')) cerrarModal(modalPolitica);
  if (!modalEliminar.classList.contains('oculto')) cerrarModal(modalEliminar);
});

// ---------- FORMULARIO DE CONTACTO (HU-034) ----------
const contactoForm = document.getElementById('contactoForm');
const contactoMensaje = document.getElementById('contactoMensaje');

contactoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const celular = document.getElementById('celular').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !correo || !celular || !mensaje) {
    mostrarEstado(contactoMensaje, 'Por favor completa todos los campos obligatorios.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    mostrarEstado(contactoMensaje, 'Ingresa un correo electrónico válido.', 'error');
    return;
  }
  if (!/^\d{9}$/.test(celular)) {
    mostrarEstado(contactoMensaje, 'Ingresa un número de celular de 9 dígitos.', 'error');
    return;
  }

  mostrarEstado(contactoMensaje, '¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.', 'ok');
  contactoForm.reset();
});

// ---------- BOLETÍN EDUCATIVO (HU-038) ----------
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterMensaje = document.getElementById('newsletterMensaje');
const suscritos = new Set();

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const correo = newsletterEmail.value.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    mostrarEstado(newsletterMensaje, 'Correo inválido.', 'error');
    return;
  }
  if (suscritos.has(correo)) {
    mostrarEstado(newsletterMensaje, 'Este correo ya está registrado en el boletín.', 'aviso');
    return;
  }

  suscritos.add(correo);
  mostrarEstado(newsletterMensaje, 'Suscripción exitosa al boletín preventivo.', 'ok');
  newsletterForm.reset();

  setTimeout(() => {
    mostrarEstado(newsletterMensaje, '', '');
  }, 5000);
});
