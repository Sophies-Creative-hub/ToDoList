//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let ToDos= ["Buy Food", "Cook the Food", "Eat the Food"]

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req, res) => {
    let today = new Date();
    let options = {
        weekday:'long',
        day:'numeric',
        month: 'long'
    }
    let day= today.toLocaleDateString("en-US", options)

    res.render("list", { 
        kindOfDay: day,
        newListToDos : ToDos })
});

app.post("/", (req, res)=>{
    let nextToDo = req.body.nextToDo;
    ToDos.push(nextToDo);
    res.redirect("/");
})


app.listen(3000, function() {
    console.log("Server started on port 3000.");
});