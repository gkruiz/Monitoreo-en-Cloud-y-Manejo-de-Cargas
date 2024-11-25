# Proyecto 1 
### Sistemas Operativos 1
### Kevin Golwer Enrique Ruiz Barbales 201603009
<div style='width:100%;text-align:center;justify-content:center'>
  <img src="https://iipsgt.files.wordpress.com/2014/11/logo-usac-byempacharte.png"  style="height: 300px; width:300px;margin:auto"/>
</div>
so1_proyecto1_2S2023_201603009



# Introduccion

en el siguiente proyeto se desarrollo un sistema que monitorea maquinas virtuales en la nube , 
se creo un grupo de instancias a partir de una imagen personalizada que cuenta con las configuraciones y metadatos necesarios para
poder ejecutar los servicios necesarios al momento de levantar una instancia en el grupo , 
tambien se creo otra maquina que es la master ,la cual cuenta con 3 servicios un front hecho en react ,una api hecha en nodejs y una base de datos
en mysql , todo esto para poder guardar, obtener y enviar informacion de las maquinas


# Inicio

para iniciar se debe de levantar la maquina master , esta cuenta con 3 servicios , un frontend desarrollado en react 
una api hecha en nodejs y una base de datos en mysql , estos tres servicios estan dockerizados , lo que significa que 
cada uno es un contenedor individual y estos se intercomunican entre si a traves de una red interna , 
para levantar los 3 contenedores se usa docker-compose como se muestra en la imagen

<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-52-22.png?raw=true"  style="height: 600px; width:2000px;"/>



<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-52-51.png?raw=true"  style="height: 600px; width:2000px;"/>



# Interfaz Grafica

cuando se levantan los servicios en la maquina master , automaticamente se despliega una interfaz que sirve para mostrar la informacion de cada maquina que se va iniciando 
como se muestra en la imagen:


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-53-19.png?raw=true"  style="height: 600px; width:2000px;"/>


# Maquinas Virtuales

como se muestra en la imagen, hay una maquina que se llama: <strong>instance-2</strong>  , esta es la maquina master y la que dice <strong>plantilla</strong> es la maquina de la cual creamos la imagen personalizada para el grupo de instancias 


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-54-25.png?raw=true"  style="height: 600px; width:2000px;"/>


# Plantilla de Instancia

una vez creada la imagen se debe crear una plantilla de instancia , con ella podremos crear luego nuestro grupo de instancias , como se muestra en la imagen:


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-54-45.png?raw=true"  style="height: 600px; width:2000px;"/>


adicional a eso , se debe de configurar los comandos que debe ejecutar al momento de iniciar la maquina , en este caso debera cargar los modulos kernel y levantar el servicio de docker-compose para poder empezar a enviar datos a
la maquina master 


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-55-02.png?raw=true"  style="height: 600px; width:2000px;"/>



# Grupo de Instancias

ya creada la plantilla entonces procedemos a crear el grupo de instancias , configuraremos la cantidad de maquinas minimas y maximas que necesitaremos , luego asignaremos el en base a que 
debe de crear otra maquina , en este caso tomaremos de base el uso del cpu al 60% , y por ultimo elegiremos la plantilla que creamos anteriormente , por ultimo procederemos a crearlo 
esto nos creara la cantidad de instancias minima , en nuestro caso sera una maquina 



<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-58-00.png?raw=true"  style="height: 600px; width:2000px;"/>



# Servicios Monitoreados


ahora que esta creado nuestro grupo nos mostrara las maquinas cargadas en la interfaz grafica , como se muestra en la imagen:


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2017-54-15.png?raw=true"  style="height: 600px; width:2000px;"/>


podremos visualizar el uso del CPU y RAM de la maquina seleccionada en una grafica circular , ademas de eso nos mostrara el listado de procesos de la maquina como se muestra en la imagen:


<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2018-05-43.png?raw=true"  style="height: 600px; width:2000px;"/>


tambien si presionamos el boton de graficas , podremos ver el uso del CPU y de la RAM en el tiempo :

<img src="https://github.com/gkruiz/so1_proyecto1_2S2023_201603009/blob/main/IMAGENES/Screenshot%20from%202023-09-24%2018-06-00.png?raw=true"  style="height: 600px; width:2000px;"/>


# Archivo YML

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












