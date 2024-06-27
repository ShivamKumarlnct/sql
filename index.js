const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override")
const { log } = require('util');
const { v4:uuidv4} = require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

app.set("view engin","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test',
  password:'Lnct@2025'
});

let getuser = () => {
  return [
     faker.string.uuid(),
    faker.internet.userName(),
   faker.internet.email(),
    faker.internet.password()
  ];
}

// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// let data=[];
// for(let i=0;i<100;i++){
//   data.push(getuser());
//   console.log(getuser());
// }



// --------------------count user------------------------
app.get("/",(req,res)=>{
  let q = `SELECT COUNT(*) AS count FROM user`;

  try{
connection.query( q ,(err,result) => {
  if(err)throw err;
let count=result[0].count;
  res.render("home.ejs", {count});
});
}
catch(err){
  console.log(err);
  res.send("some error occured");
}
});
// ---------------user------------------

app.get("/user",(req,res)=>{
  let q = `SELECT * FROM user`;
  try{
connection.query( q ,(err,users) => {
  if(err)throw err;
  // res.send(result);
  res.render("show.ejs",{users})
});
}
catch(err){
  console.log(err);
  res.send("some error occured");
}
})
// --------------------edit---------------------------------------
app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try{
connection.query( q ,(err,result) => {
  if(err)throw err;
  // res.send(result);
  let user=result[0];
  res.render("edit.ejs",{user});
  console.log(user);
});
}
catch(err){
  console.log(err);
  res.send("some error occured");
}
})

// -----------------update---------------------------------------

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formpass, username: newusername } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try{
connection.query( q ,(err,result) => {
  if(err)throw err;
  // res.send(result);
  let user=result[0];
  // res.render("edit.ejs",{user});
  if(formpass != user.password){
    res.send("WRONG password");
  }else{

    let q2=`UPDATE USER SET USERNAME='${newusername}'WHERE id='${id}'`;
    connection.query(q2,(err,result)=>{
      if(err) throw err;
      res.redirect("/user");
    })
  }
});
}
catch(err){
  console.log(err);
  res.send("some error occured");
}
})
// ---------------add-----------------------------------------
app.get("/user/add",(req,res)=>{
  res.render("add.ejs");
})

app.post("/user/add", (req, res) => {
  let { username, email,password} = req.body;
    let id=uuidv4();
 let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occurred");
  }
});

// ---------------------delete-----------------
app.get("/user/id/delete",(req,res)=>{
  let {id}=user.params;
  res.send("hi",{id});
  console.log("h");
})











// -------------port-------------------------------





let port=8080;
app.listen(port,()=>{
  console.log(`server localhost/${port}`);
})


// ----------count------------------------------------
// try{
// connection.query( q , (err,result) => {
//   if(err)throw err;
// let count=result[0]["count(*)"];
// res.render("home.ejs",{count});
// })
// ;}
// catch(err){
//   res.send("some error occured");
// }
