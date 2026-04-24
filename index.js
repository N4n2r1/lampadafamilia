let clienteWeb = null;
const clienteId = "Esp32RAP";
clienteWeb = new Paho.MQTT.Client(
    'broker.hivemq.com',
    8884, 
    clienteId
);

// 1. Função para travar ou destravar os botões
function travarBotoes(travar) {
    // Seleciona todos os botões (você pode colocar uma classe neles, ex: '.btn-lampada' se tiver outros botões na tela)
    const botoes = document.querySelectorAll('button'); 
    
    botoes.forEach(botao => {
        botao.disabled = travar; 
        // Se 'travar' for true, o botão fica cinza e in clicável. Se false, ele volta ao normal.
    });
}

// 2. Trava os botões logo que a página carrega, antes mesmo de tentar conectar
travarBotoes(true);

// 3. Configura o que acontece se a conexão cair no meio do uso
clienteWeb.onConnectionLost = function(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("Conexão perdida: " + responseObject.errorMessage);
        alert('Conexão com o servidor IoT caiu!');
        travarBotoes(true); // Trava os botões novamente
    }
};

// 4. Conecta ao Broker
clienteWeb.connect({
    useSSL: true,
    onSuccess: function(){
        alert('Conexão Ok');
        travarBotoes(false); // DESTRAVA os botões pois conectou com sucesso
    },
    onFailure: function() {
        alert('Conexão Falhou');
        travarBotoes(true); // MANTÉM os botões travados
    }
});

// --- Suas funções de ligar/desligar continuam exatamente iguais abaixo ---

function ligar_lampada_sala() {
    document.getElementById("lp-sala").classList.add('acesa');
    const msg = new Paho.MQTT.Message('');
    msg.destinationName = 'senai510/lampada/sala/ligar';
    clienteWeb.send(msg);
}

function desligar_lampada_sala() {
    document.getElementById("lp-sala").classList.remove('acesa');
    const msg = new Paho.MQTT.Message('');
    msg.destinationName = 'senai510/lampada/sala/desligar';
    clienteWeb.send(msg);
}

function ligar_lampada_cozinha() {
    document.getElementById("lp-cozinha").classList.add('acesa');
    const msg = new Paho.MQTT.Message('');
    msg.destinationName = 'senai510/lampada/cozinha/ligar'; 
    clienteWeb.send(msg);
}

function desligar_lampada_cozinha() {
    document.getElementById("lp-cozinha").classList.remove('acesa');
    const msg = new Paho.MQTT.Message('');
    msg.destinationName = 'senai510/lampada/cozinha/desligar'; 
    clienteWeb.send(msg);
}

function ligar_lampada_quarto1() {
    document.getElementById("lp-qt1").classList.add('acesa');
    const msg = new Paho.MQTT.Message('');
    msg.destinationName = 'senai510/lampada/quarto1/ligar'; 
    clienteWeb.send(msg);
}

function desligar_lampada_quarto1() {
    document.getElementById("lp-qt1").classList.remove('acesa');
    const msg = new Paho.MQTT.Message('');
    msg.destinationName = 'senai510/lampada/quarto1/desligar'; 
    clienteWeb.send(msg);
}

function ligar_lampada_quarto2() {
    document.getElementById("lp-qt2").classList.add('acesa');
    const msg = new Paho.MQTT.Message('');
    msg.destinationName = 'senai510/lampada/quarto2/ligar'; 
    clienteWeb.send(msg);
}

function desligar_lampada_quarto2() {
    document.getElementById("lp-qt2").classList.remove('acesa');
    const msg = new Paho.MQTT.Message('');
    msg.destinationName = 'senai510/lampada/quarto2/desligar'; 
    clienteWeb.send(msg);
}

function ligar_todas_lampadas() {
    // 1. Seleciona TODAS as lâmpadas que começam com o ID "lp-"
    // Isso pega lp-sala, lp-cozinha, lp-qt1 e lp-qt2 de uma vez só
    const lampadas = document.querySelectorAll('[id^="lp-"]'); 
    
    // 2. Acende cada uma delas visualmente
    lampadas.forEach(lp => {
        lp.classList.add('acesa');
    });

    // 3. Envia o comando MQTT mestre
    const msg = new Paho.MQTT.Message('');
    msg.destinationName = 'senai510/lampada/ligar'; 
    clienteWeb.send(msg);
}

function desligar_todas_lampadas() {
    // 1. Seleciona TODAS as lâmpadas
    const lampadas = document.querySelectorAll('[id^="lp-"]');
    
    // 2. Apaga cada uma delas visualmente
    lampadas.forEach(lp => {
        lp.classList.remove('acesa');
    });

    // 3. Envia o comando MQTT mestre
    const msg = new Paho.MQTT.Message('');
    msg.destinationName = 'senai510/lampada/desligar'; 
    clienteWeb.send(msg);
}


