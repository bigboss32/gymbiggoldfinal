const express = require('express');
const router = express.Router();
const  pool = require('../database');

// definr ruta inicial
router.get('/add',(req, res)=>{
    res.render('lin/add');
});
 



module.exports = router; 