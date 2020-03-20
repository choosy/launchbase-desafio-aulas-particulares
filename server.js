const express = require("express")
const nunjucks = require("nunjucks")
const routes = require("./routes")
const methodOverride = require("method-override")

//* Ativando o Servidor
const server = express()

//* Usando Middleware
//! A ordem é afetada
server.use(express.urlencoded({ extended: true })) //* responsável por fazer funcionar o body

//* Mostrando arquivos estaticos com CSS
server.use(express.static('public'))

server.use(methodOverride("_method"))
server.use(routes)


//* Configurando Nunjucks
server.set("view engine", "njk")

nunjucks.configure("views", {
  express: server,
  autoescape: false, //* mostrar o HTML sem as tags
  noCache: true
}) 

//* Iniciando o Servidor
server.listen(5000, function(req, res) {
  console.log("server is running")
})
