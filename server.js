// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const low = require('lowdb');
const shortid = require("shortid")
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const bodyParser = require('body-parser')
const db = low(adapter);

var List = db.get('todoList').value()

db.defaults({ todoList: [] }).write();
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.set('views engine', 'pug');
app.set('views', './views');
app.get('/', function(req,res){
    res.render('index.pug',{ todoList: db.get("todoList").value()});
});
app.get('/todos/create',function(req,res){
    res.render("create.pug")    
})
app.get('/todos/:id', function(req,res){
  var id = req.params.id;
    db.get('todoList').remove({id:id}).write()
    res.render("index.pug",{todoList: db.get('todoList').value()})
})
app.post('/todos/create', function(req,res){
  req.body.id = shortid.generate();
  db.get("todoList").push(req.body).write()
  res.redirect('/')
})
app.get('/todos', function(req,res){   
    var q = req.query.q
    if (q){
        var matchedTodo = List.filter(function(){
            return db.get('todoList').find(name).value().toLowerCase().indexOf(q.toLowerCase()) !== -1    
        })
    } else {
        matchedTodo = List  
    }
    res.render('index.pug',{
        todoList: matchedTodo
    })
})



// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});