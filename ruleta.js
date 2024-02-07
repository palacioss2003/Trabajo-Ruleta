/*RULETA*/
var options = [0, 32, 15, 10, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;
var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;
  
  red   = Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = Math.sin(frequency*item+4+phase) * width + center;
  
  return RGB2Color(red,green,blue);
}
function drawRouletteWheel() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
      var outsideRadius = 140;
      var textRadius = 110;
      var insideRadius = 90;
  
      ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 500, 500);
  
      ctx.strokeStyle = "Goldenrod"; // Color de trazo en negro
      ctx.lineWidth = 6;
  
      ctx.font = 'bold 12px Helvetica, Arial';
  
      var colorIndex = 0; // Variable para alternar entre colores
  
      for (var i = 0; i < options.length; i++) {
        var angle = startAngle + i * arc;
  
        // Definir colores
        var segmentColor = "";
        if (options[i] === 0) {
          segmentColor = "green"; // Número 0 en verde
        } else if (colorIndex === 0) {
          segmentColor = "red"; // Siguiente número en negro
          colorIndex = 1;
        } else {
          segmentColor = "black"; // Siguiente número en rojo
          colorIndex = 0;
        }
  
        ctx.beginPath();
        ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
        ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
        ctx.fillStyle = segmentColor; // Establece el color del segmento
        ctx.stroke();
        ctx.fill();
  
        ctx.save();
        ctx.shadowOffsetX = -1;
        ctx.shadowOffsetY = -1;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "rgb(220,220,220)";
  
        // Establece el color del texto
        var textColor =  "white"; // Texto en blanco para el número 0, de lo contrario, en negro
        ctx.fillStyle = textColor;
  
        ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
          250 + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        var text = options[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      }
  
      // Flecha
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
      ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
      ctx.fill();
    }
  }



function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();

}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

var numeros = [];
var numerosAlReves = [];
function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index];
  numeros.push(text);
  if (numeros.length > 25) {
    numerosAlReves = numeros.slice(-25).reverse(); // Obtiene los últimos 25 números y los invierte
    document.getElementById("numeros").innerHTML = numerosAlReves;

 
    console.log("Los 5 números más repetidos son:", numerosMasRepetidos);
  } else {
    document.getElementById("numeros").innerHTML = numeros.slice().reverse();
  }
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();

  validarApuestas(text);

}


function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

function selectChip(chip) {
    // Cambia el color de fondo cuando se selecciona
    if (chip.style.backgroundColor === "red") {
      chip.style.backgroundColor = "blue"; // Puedes cambiar el color seleccionado
    } else {
      chip.style.backgroundColor = "red"; // Cambia el color nuevamente al deseleccionar
    }
  }

drawRouletteWheel();


/*HORA*/
function mostrarHora() {
  var elementoHora = document.getElementById("crono");
  var fechaActual = new Date();
  var hora = fechaActual.getHours();
  var minutos = fechaActual.getMinutes();
  var segundos = fechaActual.getSeconds();

  // Agrega un cero delante si los minutos o segundos son menores que 10
  minutos = minutos < 10 ? "0" + minutos : minutos;
  segundos = segundos < 10 ? "0" + segundos : segundos;

  // Muestra la hora actual en el elemento con id "hora"
  elementoHora.textContent = hora + ":" + minutos + ":" + segundos;
}

setInterval(mostrarHora, 1000);





// Define una variable para llevar el seguimiento del tiempo transcurrido desde la última rotación
var tiempoTranscurrido = 0;

// Añade una función para iniciar la rotación de la ruleta
function iniciarRotacion() {
  // Restablece el tiempo transcurrido
  tiempoTranscurrido = 0;
  spin(); // Gira la ruleta
}

/*TEMPORIZADOR PARA GIRAR LA RULETA*/

// Agrega un intervalo que se ejecuta cada segundo para llevar el seguimiento del tiempo
setInterval(function () {
  tiempoTranscurrido++; // Incrementa el tiempo transcurrido
  // Comprueba si han transcurrido 30 segundos
  if (tiempoTranscurrido === 30) {
    iniciarRotacion(); // Inicia la rotación de la ruleta
  }
}, 1000); // Ejecuta cada segundo




