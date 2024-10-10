const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const tasksRoutes = require('./routes/tasks');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const port = 4000;


const app = express();
app.set('port', port);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.engine('.hbs', engine({ extname: '.hbs'}));
//motor de plantilla
app.set('view engine', 'hbs');

// archivos estaticos
app.use(express.static("public"));
//setamos la variables de entorno
dotenv.config({ path: "./env/.env" });
// uso de cookie
app.use(cookieParser());



app.use(myconnection(mysql, {
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'azmevet3'}, 'single'));

app.listen(app.get('port'), () => {
  console.log('Escuchando el puerto ', app.get('port'));
});

app.use('/', tasksRoutes);

app.get('/', (req, res) => {
  res.render('home');
});
