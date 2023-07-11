var express = require('express');
var app = express();
var cors = require('cors');

app.use(cors());
app.use(express.json());
itens = [{
            "descricao": 'Salário',
            "valor": '1500,00',
            "tipo": 'Entrada'
        },
        {
            "descricao": 'Cinema',
            "valor": '50,00',
            "tipo": 'Saída'
        }];

    app.delete('/items/:id', function (req, res) {
        const itemId = req.params.id;
        itens = itens.filter((item) => item.id !== itemId);
        return res.sendStatus(200);
    });    
           
app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
})

app.get('/', function(req, res){
    return res.json(itens);
})

app.post("/cadastro", function (req, res) {
    const body = req.body;
    itens.push(body)
    return res.json(itens)
});

app.post("/excluir", function (req, res) {
    const itemToDelete = req.body;
    itens = itens.filter((item) => item.descricao !== itemToDelete);
    return res.json(itens);
  });


app.listen(3000)