const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const { Pool } = require('pg');

PGHOST='ep-black-pond-15230669.us-east-2.aws.neon.tech'
PGDATABASE='neondb'
PGUSER='rondicunha'
PGPASSWORD='uPZxLDm7s0Ol'

const pool = new Pool({
  user: 'rondicunha',
  password: 'uPZxLDm7s0Ol',
  host: 'ep-black-pond-15230669.us-east-2.aws.neon.tech', // Exemplo: db.neon.tech
  port: 5432, // Porta padrão do PostgreSQL
  database: 'neondb',
  ssl: {
    rejectUnauthorized: false, // Adicione essa opção para evitar erros de certificado no desenvolvimento
    sslmode: 'require', // Use sslmode=require para forçar o uso do SSL
  },
});

app.delete('/items/:id', function (req, res) {
  const itemId = req.params.id;
  pool.query('DELETE FROM items WHERE id = $1', [itemId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir o item:', err);
      return res.sendStatus(500);
    } else {
      console.log('Item excluído:', itemId);
      return res.sendStatus(200);
    }
  });
});

// Exemplo de SELECT com PostgreSQL
app.get('/', function(req, res){
  pool.query('SELECT * FROM items', (err, result) => {
    if (err) {
      console.error('Erro ao ler os itens:', err);
      return res.sendStatus(500);
    } else {
      return res.json(result.rows);
    }
  });
});

// Exemplo de INSERT com PostgreSQL
app.post("/cadastro", function (req, res) {
  const body = req.body;
  pool.query('INSERT INTO items (descricao, valor, tipo) VALUES ($1, $2, $3) RETURNING *', [body.descricao, body.valor, body.tipo], (err, result) => {
    if (err) {
      console.error('Erro ao criar o item:', err);
      return res.sendStatus(500);
    } else {
      const newItem = result.rows[0];
      return res.json(newItem);
    }
  });
});

app.listen(3000, function () {
  console.log('Server listening on port 3000');
});
