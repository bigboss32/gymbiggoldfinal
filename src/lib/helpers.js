const bcrypt = require('bcryptjs')
const helpers ={};

helpers.encriptarContra = async(CONTR) =>{
  const salt= await bcrypt.genSalt(10);
   const hash = await  bcrypt.hash(CONTR, salt);
   return hash;

};

helpers.matchContra = async(CONTR, SAVECONTRA) =>{
  try {
     return await bcrypt.compare(CONTR, SAVECONTRA);
  } catch (e) {
      console.log(e)
  }
  
};
module.exports = helpers;