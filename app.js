const express = require("express");
const bodyParser = require("body-parser");
const mongoose =require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema={
    name: String
};

const Item =mongoose.model("Item",itemSchema);

const item1= new Item({
    name: "Hit the + button to add a new item."
});

const item2= new Item({
    name: "okHit the + button to add a new item."
});

const item3= new Item({
    name: "notHit the + button to add a new item."
});

const defaultItem =[item1, item2, item3];

// Item.insertMany(defaultItem).then((success)=>{console.log("success")}).catch((err)=>{console.log("error")});


var items=["bread","milk","butter"];
var workitem=[];

async function getItems(){
    const Items = await Item.find({});
    return Items;
}
app.get("/",function(req,res){
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    var day=today.toLocaleDateString("en-US", options);

    getItems().then(function(foundItems){

        if (foundItems.length ===0){
            Item.insertMany(defaultItem).then((success)=>{console.log("success")}).catch((err)=>{console.log("error")});
            res.redirect("/");
        } else{
            res.render("list",{listtitle: day, additem: foundItems});
        }
       
    })

  
    
});

app.get("/work",function(req,res){
    res.render("list",{listtitle: "Work",additem: workitem});
});

app.post("/",function(req,res){

    const itemName = req.body.newitem;
    const item = new Item({
        name: itemName
    });

    item.save();
    res.redirect("/");

});

app.post("/delete", function(req,res){
   const checkedItemId= req.body.checkbox;
   Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
        console.log("zzzz")
    }
   })
})

app.get("/about",function(req,res){
    res.render("about")
});

app.listen(3000,function(){
    console.log("server started at port 3000");
});