/*BARRA DE PROGRESO*/
function barraProgreso() {
  var container = document.querySelector('.progress-bar-container');
  var progressBar = document.querySelector('.progress-bar');
  var interval = 50; // Intervalo de tiempo para actualizar la barra de progreso (en milisegundos)
  var tiempoTotal = 30 * 1000; // 30 segundos en milisegundos
  var incremento = (100 / (tiempoTotal / interval)); // Incremento en porcentaje

  var width = 0;
  var intervalID;
  function reiniciarBarra() {
    clearInterval(intervalID);
    width = 0;
    progressBar.style.width = '0%';
    barraProgreso();
  }
  intervalID = setInterval(function () {
      if (width >= 100) {
          clearInterval(intervalID);
      } else {
          width += incremento;
          progressBar.style.width = width + '%';
      }
  }, interval);

   // Simulación de la ruleta girando
   setTimeout(function () {
    reiniciarBarra();
}, 30000); // Ajusta el tiempo según sea necesario
}

barraProgreso();


/*BOTON INGRESAR DINERO*/

var nuevoSaldo = 0;
var fichaSaldo = 0;
var saldoInicial = 0;

function ingresarSaldo() {
  // Solicitar al usuario ingresar una cantidad de dinero
  var saldo = prompt("Por favor, ingresa la cantidad de dinero:");

  // Validar si se ingresó un valor y es un número
  if (saldo !== null && !isNaN(saldo)) {
      // Convertir la cantidad a número y actualizar el balance
      saldo = parseFloat(saldo);
      nuevoSaldo += saldo;
      fichaSaldo = nuevoSaldo * 10;

      calcularBeneficio();

      if (saldoInicial == 0) {
        guardarPrimarSaldo(saldo);
      }
      // Mostrar un mensaje con la cantidad ingresada y el nuevo balance
      alert("Has añadido " + saldoInicial + "€. Nuevo balance: " + nuevoSaldo.toFixed(2) +"€");
      //Hago toFixed(2) para mostrar el saldo con dos decimales
      actualizarSaldo();


    } else {
      // Mostrar un mensaje si no se ingresó un valor válido
      alert("Por favor, ingresa una cantidad válida.");
  }
};

document.getElementById('bot_ingresar').addEventListener('click', ingresarSaldo);

function guardarPrimarSaldo(saldo) {
  if (saldoInicial == 0) {
    saldoInicial = saldo;
    document.getElementById("num_beneficio").innerHTML = saldoInicial;
  }
}


/*BOTON RETIRAR SALDO*/
function retirarSaldo() {
  var retirar = prompt("Ingrese la cantidad que desea retirar:");

  if (retirar !== null && !isNaN(retirar)) {
    retirar = parseFloat(retirar);

    if (retirar <= nuevoSaldo) {
      nuevoSaldo -= retirar;
      fichaSaldo = nuevoSaldo * 10;

      alert("Has retirado " + retirar.toFixed(2) + "€. Nuevo balance: " + nuevoSaldo.toFixed(2) + "€");
      actualizarSaldo();
      calcularBeneficio();

    } else {
      alert("No tienes suficiente saldo para realizar este retiro.");
    }
  } else {
    alert("Por favor, ingresa una cantidad válida.");
  }
}

document.getElementById('cobrar').addEventListener('click', retirarSaldo);



function calcularBeneficio() {
  var diferencia = nuevoSaldo - saldoInicial;

  if (diferencia > 0) {
    document.getElementById("frios").innerHTML = diferencia.toFixed(2);
  } else if (diferencia < 0) {
    alert("Has tenido una pérdida de " + Math.abs(diferencia).toFixed(2) + "€");
  } else {
    alert("No ha habido cambios en el saldo.");
  }
}


