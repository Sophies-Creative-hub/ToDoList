//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const date = require(__dirname+"/date.js")

const ToDos= ["Buy Food", "Cook the Food", "Eat the Food"];
const workToDos = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.get("/", (req, res) => {
    let day = date.getDay()
    res.render("list", { 
        listTitle: day,
        newListToDos : ToDos })
});

app.post("/", (req, res)=>{
    let nextToDo = req.body.nextToDo;
    
    if(req.body.list==='Work'){
        workToDos.push(nextToDo);
        res.redirect("/work");
    }
    else{
        ToDos.push(nextToDo);
        res.redirect("/");
    }
})

app.get("/work", (req, res)=>{
    res.render("list", {listTitle:"Work List", newListToDos: workToDos})
})

app.post("/work", (req, res)=>{
    let nextToDo = req.body.nextToDo;
    workToDos.push(nextToDo);
    res.redirect("/work");
})

app.get("/about", (req, res)=>{
    res.render("about");
})

app.listen(3000, function() {
    console.log("Server started on port 3000.");
});