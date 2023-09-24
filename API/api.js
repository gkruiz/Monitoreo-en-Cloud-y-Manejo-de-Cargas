

const Database = require('./database');
var mysql = require('mysql');
var express = require('express') //llamamos a Express
var app = express()               
const cors = require('cors');
var port = process.env.PORT || 8080  // establecemos nuestro puerto
require('dotenv').config();


app.use(cors({
    origin: '*'
}))
app.use(express.json())


//MYSQL_IP

//Pool default create only once time
var con = mysql.createPool({
    connectionLimit : 1000,
    host: process.env.MYSQL_IP,
    user: "root",
    password: "password",
    database: "proyecto_1"
});




app.get('/',cors(), async function(req, res) {

  //var reg = await loadData();
''
  res.json({ mensaje:  "ok"})
})




app.post('/save_cpu_info', async function(req, res) {

    const { data , machine } = req.body;
        
    console.log("Datos CPU:");
    console.log(data);
    console.log(machine);
    
    //DATA TO JSON
    var cpu_structure = JSON.parse(data);

    var usado=cpu_structure[0]["cpu_usado"];

    var total=cpu_structure[0]["cpu_total"];

    //SAVE DATA ON DATABASE
    var query = `INSERT INTO CPU_DATA(machine,cpu_total,cpu_usado,fecha)VALUES('`+machine+`',`+total+`,`+usado+`,NOW());`; 

    runQuery(query)

    res.status(200).json({mensaje:"OK"});
})








app.post('/save_ram_info', async function(req, res) {

    const {data,machine}=req.body;

    //console.log("Datos RAM:");
    //console.log(data);
    //console.log(machine);

    var ram_structure = JSON.parse(data);

    var usado=ram_structure[0]["mem_usado"];

    var total=ram_structure[0]["mem_total"];

    var libre=ram_structure[0]["mem_libre"];




    var query = `INSERT INTO RAM_DATA(machine,mem_usado,mem_libre,mem_total,fecha)VALUES('`+machine+`',`+usado+`,`+libre+`,`+total+`,NOW());`; 

    await runQuery(query)


    //envia el numero de la maquina y ahi asigna el valor de la informacion 
    //ram_informacion[machine-1]=ram_structure;
    //ram_informacion.push(ram_structure);



    res.status(200).json({mensaje:"OK"});
})









app.post('/save_pro_info', async function(req, res) {

    const {data,machine}=req.body;

    //console.log("Datos PROC:");
    //console.log(data);
    //console.log(machine);

    //guarda la informacion como una cadena de texto
    //pro_informacion[machine-1]=data;

    var query = `INSERT INTO PRO_DATA(machine,pro_data,fecha)VALUES('`+machine+`','`+data+`' ,NOW());`; 

    await runQuery(query)

    res.status(200).json({mensaje:"OK"});
})







app.post('/get_cpu_info', async function(req, res) {

    const {machine}=req.body;

    console.log("Maquina CPU:");
    console.log(machine);

    var query = `SELECT * FROM CPU_DATA WHERE machine='`+machine+`' ORDER BY fecha DESC LIMIT 1 `; 
    console.log('query')
    console.log(query)
    
    var respuesta = await runQuery(query)
    console.log(respuesta)

    res.status(200).json({data:respuesta});
})


app.post('/get_ram_info', async function(req, res) {

    const {machine}=req.body;

    console.log("Maquina RAM:");
    console.log(machine);

    var query = `SELECT * FROM RAM_DATA WHERE machine='`+machine+`' ORDER BY fecha DESC LIMIT 1 `; 
    var respuesta = await runQuery(query)
    console.log(respuesta)

    res.status(200).json({data:respuesta});
})


app.post('/get_pro_info', async function(req, res) {

    const {machine}=req.body;

    console.log("Maquina PROC:");
    console.log(machine);

    var query = `SELECT * FROM PRO_DATA WHERE machine='`+machine+`' ORDER BY fecha DESC LIMIT 1 `; 
    var respuesta = await runQuery(query)
    console.log(respuesta)

    res.status(200).json({data:respuesta});
})



