const express = require('express');
const { verificarCaixa, abrirCaixa, novaTransacao, fecharCaixa, justificar } = require('./controladores/caixa')

const rotas = express();

rotas.get('/caixa', verificarCaixa);
rotas.post('/caixa', abrirCaixa);
rotas.post('/transacao', novaTransacao)
rotas.put('/caixa', fecharCaixa)
rotas.put('/justificar/:id', justificar)

module.exports = rotas;