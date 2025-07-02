# Proyecto 1 
#### Sistemas Operativos 1
#### Kevin Golwer Enrique Ruiz Barbales 201603009

<img src="https://iipsgt.files.wordpress.com/2014/11/logo-usac-byempacharte.png"  style="width:150px;margin:auto"/>


#### Introduccion

El siguiente sistema tiene como finalidad monitorea los recursos de cpu y ram de maquinas virtuales en la nube ,se creo un grupo de instancias a partir de una imagen personalizada que cuenta con las configuraciones y metadatos necesarios para poder ejecutar los servicios necesarios al momento de levantar una instancia en el grupo ,tambien se creo otra maquina que es la master ,la cual cuenta con 3 servicios un front hecho en react ,una api hecha en nodejs y una base de datos en mysql , todo esto para poder guardar, obtener y enviar informacion de las maquinas


## Kernel Linux

para empezar tendremos 3 modulos kernel creados en c , los cuales tendremos que compilar e insertar en el kernel de linux ,el modulo lo tendremos que compilar en la maquina a usar, ya que si usamos el archivo compilado en otra maquina no nos funcionara, el archivo compilado tendra la extension (.ko), para insertar el modulo kernel usaremos el comando "insmod nombre_del_modulo" y para quitarlo usaremos "rmmod nombre_del_modulo" ,teniendo listos los modulos los colocaremos en la maquina plantilla para obtener la informacion del cpu ,ram y procesos


## Maquina Master

Se debe levantar los servicios en la maquina master, en ella se encuentran tres contenedores : Frontend(React) ,Backend(Nodejs) ,BD(Mysql) ,esta nos servira para poder mostrar y almacenar los datos que recibamos de las demas maquinas ,usaremos docker-compose para levatantar nuestros 3 contenedores:


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-52-22.png?raw=true"  style="width:800px"/>

Aca ya tendremos los 3 contenedores corriendo en la nube listo para usar, para poder acceder tendremos que usar la ip publica de la maquina virtual y exponer el puerto del frontend para poder visualizar los datos :

<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-52-51.png?raw=true"  style="width:800px"/>



## Interfaz Grafica

cuando ya tengamos levantados nuestros servicios en la maquina master ,accederemos a la aplicacion por medio de la ip publica donde nos mostrara un menu sencillo donde podremos seleccionar la maquina de la cual queremos ver sus graficas de rendimiento


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-53-19.png?raw=true"  style="width:800px"/>

tambien si necesitamos actualizar el listado de maquinas ,podemos presionar en actualizar y se actualizara nuestro listado

## Maquinas Virtuales

como se muestra en la imagen, hay una maquina que se llama: <strong>instance-2</strong> esta es la maquina master donde tenemos los servicios para mostrar y guardar nuestros datos y la que dice <strong>plantilla</strong> es la maquina de la cual obtendremos la imagen personalizada para crear nuestro grupo de instancias a monitorear


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-54-25.png?raw=true"  style="width:800px"/>


## Plantilla de Instancia
tendremos que crear una imagen de la maquina (plantilla) ,de preferencia tendremos que detener la maquina para que el snapshot que tengamos sea optimo y no de problemas,una vez creada la imagen se debe crear una plantilla de instancia , con ella podremos crear luego nuestro grupo de instancias , como se muestra en la imagen:


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-54-45.png?raw=true"  style="width:800px"/>


adicional a eso , se debe de configurar los comandos que necesitemos ejecutar al momento de iniciar nuestra maquina ,en este caso debera cargar los modulos kernel que son los que obtienen la informacion de nuestra maquina y levantar el servicio de docker-compose para poder empezar a enviar datos a la maquina master


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-55-02.png?raw=true"  style="width:800px"/>



## Grupo de Instancias

ya creada la plantilla entonces procedemos a crear el grupo de instancias , configuraremos la cantidad de maquinas minimas y maximas que necesitaremos , luego asignaremos el en base a que debe de crear otra maquina , en este caso tomaremos de base el uso del cpu al 60% , y por ultimo elegiremos la plantilla que creamos anteriormente , por ultimo procederemos a crearlo esto nos creara la cantidad de instancias minima , en nuestro caso sera una maquina



<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-58-00.png?raw=true"  style="width:800px"/>



## Servicios Monitoreados


ahora que esta creado nuestro grupo de instancias y nuestra maquina maesetra nos mostrara las maquinas creadas en la interfaz grafica , como se muestra en la imagen:


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-54-15.png?raw=true"  style="width:800px"/>


podremos visualizar el uso del CPU y RAM de la maquina seleccionada en una grafica circular , ademas de eso nos mostrara el listado de procesos de la maquina como se muestra en la imagen:


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2018-05-43.png?raw=true"  style="width:800px"/>


tambien podremos visualizar los datos de cpu y de ram de la maquina virtual seleccionada,en un grafico de lineas en el tiempo, en el podremos ver el desempeno de la maquina , para nuestro caso si el porcentaje de RAM o CPU llega al 60% automaticamente nos creara otra maquina virtual automaticamente para balancear nuestra carga:

<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2018-06-00.png?raw=true"  style="width:800px"/>


## Archivo YML

con el siguiente archivo se levanta la instancia en la maquina master:

```YML
version: '3.3'
services:
  db:
    container_name: db
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_DATABASE: 'proyecto_1'
      # So you don't have to use root, but you can if you like
      MYSQL_USER: 'usuario'
      # You can use whatever password you like
      MYSQL_PASSWORD: 'password'
      # Password for root access
      MYSQL_ROOT_PASSWORD: 'password'
      
    healthcheck:
      test: ["CMD", "mysqladmin" ,"ping", "-h", "localhost"]
      timeout: 1s
      retries: 1
      
    ports:
      # <Port exposed> : <MySQL Port running inside container>
      - '3306:3306'
    expose:
      # Opens port 3306 on the container
      - '3306'
      # Where our data will be persisted
    volumes:
      - mydb_temp:/var/lib/mysql
    networks:
     db_network:
       ipv4_address: 197.0.0.2
       
       
      
      
      
  api:
    container_name: api
    image: api_proyecto_1
    depends_on:
      - db
    ports:
      - '8080:8080'
    links: 
      - db
    environment:
      MYSQL_IP: 197.0.0.2
    networks:
     db_network:
       ipv4_address: 197.0.0.3  
      


    
    
  front:
    container_name: front
    image: front_proyecto_1
    depends_on:
      - api
    ports:
      - '80:80'
    links: 
      - api
    environment:
      REACT_APP_IP: 197.0.0.2
    networks:
     db_network:
       ipv4_address: 197.0.0.4
      
      

      
      
networks:
  db_network:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 197.0.0.0/24


# Names our volume
volumes:
  mydb_temp: 
```












