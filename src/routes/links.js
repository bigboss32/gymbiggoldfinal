const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auh')

const pool = require('../database'); //conexion de la base de datos

router.get('/about', (req, res) => {
    res.render('lin/about');
});
router.get('/admin', isLoggedIn, (req, res) => {
    res.render('lin/admin');
});
router.get('/classes', (req, res) => {
    res.render('lin/classes');
});
router.get('/clientes', isLoggedIn, (req, res) => {
    res.render('lin/clientes');
});
router.get('/empleados', isLoggedIn, (req, res) => {
    res.render('lin/empleados');
});
router.get('/event', (req, res) => {
    res.render('lin/event');
});
/*router.get('/a_producto', (req, res) => {
    res.render('lin/a_producto');
});*/
router.get('/gimnasio', (req, res) => {
    res.render('lin/gimnasio');
});
router.get('/', (req, res) => {
    res.render('lin/index');
});


router.get('/vista_planes', async (req, res) => {
    const p = await pool.query('SELECT * FROM VER_PLAN')
    res.render('lin/vista_plan', { p });
});





//INSERTAR PLAN
router.post('/planes', async (req, res) => {
    const { ID_ELEMENT, NOMB_ELEMENT, PRECI, DURACI, ESTA } = req.body;

    const p = { ID_ELEMENT, NOMB_ELEMENT, PRECI };
    const p1 = { ID_ELEMENT, DURACI, ESTA };

    if (ID_ELEMENT < 0) {
        console.log('no puede ingresar numeros negativos')
        res.redirect('/planes');
    } else {
        await pool.query('insert into elemento set ?', [p]);
        await pool.query('insert into plan set ?', [p1]);
        res.redirect('/planes');
    }
});
//CONSULTAR PLAN
router.get('/planes' ,isLoggedIn, async (req, res) => {
    const dat = await pool.query('SELECT * FROM VER_PLAN');
    res.render('lin/planes', { dat });
});
//ELIMINAR PLAN
router.get('/planes/:ID_ELEMENT', isLoggedIn, async (req, res) => {
    const { ID_ELEMENT } = req.params;
    await pool.query('CALL DELETE_PLAN(?)', [ID_ELEMENT]);
    res.redirect('/planes');
});

// ENVIA DATOS A EL FORMULARIO
router.get('/a_plan/:ID_ELEMENT' ,isLoggedIn, async (req, res) => {

    const { ID_ELEMENT } = req.params;
    const pr = await pool.query('SELECT * FROM VER_PLAN WHERE ID_ELEMENT = ?', [ID_ELEMENT])

    res.render('lin/a_plan', { pr: pr[0] });

});

router.post('/a_plan/:ID_ELEMENT', async (req, res) => {
    const { ID_ELEMENT } = req.params;
    const { NOMB_ELEMENT, PRECI, ESTA, DURACI} = req.body;
    const produ = {
        ID_ELEMENT,
        PRECI,
        NOMB_ELEMENT
       
    };

    const as ={
        ID_ELEMENT,
        DURACI,
        ESTA
    }

    //await pool.query('UPDATE ELEMENTO SET ? WHERE ID_ELEMENT = ? ',[produ, ID_ELEMENT])
   
    await pool.query('UPDATE ELEMENTO SET ? WHERE ID_ELEMENT = ?', [produ, ID_ELEMENT])
    await pool.query('UPDATE PLAN SET ? WHERE ID_ELEMENT = ?', [as, ID_ELEMENT])


    res.redirect('/planes');
});



router.get('/provedores',isLoggedIn, (req, res) => {
    res.render('lin/provedores');
});

router.get('/registro', (req, res) => {
    res.render('autenti/registro');
});
router.get('/rutina', (req, res) => {
    res.render('lin/rutina');
});
router.get('/shop', (req, res) => {
    res.render('lin/shop');
});
router.get('/ventas',  isLoggedIn, (req, res) => {
    res.render('lin/ventas');
});
/*ALMACENAR EN PRODUCTO */
router.post('/productos', async function (req, res) {

    const { ID_ELEMENT, NOMB_ELEMENT, PRECI, ID_CATEG, STOCK } = req.body;
    const form = { ID_ELEMENT, NOMB_ELEMENT, PRECI };
    const forma = { ID_ELEMENT, ID_CATEG, STOCK };
    await pool.query('insert into elemento set ?', [form]);
    await pool.query('insert into producto set ?', [forma]);

    res.redirect('/productos');
});
/*MOSTRAR LOS PRODUCTOS */
router.get('/productos' ,isLoggedIn, async (req, res) => {
    const datos = await pool.query('SELECT * FROM VER_PRODUCTO');
    res.render('lin/productos', { datos });
});
/*ELIMINAR PRODUCTO */
router.get('/producto/:ID_ELEMENT', isLoggedIn, async (req, res) => {
    const { ID_ELEMENT } = req.params;
    await pool.query('CALL DELETE_PRODUCTO(?)', [ID_ELEMENT]);
    res.redirect('/productos');
});
/*REDIRECCINAR A UPDATE */
router.get('/a_producto/:ID_ELEMENT', isLoggedIn, async (req, res) => {

    const { ID_ELEMENT } = req.params;
    const PRON = await pool.query('SELECT * FROM VER_PRODUCTO WHERE ID_ELEMENT = ?', [ID_ELEMENT])
    console.log(PRON[0]);
    res.render('lin/a_producto', { PRON: PRON[0] });
});
/*ACTUALIZAR PRODUCTO*/
router.post('/a_producto/:ID_ELEMENT', async (req, res) => {
    const { ID_ELEMENT } = req.params;
    const { NOMB_ELEMENT, PRECI } = req.body;
    const produ = {
        NOMB_ELEMENT,
        PRECI
    };
    //await pool.query('UPDATE ELEMENTO SET ? WHERE ID_ELEMENT = ? ',[produ, ID_ELEMENT])
    await pool.query('CALL UPDATE_PRODUCTO(?,?,?) ', [produ.NOMB_ELEMENT, produ.PRECI, ID_ELEMENT])

    res.redirect('/productos');
});


