eventListeners();

let listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {

    //document ready
    document.addEventListener('DOMContentLoaded', function() {
        actualizarProgreso();
    })

    //boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // //boton para eliminar proyecto
    // document.querySelector('.eliminar i').addEventListener('click', eliminarProyecto);

    //boton para nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    //botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
    e.preventDefault();

    //crear un input para escribir proyectos
    let nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = `
            <input type="text" id="nuevo-proyecto">
        `;
    listaProyectos.appendChild(nuevoProyecto);

    //seleccionar id de proyecto
    let inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //crear proyecto al presionar enter

    inputNuevoProyecto.addEventListener('keypress', (e) => {


        let tecla = e.wich || e.keyCode;

        if (tecla == 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });

}

function guardarProyectoDB(nombreProyecto) {
    //crear llamado a ajax usando xmlhttprequest
    let xhr = new XMLHttpRequest();
    //enviar datos por formdata
    let datos = new FormData();
    //agregar los atributos al objeto datos
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    //abrir la conexion, seleccionar el  metodo post para enviar datos y se enviaran a modelo-proyectos
    xhr.open('POST', 'inc/modelos/modelo-proyectos.php', true);
    //si al cargar todo es correcto debe imprimir los datos enviado por json
    xhr.onload = function() {
            if (this.status === 200) {
                let respuesta = JSON.parse((xhr.responseText));
                let proyecto = respuesta.nombre_proyecto;
                id_proyecto = respuesta.id_proyecto;
                accion = respuesta.accion;
                resultado = respuesta.respuesta;

                //comprobar insercion
                if (resultado === 'correcto') {
                    if (accion === 'crear') {
                        //inyectar en hmtl
                        let nuevoProyecto = document.createElement('li');
                        nuevoProyecto.innerHTML = `
                            <a href="index.php?id_respuesta=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                            </a>
                            `;
                        //agregar a html
                        listaProyectos.appendChild(nuevoProyecto);

                        swal({
                            title: 'Proyecto Creado',
                            text: 'El Proyecto ' + proyecto + 'se creo correctamente',
                            type: 'success'
                        }).then(result => {
                            if (result.value) {
                                //redireccionar al proyecto
                                window.location.href = "index.php?id_proyecto=" + id_proyecto;
                            }
                        });

                    } else {

                    }
                } else {
                    swal({
                        title: 'Error',
                        text: 'Ocurrio un Error',
                        type: 'error'
                    });
                }
            }
        }
        //enviar datos para que sean impresos
    xhr.send(datos);
}

//agregar tarea

function agregarTarea(e) {
    e.preventDefault();

    let nombreTarea = document.querySelector('.nombre-tarea').value;

    if (nombreTarea === '') {
        swal({
            title: 'Error',
            text: 'La tarea no puede ir vacia',
            type: 'error'
        });
    } else {
        //inserta en php

        //llamar a ajax
        let xhr = new XMLHttpRequest();
        //enviar datos por formdata
        let datos = new FormData();

        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);
        //abrir conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        //ejecutar
        xhr.onload = function() {
                if (this.status === 200) {
                    let respuesta = JSON.parse(xhr.responseText);
                    console.log(respuesta);

                    let resultado = respuesta.respuesta,
                        tarea = respuesta.nombre_tarea,
                        id_proyecto = respuesta.id_proyecto,
                        accion = respuesta.accion;

                    if (resultado === 'correcto') {
                        actualizarProgreso();
                        //se inserto correctamente
                        if (accion === 'crear') {
                            swal({
                                title: 'Tarea creada',
                                text: 'La Tarea ' + tarea + ' se creó correctamente',
                                type: 'success'
                            });
                            //construir template
                            let nuevaTarea = document.createElement('li');

                            nuevaTarea.id = 'tarea:' + id_proyecto;

                            nuevaTarea.classList.add('tarea');

                            nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                            `;

                            let listado = document.querySelector('.listado-pendientes ul');

                            listado.appendChild(nuevaTarea);

                            document.querySelector('.agregar-tarea').reset();
                        }
                    } else {
                        swal({
                            title: 'Error',
                            text: 'Hubo un Error',
                            type: 'error'
                        });
                    }
                }
            }
            //enviar consulta
        xhr.send(datos);

    }
}


//Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();

    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }

    if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "La tarea sera eliminada!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borralo!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                let tareaEliminar = e.target.parentElement.parentElement;
                //borrar de la base de datos
                eliminarTareaBD(tareaEliminar);

                //borrar de html
                tareaEliminar.remove();

                swal({
                    title: 'Eliminado',
                    text: 'Se elimino la tarea',
                    type: 'success'
                });
            }
        });
    }
}


//completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado) {
    let idTarea = tarea.parentElement.parentElement.id.split(':');

    //crear llamado a ajax
    let xhr = new XMLHttpRequest();
    //crea formdata 
    let datos = new FormData();

    //agregar datos
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    //abrir conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //al cargar los datos
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));

            actualizarProgreso();
        }
    }

    //enviar
    xhr.send(datos);
}



//eliminar tareas de la base de datos

function eliminarTareaBD(tarea) {

    let idTarea = tarea.id.split(':');
    //crear llamado a ajax
    let xhr = new XMLHttpRequest();
    //crea formdata 
    let datos = new FormData();

    //agregar datos
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');


    //abrir conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //al cargar los datos
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));

            actualizarProgreso();
        }
    }

    //enviar
    xhr.send(datos);
}


//actualizar avance del proyecto

function actualizarProgreso() {
    //obtener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');

    //obtener tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    //DETERMINAR   AVANCE   
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);



    const barraPorcentaje = document.querySelector('#porcentaje');

    barraPorcentaje.style.width = avance + '%';

}