/*NUMEROS CALIENTES*/
function numerosCalientes(numeros) {
  const frecuencia = {};
  let maxFrecuencia = 0;

  numeros.forEach(num => {
    frecuencia[num] = (frecuencia[num] || 0) + 1;
    if (frecuencia[num] > maxFrecuencia) {
      maxFrecuencia = frecuencia[num];
    }
  });

  const numerosRepetidos = [];
  for (let num in frecuencia) {
    if (frecuencia[num] === maxFrecuencia) {
      numerosRepetidos.push(parseInt(num));
    }
  }

  return {
    num: numerosRepetidos,
    frecuenciaMaxima: maxFrecuencia
  };
}

function mostrarCalientes(numeros){
  const resultados = numerosCalientes(numeros);
  window.alert("Los números más repetidos son:", resultados.num);
  console.log("Frecuencia máxima:", resultados.frecuenciaMaxima);
}

document.getElementById("boton13-24").addEventListener("click", verNumerosCalientes(numeros));


// Obtener los 5 números más repetidos


/*OBTENER VALORES DE LA TABLA*/









/*SELECCIONAR FICHAS*/









var fichaSeleccionada = 0;
var apuestas = [];
var apuestasEspeciales = [];


function seleccionarFichas(valor) {
  fichaSeleccionada = valor;
  window.alert("Has seleccionado la ficha " + valor);
}



class Apuesta {
  constructor(numero, cantidadApostada) {
    this.numero = numero;
    this.cantidadApostada = cantidadApostada;
  }
}


function agregarApuesta(numero) {
  if(fichaSeleccionada < fichaSaldo){
    var nuevaApuesta = new Apuesta(numero, fichaSeleccionada);
    apuestas.push(nuevaApuesta);

    
    actualizarApuesta();
    restarClick();
    document.getElementById("apostar").innerHTML = apuestas.length; // Actualizar el número de apuestas
  }else{
    alert("No tienes suficientes fichas para realizar esta apueta");
  }
}


function restarClick(){
  fichaSaldo -= fichaSeleccionada;
  var restSaldo = fichaSeleccionada/10; 
  nuevoSaldo -= restSaldo;
  actualizarSaldo();
}

function actualizarSaldo() {
  document.getElementById("euros").innerHTML = nuevoSaldo.toFixed(2) + " €";
  document.getElementById("euro").innerHTML = nuevoSaldo.toFixed(2) + " €";
  document.getElementById("tipo_ficha").innerHTML = fichaSaldo;
}


function actualizarApuesta() {
  var apuestasHTML = '';
  apuestas.forEach(apuesta => {
    apuestasHTML += `${apuesta.numero}, `;
  });
  document.getElementById("num_apos").innerHTML = apuestasHTML;
}

function validarApuestas(text) {
  let acierto = false;
  let premioTotalFichas = 0;
  var premioTotalSaldo = 0;
 


  for (let i = 0; i < apuestas.length; i++) {
    if (apuestas[i].numero == text) {
      acierto = true;
      premioTotalFichas = premioTotalFichas +(apuestas[i].cantidadApostada * 3.6);
      premioTotalSaldo = premioTotalSaldo +(apuestas[i].cantidadApostada * 0.36);

      document.getElementById("frios").innerHTML = apuestas[i].cantidadApostada;
    } else {
    }
  }

  if (acierto) {
    fichaSaldo = fichaSaldo + premioTotalFichas; // Sumar el premio al saldo si hubo acierto
    nuevoSaldo = nuevoSaldo + premioTotalSaldo;
    window.alert("¡Felicidades! Has acertado el número "+ text + " y has ganado "+ premioTotalFichas +" fichas.");
  } else {
    window.alert(`El número ganador fue ${text}. No has acertado ningún número.`);
  }

  actualizarSaldo(); // Actualizar el saldo mostrado en la interfaz
}
 



var numButtons = 37; // 36 numbered buttons (0 to 36) plus an extra button
var apuestaButtons = [];

for (var i = 0; i < numButtons; i++) {
  var buttonId = (i === 37) ? "bot0" : "boton" + i;
  var button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener("click", function(event) {
      var btnNumber = parseInt(event.target.id.replace('boton', ''));
      agregarApuesta(btnNumber);
      window.alert("Has pulsado el botón con número " + btnNumber);
    }, false);
    apuestaButtons.push(button);
  }
}


