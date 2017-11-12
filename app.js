const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Load routes
const ideas = require('./routes/ideas')

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose very important
mongoose.connect('mongodb://localhost/myapp',{
//need to set that to true or error will happen    
useMongoClient: true
})
.then(()=> console.log('Mongodb Connected....'))
.catch(err => console.log("connection error"));


//handlebars middleware
// handle bars templete engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser access what ever submited in textfirld
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

//middleware for express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

//global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Index route
app.get('/', (req, res) => {
    const title = 'Welcome';
   res.render('INDEX', {title: title
});
});

// About route
app.get('/about', (req, res) =>{
res.render('about');
});


//User login route
app.get('/user/login', (req, res) => {
    res.send('login');
});

//user register route
app.get('/user/register', (req, res) => {
    res.send('register');
});

// Use Routes
app.use('/ideas', ideas);

const port = 5000;

app.listen(port, () =>{
    console.log("Server started on port " + port);
});

