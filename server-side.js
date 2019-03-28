require("babel-register");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const fs = require("fs");
const multer =require("multer");
const upload = multer({dest : '/upload/'})
const express = require("express");
const app = express();

// connexion à la base de donnéés
var connexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "petitChef_db"
});

connexion.connect(err => {
  if (err) console.log(err.message);
  else {
    // middlewares
    app.use("/assets", express.static("public"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // moteur template
    app.set("view engine", "ejs");

    // routes
    app.get("/", (req, res) => {
      res.render('index');
  });
      app.get("/admin", (req, res) => {
        res.send('admin');
    });


    app.post("/authentification", function(req, res) {
      var email = req.body.email;
      var password = req.body.password;
      var admin_email;
      var admin_password;
      connexion.query("SELECT * FROM administrateur", function(err, result, fields) {
        if (err) throw err;
           admin_email = result[0].email;
      admin_password = result[0].password; 
      });
      
      if (email != admin_email || password != admin_password) {
        res.redirect("/");
      } else {
        res.render("admin");
      }
    });

    app.post("/contribution", function(req, res) {
      var email = req.body.email;
      var commentaire = req.body.commentaire;
      connexion.query(
        "INSERT INTO contribution VALUES(null, '" + email + "','" + commentaire + "')" , function (err) {
          if (err) throw err
    });
    res.render('index');
    connexion.end();
    });

    app.post("/newsletter", function(req, res) {
      var nom = req.body.nom;
      var prenoms = req.body.prenoms;
      var email = req.body.email;
      connexion.query(
        "INSERT INTO newsletter VALUES(null,'"+ nom +"', '" + prenoms +"', '" + email+"')", function (err,result, fields) {
          if (err) throw err;
        });
        res.render('index');
      connexion.end();
    });
    app.post("/article", upload.single('img'), function(req, res) {
      var img = req.file.filename;
      var recette = req.body.recette;
      connexion.query("INSERT INTO article VALUES(null,'"+img+"', '"+recette+"') ", function (err,result, fields) {
          if (err) throw err;
        });
        connexion.end();
    });
  }
});

app.listen(1090);
