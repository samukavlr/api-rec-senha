const Users = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail= require('../nodemailer/email')
const {bodyemail}=require('../nodemailer/bodyemail')

///////////////// crirar//////////////
exports.create =  async(req, res) =>{
  var dados = req.body;
  dados.password = await bcrypt.hash(dados.password, 8);



  await Users.create(dados)
  .then(()=>{
    return res.json({
      erro: false,
      mensagem: 'Usuário cadastrado com sucesso!'
    });
  }).catch((err)=>{
    return res.status(400).json({
      erro:true,
      mensagem: `Erro: Usuário não encontrado... ${err}`
    })
  })
}
///////////////// Logar//////////////
exports.login =  async (req, res) => {
  const user = await Users.findOne({
      attributes: ['id', 'name', 'email', 'password'],
      where: {
          email: req.body.email
      }
  })
  if(user === null){
      return res.status(400).json({
          erro: true,
          mensagem:"Erro: Email ou senha incorreta!!!"
      })
  }
  if(!(await bcrypt.compare(req.body.password, user.password))){
      return res.status(400).json({
          erro: true,
          mensagem: "Erro: Email ou senha incorreta!!!"
      })
  }
  var token = jwt.sign({id: user.id}, process.env.SECRET,{
    expiresIn: 600
  })
  return res.json({
    erro:false,
    mensagem: "Login realizado com sucesso!!!",
    token
    
  })
  
}
///////////////// Mostrar todos//////////////
exports.findAll = async(req,res)=>{
  await Users.findAll({
    attributes: ['id','name','email', 'password'],
    order: [['id', 'ASC']]

  })
  .then((users) => {
    return res.json({
      erro: false,
      users
    });
  }).catch((err) => {
    return res.status(400).json({
      erro : true,
      mensagem: `Erro ${err} ou nenhum usuário encontrado!!!`
    })
  })
}
///////////////// Alterar//////////////
exports.update = async(req,res)=>{
  const {id} = req.body;

  await Users.update(req.body, {where: {id}})
  .then(()=>{
    return res.json({
      erro: false,
      mensagem: "Usuário alterado com sucesso!"
    })
  }).catch((err)=>{
    return res.status(400).json({
      erro: true,
      mensagem: `Erro: Usuário não encontrado ...${err}`
    })
  })
}
///////////////// Mostrar 1//////////////
exports.findOne = async (req, res) =>{
  const {id} = req.params;
  try{
   
    const users = await Users.findByPk(id);
    if(!users){
      return res.status(400).json({
        erro: true,
        mensagem: "Erro:Nenhum usuário encontrado!"
      })
    }
    res.status(200).json({
      erro: false,
      users
    })
  }catch(err){
    res.status(400).json({
      erro: true,
      mensagem: `Erro ${err}`
    })
  }
}
///////////////// Deletar//////////////
exports.delete =  async(req,res)=>{
  const {id} = req.params;
  await Users.destroy({where: {id}})
  .then(()=>{
    return res.json({
      erro: false,
      mensagem: "Usuário apagado com sucesso!"
    });
  }).catch((err)=>{
    return res.status(400).json({
      erro: true,
      mensagem: `Erro: ${err} Usuário não apagado...`
    })
  })
}
///////////////// Trocar senha//////////////
exports.changepass =  async (req, res) => {
  const {id, password } = req.body;
  var senhaCrypt = await bcrypt.hash(password, 8);
  const users = await Users.findByPk(id);
  if(!users){
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum usuário encontrado!"
    })
  }

  await Users.update({password: senhaCrypt }, {where: {id: id}})
  .then(() => {
     ;
      return res.json({
          erro: false,
          mensagem: "Senha edita com sucesso!"
      }); 
  }).catch( (err) => {
      return res.status(400).json({
          erro: true,
          mensagem: `Erro: ${err}... A senha não foi alterada!!!`
      })
  })
  
}
exports.recoverypassword = async (req,res) =>{
  const email = req.body.email
  const User = await Users.findOne({where: {email}})
  if(!User){
    return res.status(400).json({
      erro : true,
      mensagem : "Email invalido"
    })
  }
  else{
    const token = (Math.random() * Date.now()).toString().substring(0,6)
    await Users.update({verificationCode: token},{where: {id: User.id} })
    .then(()=>{

    const dados = {
      name : User.name,
      token : token
    }

    const htmlbody = bodyemail(dados)
    const subject = "Alteração de senha"
    const to = User.email

    sendMail(to,subject,htmlbody)

    return res.status(200).json({
      erro: false,
      mensagem: "Email enviado com sucesso",
      token
    })
    }).catch((err)=>{
      return res.status(400).json({
        erro: true,
        mensagem: `Erro: falha no envio do email! ${err}`
      })
    })
  }
}
exports.updatepassword = async(req,res) => {
  const {email,token, password, confirmpass} = req.body
  const User = await Users.findOne({where: {email}})
  if(!User || (password != confirmpass)){
    return res.status(400).json({
      erro: true,
      mensagem: "senha nao!"
    })
  }
  if(token == User.verificationCode){
    const newpassword = await bcrypt.hash(password,8)
    await Users.update({password:newpassword},{where:{id: User.id}})
    .then(()=>{
      return res.status(200).json({
        erro: false,
        mensagem: "Senha alterada com sucesso"
      })
     }
    ).catch((err)=>{
        return res.status(400).json({
          erro: true,
          mensagem: `Erro: ${err}. Falha na alteração de senha`
        })
      })
  }
  else{
    return res.status(400).json({
      erro: true,
      mensagem: "Código inválido"
    })
  }
}