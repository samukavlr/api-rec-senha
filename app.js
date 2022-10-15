const express = require('express');
const app = express();
require('dotenv').config()
var cors = require('cors')
const { validaToken } = require('./middlewares/auth');


const Users = require('./models/User');
const router = require('./routes/index');


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers","Content-Type, Authorization");
  app.use(cors());
  next();
})

app.get("/", function(request,response){
  response.send("Serviço API Rest iniciada...");
  console.log(response)
})

app.get('/validaToken', validaToken, async (req, res) => {
  await Users.findByPk(req.userId, {
      attributes: ['id', 'name', 'email']
  }).then((user)=>{
      return res.status(200).json({
          erro: false,
          user
      })
  }).catch(() => {
      return res.status(400).json({
          erro: true,
    
          mensagem: "Erro: Necessário ralizar o login"
  })

})
})


app.use(router);
app.listen(process.env.PORT, ()=>{
  console.log(`Servidor iniciado na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});