const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database')
const helpers = require('../lib/helpers');


passport.use('local.sigin', new LocalStrategy({
     usernameField: 'USER',
     passwordField: 'CONTR',
     passReqToCallback: true
}, async (req, USER, CONTR, done) => {
     console.log(req.body);

     const rows = await pool.query('SELECT * FROM USU WHERE  USER = ?', [USER]);
     if (rows.length > 0){  //significa que ha enconrado un usuario
     const use = rows[0];
     const validpass = await helpers.matchContra(CONTR , use.CONTR); //compara las contraseñas
     if (validpass) {
          done(null, use, req.flash('success','welcome' + use.USER));
     } else {
          done(null, false, req.flash( 'message','contraseña incorrecta'));
     }
     } else {
     return done(null, false, req.flash('message','nombre de usuario no exise') );
          }
 
}));



passport.use('local.signup', new LocalStrategy({
     usernameField: 'USER',
     passwordField: 'CONTR',
     passReqToCallback: true
}, async (req, USER, CONTR, done) => {

     console.log(req.body);
     const newUser = {
          USER,
          CONTR
     };

     newUser.CONTR = await helpers.encriptarContra(CONTR)
     const result = await pool.query('INSERT INTO USU SET ?', [newUser]);
     newUser.id_usu = result.insertId;
     return done(null, newUser);
     console.log(result);
}));//ponemos nombre
passport.serializeUser((USER, done) => {
     done(null, USER.id_usu);
});

passport.deserializeUser(async (id_usu, done) => {
     const rows = await pool.query('SELECT * FROM USU WHERE ID_USU = ? ', [id_usu]);
     done(null, rows[0]);
})