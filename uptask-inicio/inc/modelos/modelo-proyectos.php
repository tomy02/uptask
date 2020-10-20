<?php

$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];


if($accion === 'crear'){

  
    include '../funciones/conexion.php';

    try{
        //realizar consulta
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?)");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();
        if($stmt->affected_rows > 0){
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_proyecto' => $stmt->insert_id,
                'accion' => $accion,
                'nombre_proyecto' => $proyecto
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
            'error' => $e->getMessage()
        );
    }


    echo json_encode($respuesta);

}

if($accion === 'eliminar'){
    echo json_encode($_POST);
}
