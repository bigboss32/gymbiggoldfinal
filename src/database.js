const mysql = require('mysql');
const {promisify} = require('util');
const {database} = require('./keys'); //importar desde keys quiero solo el parametro database

const pool = mysql.createPool(database);//utilizar conexion
pool.getConnection((err, Connection)=>{
 if(err){
     if(err.code=== ' PROTOCOL_CONNECTION_LOST'){
     Console.error('DATABASE CONNECTION WAS CLOSED');
 }

 if(err.code ==='ENCONNREFUSED'){
    console.error('DATABASE CONNECTION WAS REFUSED')
 }
 if(Connection) connection.release();
   console.log('DB IS CONNECTED')
  return;
}
});
//convirtirtiendo promesas

pool.query = promisify(pool.query);
module.exports = pool;