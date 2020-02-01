//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date");
const  _ = require('lodash');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const workSchema = {
  item: String

};
const customListNameSchema = {
  name: String,
  list: [workSchema]
};


const todo = mongoose.model('task', workSchema);
const List = mongoose.model('list', customListNameSchema);
const task1 = new todo({
  item: "WebDevelopment"
});

const task2 = new todo({
  item: "Django"
});
const task3 = new todo({
  item: "coding"
});

defaultItems = [task1, task2, task3];




app.get("/", function(req, res) {

  let dayName = "Today";

  todo.find({}, "item ", function(err, tasks) {
    if (tasks.length === 0) {
      todo.insertMany(defaultItems, function(err) {
        if (err)
          console.log(err);
        else
          console.log("success");

      });

      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: dayName,
        tasks: tasks
      });
    }

  });
  // console.log(tasks);
});




app.get("/:customListName", function(req, res) {
  let customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName}, function(err, foundList)
   {
    if (!err)
     {
       console.log(foundList);
      if (foundList==null)
       {
        const list = new List(
          {
          name: customListName,
          list: defaultItems

        });
        list.save();
       res.redirect("/"+customListName);

      }
      else {

        res.render("list",{
          listTitle:foundList.name,
          tasks: foundList.list
        });
      }
    }
  });

});






app.post("/", function(req, res) {


  let listName = req.body.list;
  let ele = new todo({
  item  : req.body.newItem
  });


  if( listName==="Today")
  {
    ele.save();
    

    res.redirect("/");

  }
  else{
    List.findOne({name:listName},function(err,docs)
  {
docs.list.push(ele);
docs.save();
res.redirect("/"+listName);


  });


  }



});



app.post("/delete", function(req, res) {
  let checkboxId = req.body.checkbox;
  let listName=req.body.list;
  if( listName ==="Today")
  {
    todo.findByIdAndRemove(checkboxId, function(err, docs) {
      if (err)
        console.log(err);

    });

    res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name:listName},{$pull:{list:{_id:checkboxId}}},function(err,foundList)
  {

  //  console.log("success");
    res.redirect("/"+listName);

  });
  }

});



app.get("/about", function(req, res) {
  res.render("about");

});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
