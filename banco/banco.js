const Sequelize = require("sequelize")
const sequelize = new Sequelize("projetoweb", "root", "", {
    host:"localhost",
    dialect:"mysql"
})

sequelize.authenticate().then(function(){
    console.log("Banco de Dados Ativo!");
}).catch(function(erro){
    console.log("Problema no banco de dados: " + erro);
})

module.exports = {
    Sequelize,
    sequelize
}
