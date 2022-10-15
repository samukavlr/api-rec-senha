const Sequelize = require('sequelize');
const db = require('../database/db');

const User = db.define('users',{
  id: {
    type: Sequelize.INTEGER,  
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name:{
    type: Sequelize.STRING(50),
    allowNull: false

  },
  email:{
    type: Sequelize.STRING,
    allowNull: false

  },
  password:{
    type: Sequelize.STRING,
    allowNull: false
  },
  verificationCode:{
    type: Sequelize.STRING,
    allowNull: true 
  }
  
})

//Criar a tabela com sequelize
// User.sync();

// Excluir a tabela e criar novamente
// User.sync({force: true})

// verificar se há alguma diferença na tabel, raliza alteração
// User.sync({alter:true});


module.exports = User;