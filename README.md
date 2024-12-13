# Gestor de Caixa

Este é um projeto para um gestor de caixa. Ele permite realizar operações de abertura e fechamento de caixa,registrar transações de entradas e saídas, além de justificar o fechamento do caixa. 
A aplicação é construída com Node.js e utiliza o Knex.js para interação com o banco de dados relacional, proporcionando um controle eficiente sobre os valores registrados no sistema de caixa.

## Funcionalidades

• Verificar Caixa Aberto: Verifica se já existe um caixa aberto (sem data de fechamento).

• Abrir Caixa: Permite abrir um novo caixa com um valor inicial.

• Registrar Nova Transação: Realiza a inserção de uma nova transação (entrada ou saída) dentro de um caixa aberto.

• Fechar Caixa: Realiza o fechamento de um caixa, calculando o valor final e registrando a justificativa e status.

• Justificar Fechamento de Caixa: Permite adicionar uma justificativa ao fechamento do caixa, caso o status seja "pendente".

## Requisitos

• Node.js: A aplicação utiliza Node.js como ambiente de execução.

• Knex.js: Query builder para interação com o banco de dados relacional.

• Banco de Dados: A aplicação requer um banco de dados relacional para armazenar informações sobre caixas e transações.

## Tecnologias

• Node.js

• Knex.js

• Express (para gerenciamento de rotas)

• PostgreSQL
