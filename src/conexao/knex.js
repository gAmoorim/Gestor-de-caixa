const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '123456',
        database: 'gestorde_caixa'
    }
});

module.exports = knex