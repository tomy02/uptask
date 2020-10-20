<?php
   
//    die(json_encode($_POST));

    $usuario = $_POST['usuario'];
    $password = $_POST['password'];
    $accion = $_POST['accion'];
  

if($accion === 'crear'){

    //hashear passwords
    $opciones = array(
        'cost' => 12
    );
   $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
    //importar la conexion

    include '../funciones/conexion.php';

    try{
        //realizar consulta
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?,?)");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        if($stmt->affected_rows > 0){
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'accion' => $accion
            );
        }else{
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();

    }catch(Exception $e){
        //tomar la escepcion
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }


    echo json_encode($respuesta);

}



if($accion === 'login'){
   
    include '../funciones/conexion.php';

    try{
        $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ? ");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        //logear usuario
        //bind result inserta los resultados obtenidos en las siguientes variables
        $stmt->bind_result($nombre_usuario, $id_usuario, $password_usuario);
        //fetch trae los resultados que se insertaron
        $stmt->fetch();
        //insertar el contenido de fetch en un array de respuesta
       if($nombre_usuario){

        //verificar password
        if(password_verify($password, $password_usuario)){

            //iniciar la sesion
            session_start();
            $_SESSION['nombre'] = $usuario;
            $_SESSION['id'] = $id_usuario;
            $_SESSION['login'] = true;

            //login correct
            $respuesta = array(
                'respuesta' => 'correcto',
                'nombre' => $nombre_usuario,
                'accion' => $accion //al poner tipo accion, en este caso sera login, y como eso se manda al js podra ejecutarse el codigo para redireccionarlo
            );
        }else{
            //login incorrecto
            $respuesta = array(
                'resultado' => 'password incorrecto'
            );
        }
           
    }else{
        $respuesta = array(
            'error' => 'El Usuario no existe'
        );
    }

        $stmt->close();
        $conn->close();

    }catch(Exceptio $e){
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}