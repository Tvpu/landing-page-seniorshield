const form = document.getElementById('simuladorForm');
const input = document.getElementById('mensajeInput');
const resultado = document.getElementById('resultadoDOM');

input.addEventListener('input', function() {
    resultado.textContent = "";
});

form.addEventListener('submit', function (e) {
    e.preventDefault(); 
    
    const mensaje = input.value.trim().toLowerCase();

    const mencionaUrgencia = mensaje.includes("urgente") || 
                             mensaje.includes("cuenta suspendida") || 
                             mensaje.includes("cuenta bloqueada") || 
                             mensaje.includes("actividad sospechosa") ||
                             mensaje.includes("tarjeta bloqueada") ||
                             mensaje.includes("verificar tus datos");

    const mencionaPremios = mensaje.includes("regalamos dinero") || 
                            mensaje.includes("ganaste") || 
                            mensaje.includes("premio") || 
                            mensaje.includes("oferta") ||
                            mensaje.includes("mitad de precio") ||
                            mensaje.includes("descuento");

    const mencionaPaquetes = mensaje.includes("paquete retenido") || 
                             mensaje.includes("entrega fallida") || 
                             mensaje.includes("no pudo ser entregado") ||
                             mensaje.includes("servicio de mensajería") ||
                             mensaje.includes("aduanas");

    const contieneEnlace = mensaje.includes("http") || 
                           mensaje.includes("www.") || 
                           mensaje.includes(".com") || 
                           mensaje.includes("link") || 
                           mensaje.includes("enlace") ||
                           mensaje.includes("ingresa aquí") ||
                           mensaje.includes("haz clic");

    if ((mencionaUrgencia || mencionaPremios || mencionaPaquetes) && contieneEnlace) {
        resultado.textContent = "¡Alerta Crítica! Es un patrón típico de estafa (engaño + enlace malicioso). Nunca hagas clic.";
        resultado.style.color = "#ff0000"; 
        resultado.style.fontWeight = "bold";
    } else if (mencionaUrgencia) {
        resultado.textContent = "Precaución: El mensaje genera un falso sentido de urgencia. Las entidades reales no amenazan por SMS.";
        resultado.style.color = "#ff8c00"; 
    } else if (mencionaPremios) {
        resultado.textContent = "Precaución: Promesa de premios o dinero fácil. Suele ser el gancho para un fraude.";
        resultado.style.color = "#ff8c00"; 
    } else if (mencionaPaquetes) {
        resultado.textContent = "Precaución: Aviso de paquetería sospechoso. Verifica directamente en la página oficial.";
        resultado.style.color = "#ff8c00"; 
    } else if (contieneEnlace) {
        resultado.textContent = "Advertencia: Contiene un enlace externo. No abras links de números desconocidos.";
        resultado.style.color = "#ff8c00"; 
    } else {
        resultado.textContent = "El mensaje no muestra patrones obvios de riesgo. De todos modos, mantén siempre la precaución.";
        resultado.style.color = "#008000"; 
    }
});
