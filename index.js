const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT,
      valor REAL,
      tipo TEXT
    )
  `);
});

app.delete('/items/:id', function (req, res) {
  const itemId = req.params.id;
  db.run('DELETE FROM items WHERE id = ?', [itemId], function(err) {
    if (err) {
      console.error('Erro ao excluir o item:', err);
      return res.sendStatus(500);
    } else {
      console.log('Item excluído:', itemId);
      return res.sendStatus(200);
    }
  });
});

app.get('/', function(req, res){
  db.all('SELECT * FROM items', (err, rows) => {
    if (err) {
      console.error('Erro ao ler os itens:', err);
      return res.sendStatus(500);
    } else {
      return res.json(rows);
    }
  });
});

app.post("/cadastro", function (req, res) {
  const body = req.body;
  db.run('INSERT INTO items (descricao, valor, tipo) VALUES (?, ?, ?)', [body.descricao, body.valor, body.tipo], function(err) {
    if (err) {
      console.error('Erro ao criar o item:', err);
      return res.sendStatus(500);
    } else {
      const newItem = {
        id: this.lastID,
        descricao: body.descricao,
        valor: body.valor,
        tipo: body.tipo
      };
      return res.json(newItem);
    }
  });
});

app.post("/excluir", function (req, res) {
  const itemId = req.body.itemId;
  db.run('DELETE FROM items WHERE id = ?', [itemId], function(err) {
    if (err) {
      console.error('Erro ao excluir o item:', err);
      return res.sendStatus(500);
    } else {
      console.log('Item excluído:', itemId);
      return res.sendStatus(200);
    }
  });
});

app.listen(3000, function () {
  console.log('Server listening on port 3000');
});
