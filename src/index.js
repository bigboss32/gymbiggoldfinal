const express = require('express');

const morgan = require('morgan');

const exhbs = require('express-handlebars');

const path = require('path');

const flash= require('connect-flash');

const session = require('express-session');

const mysqlstore =require('express-mysql-session');
const passport =  require('passport')

const { database}= require('./keys')


//initializations
const app = express();
require('./lib/passport');

//setting
app.set('port', process.env.PORT || 3000);
app.set('views',path.join(__dirname, 'views')); // estable la carpeta views decirle donde esta esta carpeta(unir donde esta la carpeta views con layouts)
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts') , // doy la direccion de main requiero path, que srirve para unir directorios
    partialsDir : path.join(app.get('views'), 'partials') , //codigo en multiples vissta
    extname : '.hbs',
    helpers : require('./lib/handlebars')
}));
app.set('view engine', 'hbs');
//middlewares
app.use(session({
    secret: 'mysession',
    reseave: false,
    saveUninitialized: false,
    store:  new mysqlstore(database)
}));
app.use(flash());
app.use(morgan('dev')); // son funciones que se ejecutan cada vez que un usuario envia una peticion
app.use(express.urlencoded({extended: false})); // es para poder aceptar desde los formularios los datos que me envien los usuarios 
app.use(express.json());
app.use(passport.initialize()); //inicializa passport
app.use(passport.session())

// global variable

app.use((req,res, next) =>{
   app.locals.success = req.flash('success')
   app.locals.message = req.flash('message')
   app.locals.user = req.user;
    next();
});

//routes
app.use(require('./routes/index')); // importarlos
app.use(require('./routes/authentication'));
app.use(require('./routes/links'));
//public 
app.use(express.static(path.join(__dirname, 'public')));// donde van los css html y javascript

// starting the server
app.listen(app.get('port'), ()=>{
    console.log('server on port', app.get('port'))
});  