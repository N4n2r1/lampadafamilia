let clienteWeb = null
const clienteId = "Esp32RAP"
clienteWeb = new Paho.MQTT.Client(
    'broker.hivemq.com',
    8884, 
    clienteId
)

clienteWeb.connect({
    useSSL: true,
    onSuccess: function(){
        alert('Conexão Ok')
    },
    onFailure: function() {
        alert('Conexão Falhou')
    }
})

function ligar_lampada_sala() {

    document.getElementById("lp-sala").classList.add('acesa')
    
    const msg = new Paho.MQTT.Message('')
    msg.destinationName = 'senai510/lampada/sala/ligar'
    clienteWeb.send(msg)

}

function desligar_lampada_sala() {

    document.getElementById("lp-sala").classList.remove('acesa')

    const msg = new Paho.MQTT.Message('')
    msg.destinationName = 'senai510/lampada/sala/desligar'
    clienteWeb.send(msg)

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