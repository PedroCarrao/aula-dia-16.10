const express = require('express');
const app = express();
app.use(express.json()); // necessario para ler JSON do corpo das requisicoes
// "Banco de dados" em memoria
let tarefas = [
 { id: 1, titulo: 'Aprender Express', concluida: false },
 { id: 2, titulo: 'Criar minha primeira API', concluida: false }
];
let proximoId = 3;
// LISTAR todas as tarefas (com filtro opcional por status)
app.get('/tarefas', (req, res) => {
 const { concluida } = req.query;
 let resultado = tarefas;
 if (concluida !== undefined) {
 resultado = tarefas.filter(t => t.concluida === (concluida === 'true'));
 }
 res.json(resultado);
});
// BUSCAR uma tarefa especifica
app.get('/tarefas/:id', (req, res) => {
 const tarefa = tarefas.find(t => t.id === parseInt(req.params.id));
 if (!tarefa) return res.status(404).json({ erro: 'Tarefa nao encontrada' });
 res.json(tarefa);
});
// CRIAR uma nova tarefa

// precisa de prevenção contra SQL INJECTION
app.post('/tarefas', (req, res) => {
 const { titulo } = req.body;
 if(typeof titulo === 'string' || titulo.trim().lenth === 0) return res.status(404).json({ erro: 'O campo "titulo" e obrigatorio' });
 if (titulo.length > 255)return res.status(400).json({ erro: 'O campo "titulo" esta muito grande' });
 const novaTarefa = { id: proximoId++, titulo, concluida: false };
 tarefas.push(novaTarefa);
 res.status(201).json(novaTarefa);
});
// ATUALIZAR uma tarefa (ex: marcar como concluida)
app.put('/tarefas/:id', (req, res) => {
 const tarefa = tarefas.find(t => t.id === parseInt(req.params.id));
 if (!tarefa) return res.status(404).json({ erro: 'Tarefa nao encontrada' });
 const { titulo, concluida } = req.body;
 if (titulo !== undefined) tarefa.titulo = titulo;
 if (concluida !== undefined) tarefa.concluida = concluida;
 res.json(tarefa);
});
// DELETAR uma tarefa
app.delete('/tarefas/:id', (req, res) => {
 const index = tarefas.findIndex(t => t.id === parseInt(req.params.id));
 if (index === -1) return res.status(404).json({ erro: 'Tarefa nao encontrada' });
 tarefas.splice(index, 1);
 res.status(204).send();
});
app.listen(3000, () => console.log('API de tarefas rodando na porta 3000'));


// Esse codigo não precisa de segurança para Falta de validação de entrada e Vazamento nas mensagens de erro.


//Para nao termos nenhuma tarefa apagada eles deveriam corrijir Ausência de autenticação nesse codigo
//e precisa tambem precisa de correção na falta de limites