const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

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

const listSchema = ({
    name: String,
    items: [itemsSchema]
});
const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
    Item.find({})
        .exec()
        .then(foundItems => {
            console.log(foundItems);
            if(foundItems.length === 0){
                Item.insertMany(defaultItems)
                .then(() => {
                    console.log('successfully added all to todo db');
                    res.redirect('/');
                })   .catch((error) => {
                        console.log(error);
                    });
            }
            res.render("list", {
                listTitle: 'Today',
                newListToDos: foundItems
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/", (req, res) => {
    let nextToDoName = req.body.nextToDo;
    let listName = req.body.list;

    const item = new Item({
        name: nextToDoName
    });
    if (listName === 'Today') {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({ name: listName })
            .then(foundList => {
                foundList.items.push(item);
                foundList.save();
            })
            .then(() => {
                res.redirect('/' + listName);
            })
            .catch(err => {
                console.log(err);
            });
    }
});


app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listTitleInput;
    if(listName === 'Today') {
        // If the list is "Today", delete the item and redirect to the homepage "/"
        Item.findByIdAndRemove(checkedItemId)
        .then(() => {
            console.log('successfully deleted item');
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
    } else {
        // If the list is not "Today", delete the item from the list and redirect to the list's route
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
            .then(() => {  
                const listNameOnly= listName[0];
                res.redirect(`/${listNameOnly}`);
            })
            .catch(err => {
                console.log(err);
            });
    }

});

app.get("/:categoryName", (req, res) => {
    const categoryName = _.capitalize(req.params.categoryName);

    List.findOne({name: categoryName})
        .then(foundList => {
            if(!foundList) {
                // Wenn keine Liste mit dem Namen gefunden wurde, erstelle eine neue Liste
                const list = new List({
                    name: categoryName,
                    items: defaultItems
                });
                return list.save();
            } else {
                // Wenn eine Liste mit dem Namen gefunden wurde, zeige die Liste an
                return foundList;
            }
        })
        .then(list => {
            res.render("list", {
                listTitle: list.name,
                newListToDos: list.items
            });
        })
        .catch(err => {
            console.log(err);
        });
});


app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(3000, function () {
    console.log("Server started on port 3000.");
})
