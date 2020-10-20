<aside class="contenedor-proyectos">
        <div class="panel crear-proyecto">
            <a href="#" class="boton">Nuevo Proyecto <i class="fas fa-plus"></i> </a>
        </div>
    
        <div class="panel lista-proyectos">
            <h2>Proyectos</h2>
            <ul id="proyectos">
              <?php
                $proyectos = obtenerProyectos();
                if($proyectos){
                    foreach($proyectos as $proyecto){ ?>
                        <li>
                        <a href="index.php?id_proyecto=<?php echo $proyecto['id']?>" id="proyecto:<?php echo $proyecto ?>">
                        <?php echo $proyecto['nombre']?>
                            </a>
                        </li>


                 <?php   }
                }
              ?>
            </ul>


            
        </div>
        <!-- <div class="eliminar">
        <p>Eliminar un proyecto</p>
        <i class="fas fa-trash" id="<?php echo $id_proyecto; ?>" style="font-size: 50px; color:red; cursor: pointer;"></i>
        </div> -->
    </aside>