document.getElementById("ficha1").addEventListener("click", function(){
  seleccionarFichas(10);
}, false);

document.getElementById("ficha2").addEventListener("click", function(){
  seleccionarFichas(50);
}, false);

document.getElementById("ficha3").addEventListener("click", function(){
  seleccionarFichas(100);
}, false);

document.getElementById("ficha4").addEventListener("click", function(){
  seleccionarFichas(500);
}, false);

document.getElementById("agregarApuestaBtn").addEventListener("click", function(){
  var numero = parseInt(document.getElementById("numeroApuesta").value);
  agregarApuesta(numero);
}, false);


var num_rojos = [1,3,5,7,9,12,16,18,19,21,23,25,27,30,32,34,36];
var num_negros = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
var uno13 = [1,2,3,4,5,6,7,8,9,10,11,12];
var trece24 = [13,14,15,16,17,18,19,20,21,22,23,24];
var veinticinco36 = [25,26,27,28,29,30,31,32,33,34,35,36];




document.getElementById("boton25-36").addEventListener("click", function(){
  seleccionarFichasEspeciales("25-36");
}, false);

document.getElementById("boton2to1_1").addEventListener("click", function(){
  seleccionarFichasEspeciales("1-12");
}, false);

document.getElementById("boton2to1_2").addEventListener("click", function(){
  seleccionarFichasEspeciales("1-12");
}, false);

document.getElementById("boton2to1_3").addEventListener("click", function(){
  seleccionarFichasEspeciales("1-12");
}, false);

document.getElementById("boton1-10").addEventListener("click", function(){
  seleccionarFichasEspeciales("1-12");
}, false);

document.getElementById("botonEVEN").addEventListener("click", function(){
  seleccionarFichasEspeciales("1-12");
}, false);

document.getElementById("boton_romboR").addEventListener("click", function(){
  seleccionarFichasEspeciales("1-12");
}, false);

document.getElementById("boton_romboN").addEventListener("click", function(){
  seleccionarFichasEspeciales("1-12");
}, false);

document.getElementById("boton_romboN").addEventListener("click", function(){
  seleccionarFichasEspeciales("1-12");
}, false);

document.getElementById("boton_romboN").addEventListener("click", function(){
  seleccionarFichasEspeciales("1-12");
}, false);

document.getElementById("boton_romboN").addEventListener("click", function(){
  seleccionarFichasEspeciales("1-12");
}, false);







/*MODAL*/
/*
<html>
<head>
  <title>Modal con Listeners</title>
  <style>
    Estilos para el modal y fondo oscuro 
    .modal {
      display: none;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.7);
    }

    .modal-content {
      background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
    }

    .close-modal-btn {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }

    .close-modal-btn:hover,
    .close-modal-btn:focus {
      color: black;
      text-decoration: none;
    }
  </style>
</head>
<body>

<button class="open-modal-btn">Abrir Modal</button>

<!-- El modal -->
<div id="myModal" class="modal">
  <div class="modal-content">
    <span class="close-modal-btn">&times;</span>
    <p>Contenido del modal...</p>
    <p>Más información o acciones aquí...</p>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Obtener el botón de abrir modal y el modal
  var openModalButton = document.querySelector('.open-modal-btn');
  var modal = document.getElementById('myModal');

  // Obtener el botón de cerrar modal
  var closeModalButton = modal.querySelector('.close-modal-btn');

  // Función para abrir el modal
  function openModal() {
    modal.style.display = 'block';
  }

  // Función para cerrar el modal
  function closeModal() {
    modal.style.display = 'none';
  }

  // Evento al hacer clic en el botón de abrir modal
  openModalButton.addEventListener('click', openModal);

  // Evento al hacer clic en el botón de cerrar modal
  closeModalButton.addEventListener('click', closeModal);

  // Cerrar el modal si el usuario hace clic fuera de él
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
});
</script>

</body>
</html>
*/