router.get('/persona', isLoggedIn, async (req, res) => {
    const personas = await pool.query('SELECT * FROM view_datos_personales');
    const sangres = await pool.query('SELECT * FROM tipo_sangre');
    const entidad = await pool.query('SELECT * FROM eps');
    const documenst = await pool.query('SELECT * FROM tipo_documento');
    res.render('lin/persona', { personas, sangres, entidad, documenst });
});
router.get('/persona/:ID_PERS', isLoggedIn, async (req, res) => {
    const { ID_PERS } = req.params;
    await pool.query('CALL DELETE_PERSONA(?)', [ID_PERS]);
    res.redirect('/persona');
});
router.post('/persona', async function (req, res) {

    const { ID_PERS, NOMB_UNO, NOMB_DOS, APE_UNO, APE_DOS, FECH_NACI, SEXO, NUM_CEL, CORRE, FK_TIP_DOC, FK_EPS, FK_TIP_SANG, NUMERO_DOC } = req.body;

    const a = { ID_PERS, NOMB_UNO, NOMB_DOS, APE_UNO, APE_DOS, FECH_NACI, SEXO, NUM_CEL, CORRE, FK_TIP_DOC, FK_EPS, FK_TIP_SANG, NUMERO_DOC };

    console.log(a);
    await pool.query('insert into persona set ?', [a]);
    res.redirect('/persona');
});
router.get('/apersona/:ID_PERS', isLoggedIn, async (req, res) => {

    const { ID_PERS } = req.params;
    const PERSONA_UNICA = await pool.query('SELECT * FROM PERSONA WHERE ID_PERS = ?', [ID_PERS]);
    console.log(PERSONA_UNICA[0]);
    const sangres = await pool.query('SELECT * FROM tipo_sangre');
    const entidad = await pool.query('SELECT * FROM eps');
    const documenst = await pool.query('SELECT * FROM tipo_documento');
    res.render('lin/apersona', { PERSONA_UNICA: PERSONA_UNICA[0], sangres, entidad, documenst });
});
router.post('/apersona/:ID_PERS', async (req, res) => {
    const { ID_PERS } = req.params;
    const { NOMB_UNO, NOMB_DOS, APE_UNO, APE_DOS, FECH_NACI, SEXO, NUM_CEL, CORRE, FK_TIP_DOC, FK_EPS, FK_TIP_SANG, NUMERO_DOC } = req.body;
    const perso = {
        NOMB_UNO, NOMB_DOS, APE_UNO, APE_DOS, FECH_NACI, SEXO, NUM_CEL, CORRE, FK_TIP_DOC, FK_EPS, FK_TIP_SANG, NUMERO_DOC
    };
    //await pool.query('UPDATE ELEMENTO SET ? WHERE ID_ELEMENT = ? ',[produ, ID_ELEMENT])
    await pool.query('CALL UPDATE_PERSONA(?,?,?,?,?,?,?,?,?,?,?,?,?)', [ID_PERS, perso.NOMB_UNO, perso.NOMB_DOS, perso.APE_UNO, perso.APE_DOS, perso.FECH_NACI, perso.SEXO, perso.NUM_CEL, perso.CORRE, perso.FK_TIP_DOC, perso.FK_EPS, perso.FK_TIP_SANG, perso.NUMERO_DOC])
    res.redirect('/persona');
});

router.post('/maquina_guardar', async (req, res) => { /*insertar maquina*/

    const { NOMB_MAQUI, ESTA } = req.body;
    /* const DATE_MAQUIN = { NOMB_MAQUI, ESTA};*/
    console.log(NOMB_MAQUI, ESTA);
    await pool.query('CALL INSERTAR_MAQUINA(?,?)', [NOMB_MAQUI, ESTA]);
    res.redirect('/maquina');
});
router.get('/maquina/:ID_MAQUI', isLoggedIn, async (req, res) => { /*eliminar maquina*/
    /*consultar producto para mostrarlos en la pagina principal*/
    const { ID_MAQUI } = req.params;
    await pool.query('CALL ELIMINAR_MAQUINA(?)', [ID_MAQUI]);
    res.redirect('/maquina')
});
router.get('/amaquina/:ID_MAQUI', isLoggedIn, async (req, res) => {  /*buscar objeto a actualizar*/
    const { ID_MAQUI } = req.params;
    const obje_maqui = await pool.query('SELECT * FROM MAQUINA WHERE ID_MAQUI = ?', [ID_MAQUI]);
    console.log(obje_maqui[0]);
    res.render('lin/amaquina', { obje_maqui: obje_maqui[0] });
});
router.post('/amaquina/:ID_MAQUI', isLoggedIn, async (req, res) => {
    const { ID_MAQUI } = req.params;
    const { NOMB_MAQUI, ESTA } = req.body;
    const MAQUINA_UPDATE = {
        NOMB_MAQUI,
        ESTA
    };
    await pool.query('CALL UPDATE_MAQUINA(?,?,?) ', [ID_MAQUI, MAQUINA_UPDATE.NOMB_MAQUI, MAQUINA_UPDATE.ESTA])
    res.redirect('/maquina');
});

router.get('/maquina', async (req, res) => {  /*consultar producto para mostrarlos en la pagina principal*/
    const machine = await pool.query('SELECT * FROM maquina');
    res.render('lin/maquina', { machine });
});



module.exports = router;

