let clienteWeb = null;
const clienteId = "Esp32RAP";
clienteWeb = new Paho.MQTT.Client(
    'broker.hivemq.com',
    8884, 
    clienteId
);

function modo_ladrao() {
    let tempoDecorrido = 0;
    const intervaloTempo = 300; 
    const tempoTotal = 5000;
    const body = document.body; // Referência para o fundo do site

    travarBotoes(true);

    const loopAlarme = setInterval(() => {
        const lampadas = document.querySelectorAll('[id^="lp-"]');
        const acao = (tempoDecorrido / intervaloTempo) % 2 === 0 ? 'ligar' : 'desligar';

        // 1. VIBRAÇÃO (Vibra forte quando 'liga' e para quando 'desliga')
        if (acao === 'ligar' && navigator.vibrate) {
            navigator.vibrate(200); 
        }

        // 2. BACKGROUND PISCANDO (Vermelho de alerta)
        if (acao === 'ligar') {
            body.style.backgroundColor = "#b30000"; // Vermelho escuro alerta
        } else {
            body.style.backgroundColor = "#000000"; // Volta para o preto
        }

        // 3. ATUALIZA VISUAL DAS LÂMPADAS
        lampadas.forEach(lp => {
            acao === 'ligar' ? lp.classList.add('acesa') : lp.classList.remove('acesa');
        });

        // 4. ENVIA MQTT MESTRE
        const msg = new Paho.MQTT.Message('');
        msg.destinationName = `senai510/lampada/${acao}`; 
        clienteWeb.send(msg);

        tempoDecorrido += intervaloTempo;

        if (tempoDecorrido >= tempoTotal) {
            clearInterval(loopAlarme);
            
            // RESET FINAL: Volta tudo ao normal
            body.style.backgroundColor = ""; 
            desligar_todas_lampadas();
            travarBotoes(false);
        }
    }, intervaloTempo);
}

// Função auxiliar para não repetir código
function atualizarFisico(comodo, acao) {
    // 1. Atualiza a tela
    const id = comodo === 'sala' || comodo === 'cozinha' ? `lp-${comodo}` : `lp-qt${comodo.slice(-1)}`;
    const el = document.getElementById(id);
    if(el) {
        acao === 'ligar' ? el.classList.add('acesa') : el.classList.remove('acesa');
    }

    // 2. Envia para o MQTT
    const msg = new Paho.MQTT.Message('');
    msg.destinationName = `senai510/lampada/${comodo}/${acao}`;
    clienteWeb.send(msg);
}

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

// Adiciona vibração a todos os botões da página automaticamente
document.querySelectorAll('button').forEach(botao => {
    botao.addEventListener('click', () => {
        if (navigator.vibrate) {
            navigator.vibrate(50); // Uma vibração bem curta para dar sensação de clique real
        }
    });
});

