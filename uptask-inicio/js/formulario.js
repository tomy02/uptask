eventListeners()

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    let usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    if (usuario == "" && password == "") {
        swal({
            type: 'error',
            title: 'Oops',
            text: 'Parece que no has llenado todos los campos'
        });
    } else {
        //datos que se envian al servidor
        let datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        //crear llamado a ajax
        let xhr = new XMLHttpRequest();
        //abrir conexion
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        // retorno de datos
        xhr.onload = function() {
            if (this.status === 200) {
                let respuesta = JSON.parse(xhr.responseText);

                console.log(respuesta);
                if (respuesta.respuesta === 'correcto') {

                    //si es nuevo usuario
                    if (respuesta.tipo === 'crear') {
                        swal({
                            title: 'Usuario Creado',
                            text: 'El Usuario se creo correctamente',
                            type: 'success'
                        });
                    } else if (respuesta.accion === 'login') {
                        swal({
                            title: 'Login Correcto',
                            text: 'Presiona OK para acceder',
                            type: 'success'
                        }).then(result => {
                            if (result.value) {
                                window.location.href = 'index.php';

                            }
                        });
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

        //enviar peticion
        xhr.send(datos);
    }
}