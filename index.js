const express=require('express');
const bodyParser=require('body-parser');
const path= require('path');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const pug=require('pug')
const mongoose=require('mongoose');
const passport=require('passport');
const ms=require('connect-mongo')(session);
const flash=require('express-flash');
const dotenv=require('dotenv').config();


mongoose.connect(process.env.DBURI,()=>{
    console.log("M Lab Connectrd")
});

require('./config/passport');

const app=express();
// const indexRoute=require('./controllers/index')

app.set('view engine','pug');



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname+'/public/stylesheets')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret:'File',
    resave:true,
    saveUninitialized:true,
    store: new ms({mongooseConnection:mongoose.connection})
    
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(require('./controllers/index'));
app.use(require('./controllers/user'));


module.exports= app
