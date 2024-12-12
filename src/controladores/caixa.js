const knex = require('../conexao/knex.js')

const verificarCaixa = async (req,res) =>{
    try {
        const caixaAberto = await knex('caixa')
        .whereNull('data_fechamento')
        .first().debug();
    
        if (!caixaAberto) {
            return res.status(404).json( "Nenhum caixa aberto encontrado." );
        }
    
        return res.status(200).json(caixaAberto);  
    } catch (error) {
        console.error("Erro ao verificar caixa aberto:", error);
        return res.status(500).json( "Erro interno do servidor. Por favor, tente novamente mais tarde." );
    }
}

const abrirCaixa = async (req, res) => {
    const {valor_inicial} = req.body;

    try {
        const caixaAberto = await knex('caixa')
        .whereNull('data_fechamento')
        .first();

        if (caixaAberto) {
            return res.status(400).json('Já existe um caixa aberto')
        }

        const novoCaixa = await knex('caixa')
        .insert({data_abertura: new Date(), valor_inicial})
        .returning('*');

        return res.status(201).json(novoCaixa);
    } catch (error) {
        console.error("Erro ao abrir o caixa:", error);
        return res.status(500).json( "Erro interno do servidor. Por favor, tente novamente mais tarde." );
    }
    
}

const novaTransacao = async (req, res) => {
    const {valor, tipo, troco} = req.body;

    if (!valor || !tipo) {
        return res.status(400).json("Preencha os campos valor e tipo");
    }

    try {
        const caixaAberto = await knex('caixa')
        .whereNull('data_fechamento')
        .first();

        if (!caixaAberto) {
            return res.status(400).json('Nenhum caixa está aberto no momento.');
        }

        if (valor === 0) {
          return res.status(400).json('Valor da transação não pode ser zero.');  
        }

        await knex('transacoes')
        .insert({caixa_id: caixaAberto.id, valor, tipo, data_hora: new Date()})
        .returning('*');

        if (troco) {

            if (typeof troco !== "number" || troco <= 0) {
                return res.status(400).json('O valor de troco deve ser um número positivo.');
            }

            await knex('transacoes').insert({
                caixa_id: caixaAberto.id,
                valor: -troco,
                tipo: 'saída',
                data_hora: new Date()
            });
        }

        return res.status(201).json("Transação registrada com sucesso.");
    } catch (error) {
        console.error("Erro ao realizar uma nova transação", error);
        return res.status(500).json("Erro interno do servidor. Por favor, tente novamente mais tarde.");
    }
}

const fecharCaixa = async (req, res) => {
    const {status, justificativa} = req.body;
    
    try {
        const caixaAberto = await knex('caixa')
        .whereNull('data_fechamento')
        .first();

        if (!caixaAberto) {
            return res.status(400).json('Nenhum caixa está aberto no momento.');
        }

        await knex('caixa')
        .where({id: caixaAberto.id})
        .update({data_fechamento: new Date()});

        const transacoes = await knex('transacoes')
        .where({caixa_id: caixaAberto.id})
        .sum('valor as total')
        .first();

        const valorFinal = Number(caixaAberto.valor_inicial) + Number(transacoes.total || 0);

        await knex('caixa')
        .where({id: caixaAberto.id})
        .update({valor_final: valorFinal, status, justificativa})

        const valor_inicial = caixaAberto.valor_inicial

        return res.status(200).json({
            message: 'Caixa fechado com sucesso',
            valor_inicial,
            valorFinal,
            status,
            justificativa
        })

    } catch (error) {
        console.error("Erro ao realizar o fechamento do caixa", error);
        return res.status(500).json("Erro interno do servidor. Por favor, tente novamente mais tarde.")
    }
}

const justificar = async (req,res) => {
    const {id} = req.params
    const { justificativa } = req.body;

    if (!justificativa) {
        return res.status(400).json('A justificativa deve ser enviada.');
    }

    try {
        const caixa = await knex('caixa')
        .where({id})
        .first();

        if (!caixa) {
            return res.status(404).json("Caixa não encontrado.");
        }

        if (caixa.status !== "pendente") {
            return res.status(400).json("Justificativa não permitida para caixas com status 'ok'.");
        }

        const justificacao = await knex('caixa')
        .where({id})
        .update({justificativa})
        .returning('*')

        return res.status(200).json(justificacao)
    } catch (error) {
        console.error("Erro ao justificar", error);
        return res.status(500).json("Erro interno do servidor. Por favor, tente novamente mais tarde.")
    }
}

module.exports = {
    verificarCaixa,
    abrirCaixa,
    novaTransacao,
    fecharCaixa,
    justificar
}