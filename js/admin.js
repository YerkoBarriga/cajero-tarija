
//********************Actualizar hora pantalla********************* 
function actualizarHora() {
    const fecha = new Date();
    const hora = fecha.getHours();
    const minuto = fecha.getMinutes();
    const segundo = fecha.getSeconds();
    const horaFormateada = `${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto}:${segundo < 10 ? '0' : ''}${segundo}`;

    const horaO = document.getElementById('hora');
    horaO.innerHTML = `<p>${horaFormateada}</p>`;
}

// Actualizar la hora cada segundo
setInterval(actualizarHora, 1000);
// Ejecutar la función una vez al cargar la página para mostrar la hora inicial
actualizarHora();
   
   
   /*recuperamos valores de la url actual*/
function valoresURL(){
    //el .searc recupera los valores de la url actual
    const ACTUAL_URL =  window.location.search;
    // creamos un nuevo objeto para manipular los parametros de amanera mas facil.donde  podria utlizar get o set
    const PARAMETROS_URL    =  new URLSearchParams(ACTUAL_URL);
    /*
    Convierte los pares clave-valor en un objeto JavaScript   
     */
    return Object.fromEntries(PARAMETROS_URL.entries());
}
// Recuperar parámetros de la URL
const parametros = valoresURL();
const USER      = parametros.user;
const CUENTA    = parametros.cuenta;
const NOMBRE    = parametros.nombre;
const APELLIDOS = parametros.ap;
const CORREO    = parametros.correo;
let   saldo     = parseFloat(parametros.saldo);


// datos para el detalle de transacciones

let depositos=[];
let retiros =[];
//


// Mostrar los datos en la página
const datosUsuarioElement = document.getElementById('userUser');
const datoCuenta          = document.getElementById('idCuenta');
const datoSaldo           = document.getElementById('idSaldo'); 
const datoSaldoTotal      = document.getElementById('idSaldoTotal');   
console.log(datosUsuarioElement);
// Insertar HTML en el elemento con los datos del usuario
datosUsuarioElement.innerHTML =` ${NOMBRE} ${APELLIDOS}`;
datoCuenta.innerHTML          = `<p> ${CUENTA}</p>`;
datoSaldo.innerHTML           = `<p> ${saldo}</p>`;
datoSaldoTotal.innerHTML      = `<p> ${saldo}</p>`;