//Multiple values

app.post('/get_cpu_values', async function(req, res) {

    const {machine}=req.body;

    console.log("Maquina CPU:");
    console.log(machine);

    var query = `SELECT * FROM CPU_DATA WHERE machine='`+machine+`' ORDER BY fecha DESC LIMIT 25 `; 
    console.log('query')
    console.log(query)
    
    var respuesta = await runQuery(query)
    console.log(respuesta)

    res.status(200).json({data:respuesta});
})


app.post('/get_ram_values', async function(req, res) {

    const {machine}=req.body;

    console.log("Maquina RAM:");
    console.log(machine);

    var query = `SELECT * FROM RAM_DATA WHERE machine='`+machine+`' ORDER BY fecha DESC LIMIT 25 `; 
    var respuesta = await runQuery(query)
    console.log(respuesta)

    res.status(200).json({data:respuesta});
})


app.post('/get_pro_values', async function(req, res) {

    const {machine}=req.body;

    console.log("Maquina PROC:");
    console.log(machine);

    var query = `SELECT * FROM PRO_DATA WHERE machine='`+machine+`' ORDER BY fecha DESC LIMIT 10 `; 
    var respuesta = await runQuery(query)
    console.log(respuesta)

    res.status(200).json({data:respuesta});
})










app.post('/get_machines', async function(req, res) {

    var query = `SELECT * FROM
    (SELECT R.machine ,TIMESTAMPDIFF(SECOND,R.fecha,NOW()) AS diff
    FROM
    (SELECT machine , MAX(fecha) as fecha
    from CPU_DATA
    group by machine) R)
    N
    WHERE N.diff<5`; 

    var respuesta = await runQuery(query)
    console.log(respuesta)
    
    res.status(200).json({data:respuesta});
})





const runQuery = async (query) =>{
    var retorno=[]

    try{

        retorno = await new Promise(async (resolve, reject) => {

            await con.query(query, async (err, data) => { 

                var dataT=[]
                if(err) {
                    console.error(err);
                }else{
                    //console.log(data);
                    dataT=data;
                }

                resolve(dataT);
            });

        });

    }catch(errx){
        console.log(errx);   
    }

   return retorno
}





const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}





// iniciamos nuestro servidor

var sql1 = `CREATE TABLE IF NOT EXISTS CPU_DATA(
    id int AUTO_INCREMENT PRIMARY KEY,
    machine VARCHAR(100) NOT NULL,
    cpu_total BIGINT NOT NULL , 
    cpu_usado BIGINT NOT NULL,
    fecha DATETIME NOT NULL
);`; 


var sql2 = `CREATE TABLE IF NOT EXISTS RAM_DATA(
    id int AUTO_INCREMENT PRIMARY KEY,
    machine VARCHAR(100) NOT NULL,
    mem_usado BIGINT NOT NULL , 
    mem_libre BIGINT NOT NULL , 
    mem_total BIGINT NOT NULL,
    fecha DATETIME NOT NULL
);`; 

var sql3 = `CREATE TABLE IF NOT EXISTS PRO_DATA(
    id int AUTO_INCREMENT PRIMARY KEY,
    machine VARCHAR(100) NOT NULL,
    pro_data VARCHAR(16000) NOT NULL , 
    fecha DATETIME NOT NULL
);`; 



var sql4 = `DROP TABLE IF EXISTS CPU_DATA;`; 
var sql5 = `DROP TABLE IF EXISTS RAM_DATA;`; 
var sql6 = `DROP TABLE IF EXISTS PRO_DATA;`; 


app.listen(port)
console.log('API escuchando en el puerto ' + port)
//console.log('DROP CPU_TABLE:' +  runQuery(sql4))
//console.log('DROP RAM_TABLE:' +  runQuery(sql5))
//console.log('DROP PRO_TABLE:' +  runQuery(sql6))

console.log('CPU_TABLE:' +  runQuery(sql1))
console.log('RAM_TABLE:' +  runQuery(sql2))
console.log('PRO_TABLE:' +  runQuery(sql3))





