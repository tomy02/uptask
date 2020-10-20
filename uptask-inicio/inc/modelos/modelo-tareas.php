<?php

$accion = $_POST['accion'];
$nombre = $_POST['tarea'];
$id_proyecto = (int) $_POST['id_proyecto'];
$estado = $_POST['estado'];
$id_tarea = $_POST['id'];

if($accion === 'crear'){

  
    include '../funciones/conexion.php';

    try{
        //realizar consulta
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?)");
        $stmt->bind_param('si', $nombre, $id_proyecto);
        $stmt->execute();
        if($stmt->affected_rows > 0){
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_proyecto' => $stmt->insert_id,
                'accion' => $accion,
                'nombre_tarea' => $nombre
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
if($accion === 'actualizar'){

    include '../funciones/conexion.php';

    try{
        //realizar consulta
        $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ? ");
        $stmt->bind_param('ii', $estado, $id_tarea);
        $stmt->execute();
        if($stmt->affected_rows > 0){
            $respuesta = array(
                'respuesta' => 'correcto'
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

    include '../funciones/conexion.php';

    try{
        //realizar consulta
        $stmt = $conn->prepare("DELETE FROM tareas  WHERE id = ? ");
        $stmt->bind_param('i', $id_tarea);
        $stmt->execute();
        if($stmt->affected_rows > 0){
            $respuesta = array(
                'respuesta' => 'correcto'
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

// echo json_encode($_POST);