function ingresarMonto(){
    let moneda;
    Swal.fire({
        title: 'Ingrese el monto a depositar',
        html:
            '<input type="number" id="swal-input1" class="swal2-input" placeholder="Ingrese su nombre">' +
            '<select id="swal-input2" class="swal2-input">' +
            '<option value="seleccionar">Seleccionar</option>' +
            '<option value="bs">bolivianos(bs)</option>' +
            '<option value="dollar">dolares($)</option>' +
            '</select>',
        showCancelButton: true,
        cancelButtonColor: '#d33', 
        focusConfirm: false,
        preConfirm: () => {
           
            const inputValue1 = document.getElementById('swal-input1').value;
            const inputValue2 = document.getElementById('swal-input2').value;
            if (parseFloat(inputValue1) < 9) {
                Swal.showValidationMessage('Por favor, el monto tiene que ser superior a 10');
            }
            if (parseFloat(inputValue1) > 6840) {
                Swal.showValidationMessage('Por favor, el monto no tiene que ser superior 6840');
            }
            if (!/^\d+$/.test(inputValue1)) {
                Swal.showValidationMessage('Por favor, ingrese solo números en el primer campo');
              }

            if ((parseFloat(inputValue1) + parseFloat(saldo)) > 6840 ) {
                
                Swal.showValidationMessage('el monto no se puede depositar por que excede al monto limite de 6840bs ($990) ');
            }
            if(inputValue2==="dollar"){
                let numeroVerificar =   (parseFloat(inputValue1)*6.91) + parseFloat(saldo);
                if (numeroVerificar > 6840) {
                    Swal.showValidationMessage('el monto no se puede depositar por que excede al monto limite de 6840bs ($990) ');
                }
            }
            if(inputValue2==="seleccionar"){
                Swal.showValidationMessage('Por favor, Seleccione el tipo de moneda a depositar');
            }
            return [inputValue1, inputValue2];
        }
    }).then((result) => {
        if (result.value) {
            const [nombre, opcionSeleccionada] = result.value;

            // Registrar la transacción
            const fecha = new Date();
            const hora = fecha.getHours();
            const minuto = fecha.getMinutes();
            const segundo = fecha.getSeconds();
            const horaTransaccion = `${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto}:${segundo < 10 ? '0' : ''}${segundo}`;
            const tipoTransaccion = 'Depósito';
            // Agregar la transacción al historial de depósitos
            depositos.push({
                hora: horaTransaccion,
                tipo: tipoTransaccion,
                monto: parseFloat(nombre),
                moneda: opcionSeleccionada
            });
            // Actualizar la tabla de detalles
            actualizarTablaDetalles();
            if(opcionSeleccionada === "dollar"){
                // Sumar el monto ingresado al saldo
                saldo += parseFloat(nombre)*6.96;
                // Actualizar el valor de saldo en los elementos HTML
                datoSaldo.innerHTML = `<p> ${saldo}</p>`;
                datoSaldoTotal.innerHTML = `<p> ${saldo}</p>`;
                Swal.fire('¡Datos ingresados!', `Nombre: ${nombre}, Opción seleccionada: ${opcionSeleccionada}`, 'success');

            }else{
                // Sumar el monto ingresado al saldo
                saldo += parseFloat(nombre);
                // Actualizar el valor de saldo en los elementos HTML
                datoSaldo.innerHTML = `<p> ${saldo}</p>`;
                datoSaldoTotal.innerHTML = `<p> ${saldo}</p>`;
                Swal.fire('¡Datos ingresados!', `Nombre: ${nombre}, Opción seleccionada: ${opcionSeleccionada}`, 'success');
            }
            


            
        }
    });    
}
function actualizarTablaDetalles() {
    const tablaDetalles = document.getElementById('tablaDetalles');
    const tbody = tablaDetalles.getElementsByTagName('tbody')[0];
    // Limpiar el contenido actual de la tabla
    tbody.innerHTML = '';
    // Agregar filas según el historial de depósitos
    depositos.forEach((transaccion) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${transaccion.hora}</td><td>${transaccion.tipo}</td><td>${transaccion.monto} ${transaccion.moneda}</td>`;
        tbody.appendChild(fila);
    });
    retiros.forEach((transaccion) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${transaccion.hora}</td><td>${transaccion.tipo}</td><td>${transaccion.monto} ${transaccion.moneda}</td>`;
        tbody.appendChild(fila);
    });
}
function retirarMonto(){
    Swal.fire({
        title: 'Ingrese el monto a retirar',
        html:
            '<input type="number" id="swal-input1" class="swal2-input" placeholder="Ingrese su nombre">' +
            '<select id="swal-input2" class="swal2-input">' +
            '<option value="seleccionar">Seleccionar</option>' +
            '<option value="bs">bolivianos(bs)</option>' +
            '<option value="dollar">dolares($)</option>' +
            '</select>',
        showCancelButton: true,
        cancelButtonColor: '#d33', 
        focusConfirm: false,
        preConfirm: () => {
           
            const inputValue1 = document.getElementById('swal-input1').value;
            const inputValue2 = document.getElementById('swal-input2').value;
            
            if (!/^\d+$/.test(inputValue1)) {
                Swal.showValidationMessage('Por favor, ingrese solo números en el primer campo');
              }
            if (parseFloat(inputValue1)>0) {
                let numeroVerificar = parseFloat(saldo) - parseFloat(inputValue1);
                if (numeroVerificar <= 69) {
                    Swal.showValidationMessage('el monto no se puede retirar por que minimamente debe tener un saldo de 69(bs) ($10) ');
                }
            }
            if(inputValue2==="dollar"){
                let numeroVerificar = parseFloat(saldo) - (parseFloat(inputValue1)*6.91);
                if (numeroVerificar <= 69) {
                    Swal.showValidationMessage('el monto no se puede retirar por que minimamente debe tener un saldo de 69(bs) ($10) ');
                }
            }
            if(inputValue2==="seleccionar"){
                Swal.showValidationMessage('Por favor, Seleccione el tipo de moneda a depositar');
            }

            return [inputValue1, inputValue2];
        }
    }).then((result) => {
        if (result.value) {
            const [nombre, opcionSeleccionada] = result.value;
            const fecha = new Date();
            const hora  = fecha.getHours();
            const min   = fecha.getMinutes();
            const seg   = fecha.getSeconds();
            const horaTransaccion = `${hora < 10 ? '0' : ''}${hora}:${min < 10 ? '0' : ''}${min}:${seg < 10 ? '0' : ''}${seg}`;
            const tipoTransaccion = 'Retiro';
            //agregamos un objeto a mi array
            retiros.push({
                hora: horaTransaccion,
                tipo: tipoTransaccion,
                monto: parseFloat(nombre),
                moneda: opcionSeleccionada
            });
            actualizarTablaDetalles();
            if (opcionSeleccionada ==="dollar"){
                // Sumar el monto ingresado al saldo
                saldo -=( parseFloat(nombre) * 6.96);
                // Actualizar el valor de saldo en los elementos HTML
                datoSaldo.innerHTML = `<p> ${saldo}</p>`;
                datoSaldoTotal.innerHTML = `<p> ${saldo}</p>`;
                Swal.fire('¡Datos ingresados!', `Nombre: ${nombre}, Opción seleccionada: ${opcionSeleccionada}`, 'success');
            }else{
                // Sumar el monto ingresado al saldo
                saldo -= parseFloat(nombre);
                // Actualizar el valor de saldo en los elementos HTML
                datoSaldo.innerHTML = `<p> ${saldo}</p>`;
                datoSaldoTotal.innerHTML = `<p> ${saldo}</p>`;
                Swal.fire('¡Datos ingresados!', `Nombre: ${nombre}, Opción seleccionada: ${opcionSeleccionada}`, 'success');
            }
             
        }
    });    
}

function mostrarTabla() {
    // Obtener el elemento de la tabla por su ID
    const tablaDetalles = document.getElementById('tablaDetalles');

    // Verificar si la tabla está actualmente visible
    const tablaEstaVisible = tablaDetalles.style.display === 'table';

    // Cambiar el estado de visibilidad de la tabla
    if (tablaEstaVisible) {
        // Si la tabla está visible, ocultarla
        ocultarTabla(tablaDetalles);
    } else {
        // Si la tabla está oculta, mostrarla
        verTabla(tablaDetalles);
    }
}
function verTabla(tabla) {
    // Establecer el estilo para hacer la tabla visible
    tabla.style.display = 'table';
}

function ocultarTabla(tabla) {
    // Establecer el estilo para ocultar la tabla
    tabla.style.display = 'none';
}

