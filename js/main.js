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
  diagFeedback.textContent = '';
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

// Botones de ejemplo en 1 clic (HU-033)
document.querySelectorAll('.btn-chip').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const texto = btn.dataset.ejemplo;
    mensajeInput.value = texto;
    analizarMensaje(texto);
  });
});

// Envío manual del formulario
simuladorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  analizarMensaje(mensajeInput.value.trim());
});

function renderHistorialAdulto() {
  listaHistorialAdulto.innerHTML = historialAdulto.slice(0, 10).map(item => `
    <li><strong>[${item.titulo.toUpperCase()} - ${item.fecha}]</strong> ${item.texto.slice(0, 90)}</li>
  `).join('');
}

// Barrera contra pulsaciones accidentales en enlaces rojos (HU-013)
const modalEnlace = document.getElementById('modalEnlace');
btnSimularLink.addEventListener('click', () => modalEnlace.classList.remove('oculto'));
document.getElementById('btnCancelarEnlace').addEventListener('click', () => modalEnlace.classList.add('oculto'));
document.getElementById('btnEntiendoRiesgo').addEventListener('click', () => {
  modalEnlace.classList.add('oculto');
  diagFeedback.textContent = 'Confirmación manual registrada. Recuerda nunca ingresar claves.';
});

// Eliminación segura (HU-014)
document.getElementById('btnEliminarSeguro').addEventListener('click', () => {
  if (confirm('¿Está seguro de borrar este mensaje?')) {
    mensajeInput.value = '';
    tarjetaDiag.classList.add('oculto');
    btnSimularLink.classList.add('oculto');
    alert('La amenaza fue borrada de forma segura.');
  }
});

// Reportar falso positivo (HU-031)
document.getElementById('btnReportarFalso').addEventListener('click', () => {
  diagFeedback.textContent = 'Gracias por tu reporte anónimo. Ayudarás a mejorar el sistema.';
});

// ---------- 5. MODO FAMILIAR SUPERVISOR (HU-018 a HU-024) ----------
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
  diagFeedback.textContent = 'Consulta enviada. Cambia a "Modo Supervisor" arriba para responder.';
  diagFeedback.style.color = '#1A365D';
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
      <p><em>Remitente original oculto por privacidad (HU-020).</em></p>
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

// ---------- 6. FAQ ACORDEÓN EXCLUSIVO Y POLÍTICA (HU-037) ----------
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
document.getElementById('btnPolitica').addEventListener('click', () => modalPolitica.classList.remove('oculto'));
document.getElementById('btnCerrarPolitica').addEventListener('click', () => modalPolitica.classList.add('oculto'));

// ---------- 7. FORMULARIO DE CONTACTO (HU-034) ----------
const contactoForm = document.getElementById('contactoForm');
const contactoMensaje = document.getElementById('contactoMensaje');

contactoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const celular = document.getElementById('celular').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !correo || !celular || !mensaje) {
    contactoMensaje.textContent = 'Por favor completa todos los campos obligatorios.';
    contactoMensaje.style.color = '#D32F2F';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    contactoMensaje.textContent = 'Ingresa un correo electrónico válido.';
    contactoMensaje.style.color = '#D32F2F';
    return;
  }
  if (!/^\d{9}$/.test(celular)) {
    contactoMensaje.textContent = 'Ingresa un número de celular de 9 dígitos.';
    contactoMensaje.style.color = '#D32F2F';
    return;
  }

  contactoMensaje.textContent = '¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.';
  contactoMensaje.style.color = '#388E3C';
  contactoForm.reset();
});

// ---------- 8. BOLETÍN EDUCATIVO CON CONTROL DE DUPLICADOS (HU-038) ----------
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterMensaje = document.getElementById('newsletterMensaje');
const suscritos = new Set();

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const correo = newsletterEmail.value.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    newsletterMensaje.textContent = 'Correo inválido.';
    newsletterMensaje.style.color = '#D32F2F';
    return;
  }
  if (suscritos.has(correo)) {
    newsletterMensaje.textContent = 'Este correo ya está registrado en el boletín.';
    newsletterMensaje.style.color = '#F57C00';
    return;
  }

  suscritos.add(correo);
  newsletterMensaje.textContent = 'Suscripción exitosa al boletín preventivo.';
  newsletterMensaje.style.color = '#388E3C';
  newsletterForm.reset();

  setTimeout(() => {
    newsletterMensaje.textContent = '';
  }, 5000);
});