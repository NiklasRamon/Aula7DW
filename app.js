const express = require("express");
const app = express();
const handlebars = require("express-handlebars").engine;
const bodyParser = require("body-parser");
const post = require("./banco/post");
const { log } = require("console");

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.render("primeira_pagina");
});

app.post("/cadastrar", function(req, res) {
    // Formatar a data
    const dataFormatada = new Date(req.body.data_contato);
    
    post.create({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: dataFormatada,
        observacao: req.body.observacao
    }).then(function() {
        console.log("Dados cadastrados com sucesso!");
        res.send("Dados cadastrados com sucesso!");
    }).catch(function(error) {
        console.log("Erro ao gravar os dados na entidade!", error);
        res.status(500).send("Erro ao gravar os dados!");
    });
});

app.listen(8081, function() {
    console.log("Servidor Ativo!");
});

app.get("/editar/:id", function(req, res) {
    post.findAll({ where: { id: req.params.id } }).then(function(posts) {
        res.render("editar", { posts });
        console.log(posts);
    });
});

app.post("/atualizar", function(req, res) {
    // Formatar a data
    const dataFormatada = new Date(req.body.data_contato);
    
    post.update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: dataFormatada,
        observacao: req.body.observacao,
    }, {
        where: { id: req.body.id } // Certifique-se de que você está passando o ID corretamente
    }).then(() => {
        res.status(200).send("Atualização bem-sucedida!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar: " + error.message);
    });
});

app.post("/excluir", function(req, res) {
    const id = req.body.id; // Pegue o ID do corpo da requisição
    post.destroy({ where: { id: id } })
        .then(function() {
            console.log("Dados excluídos com sucesso!");
            res.redirect("/consultar"); // Redireciona para a página de consulta após a exclusão
        })
        .catch(error => {
            console.log("Erro ao excluir os dados!", error);
            res.status(500).send("Erro ao excluir os dados!");
        });
});


app.get("/consultar", function(req, res) {
    post.findAll().then(function(posts) {
        res.render("consulta.handlebars", { posts });
        console.log(posts);
    }).catch(error => {
        console.log("Erro ao consultar os dados!", error);
        res.status(500).send("Erro ao consultar os dados!");
    });
});

app.get("/confirmar/:id", function(req, res) {
    post.findAll({ where: { id: req.params.id } }).then(function(posts) {
        res.render("confirmacao", { posts });
        console.log(posts);
    });
});