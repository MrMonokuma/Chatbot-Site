const tag1 = 'Hola, ¿Cómo puedo ayudarte?';
const tag2 = 'Estoy bien, ¿y tú?';
const tag3 = "Estamos ubicados en la dirección: Cl. 25B #68b-02, Bogotá";
const tag4 = "Somos una aseguradora colombiana que apoya el desarrollo del país; dando seguridad a nuestros clientes con soluciones ajustadas a sus necesidades.";
const tag5 = ['Siempre a la orden', 'Para servirte'];

function getRespuesta(input) {
    const splitMensaje = input.toLowerCase().split(/[,:;.?!-_]\s*|\s+/);
    const respuesta = checkMensajes(splitMensaje);
    return respuesta;
}

function probabilidadMensaje(mensajeUsuario, palabrasReconocidas, respuestaSimple = false, palabrasRequeridas = []) {
    let certezaMensaje = 0;
    let hasPalabraRequerida = true;

    for (const word of mensajeUsuario) {
        if (palabrasReconocidas.includes(word)) {
            certezaMensaje++;
        }
    }

    const porcentaje = certezaMensaje / palabrasReconocidas.length;

    for (const word of palabrasRequeridas) {
        if (!mensajeUsuario.includes(word)) {
            hasPalabraRequerida = false;
            break;
        }
    }

    if (hasPalabraRequerida || respuestaSimple) {
        return Math.floor(porcentaje * 100);
    } else {
        return 0;
    }
}

function enviarBienvenida() {
    const bienvenida = "¡Bienvenido! Soy el chatbot de Seguros Bolívar. ¿En qué puedo ayudarte?";
    appendMessage(bienvenida, 'bot');
}

function checkMensajes(mensaje) {
    const probAlta = {};

    function response(respuestaBot, listaPalabras, respuestaSimple = false, palabrasRequeridas = []) {
        probAlta[respuestaBot] = probabilidadMensaje(mensaje, listaPalabras, respuestaSimple, palabrasRequeridas);
    }

    response(tag1, ['hola', 'klk', 'saludos', 'buenas'], true);
    response(tag2, ['como', 'estas', 'va', 'vas', 'sientes'], false, ['como']);
    response(tag3, ['ubicados', 'direccion', 'donde', 'ubicacion'], true);
    response(tag4, ['quienes', 'son', 'objetivo', 'hacen'], true);
    response(tag5[Math.floor(Math.random() * 2)], ['gracias', 'te lo agradezco', 'thanks'], true);

    const mejorMatch = Object.keys(probAlta).reduce((a, b) => probAlta[a] > probAlta[b] ? a : b);

    return probAlta[mejorMatch] < 1 ? desconocido() : mejorMatch;
}

function desconocido() {
    const respuestas = ['Puedes escribirlo de nuevo?', 'No estoy seguro de lo que quieres', 'Búscalo en Google a ver qué tal'];
    return respuestas[Math.floor(Math.random() * 3)];
}

const chatMessages = document.getElementById('chat-messages');
const inputBox = document.getElementById('input-box');
const sendButton = document.getElementById('send-button');

inputBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

sendButton.addEventListener('click', () => {
    sendMessage();
});

function sendMessage() {
    const input = inputBox.value;
    if (input.trim() !== '') {
        appendMessage(input, 'user');
        const response = getRespuesta(input);
        appendMessage(response, 'bot');
        inputBox.value = '';
    }
}

function appendMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    const avatar = document.createElement('span');
    avatar.classList.add('avatar');
    avatar.textContent = sender === 'user' ? 'U' : 'B'; 
    
    messageDiv.appendChild(avatar);
    
    const messageContent = document.createElement('div');
    messageContent.textContent = message;
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
}

sendButton.addEventListener('click', () => {
    const input = inputBox.value;
    appendMessage(input, 'user');
    const response = getRespuesta(input);
    appendMessage(response, 'bot');
    inputBox.value = '';
});