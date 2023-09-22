

const sql = require('mssql');


/**/
const config = {
    user :"sa",
    password :'AQ@5p3l',
    server:'AQUASQL\\SQL2017',
    database:'SAE80Empre01',
	options:{
		 trustedconnection: true,
        enableArithAbort : true, 
        instancename :'SQL2017',
		trustServerCertificate: true,
		encrypted: true
    },
	port:1433
}


/*
192.178.10.5
user :'app',
    password :'Abc123**..',



const config = {
    user :'sa',
    password :'Asdf1234.,',
    server:'localhost',
    database:'principal',
    options:{
        trustedconnection: true,
        enableArithAbort : true, 
        instancename :'SQLEXPRESS',
		trustServerCertificate: true,
		encrypted: true
    }
}

*/





async function query(sqlQuery ) {
	
	
    try {
        let pool = await sql.connect(config);
        let products = await pool.request().query(sqlQuery);
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}



module.exports = {
    query: query
}