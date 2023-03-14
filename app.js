const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = ({
    name: String
});
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item."
});
const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems)
.then(() => {

    console.log('successfully added all to todo db');
})   .catch((error) => {
        console.log(error);
    });

app.get("/", (req, res) => {
    let day = date.getDay()
    res.render("list", {
        listTitle: 'Today',
        newListToDos: ToDos
    })
});

app.post("/", (req, res) => {
    let nextToDo = req.body.nextToDo;

    if (req.body.list === 'Work') {
        workToDos.push(nextToDo);
        res.redirect("/work");
    }
    else {
        ToDos.push(nextToDo);
        res.redirect("/");
    }
})

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newListToDos: workToDos })
})

app.post("/work", (req, res) => {
    let nextToDo = req.body.nextToDo;
    workToDos.push(nextToDo);
    res.redirect("/work");
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(3000, function () {
    console.log("Server started on port 3000.");
});