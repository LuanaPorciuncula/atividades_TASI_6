var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/createPeriod', function (req, res) {
  fs.readFile(__dirname + "/" + "periodos.json", 'utf8', function (err, data) {
    if (err) {
      res.json(err);
    } else {
      var periodos = JSON.parse(data);
      periodos.periodos.push(req.body);
      console.log(periodos);

      fs.writeFile('periodos.json', JSON.stringify(periodos), function (err) {
        if (err) {
          res.json(err);
        } else {
          res.json(periodos);
        }
      });
    }
  });
})

app.get('/readPeriods', function (req, res) {
  fs.readFile(__dirname + "/" + "periodos.json", 'utf8', function (err, data) {
    if (err) {
      res.json(err);
    } else {
      var periodos = JSON.parse(data);

      console.log(periodos);
      res.json(periodos);
    }
  });
})

app.put('/updatePeriod', function (req, res) {
  fs.readFile(__dirname + "/" + "periodos.json", 'utf8', function (err, data) {
    if (err) {
      res.json(err);
    } else {
      var periodos = JSON.parse(data);

      periodos.periodos.forEach(function (periodo) {
        if (periodo.periodo == req.body.periodo) {
          periodo.detalhes = req.body.detalhes;
          console.log(periodo);
        }
      });

      fs.writeFile('periodos.json', JSON.stringify(periodos), function (err) {
        if (err) {
          res.json(err);
        } else {
          res.json(periodos);
        }
      });
    }
  });
})


app.delete('/deletePeriod', function (req, res) {
  fs.readFile(__dirname + "/" + "periodos.json", 'utf8', function (err, data) {
    if (err) {
      res.json(err);
    } else {
      var periodos = JSON.parse(data);
      var id = periodos.periodos.findIndex((periodo) => periodo.periodo == req.body.periodo)
      if (id != -1) {
        periodos.periodos.splice(id, 1);
        console.log(periodos);
  
        fs.writeFile('periodos.json', JSON.stringify(periodos), function (err) {
          if (err) {
            res.json(err);
          } else {
            res.json(periodos);
          }
        });
      } else {
        res.json({"error": "Elemento não existe na base de dados"});
      }
     
    }
  });
})

var server = app.listen(4000, 'localhost', function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})