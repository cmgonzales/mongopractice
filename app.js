const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose very important
mongoose.connect('mongodb://localhost/vidjot-dev',{
//need to set that to true or error will happen    
useMongoClient: true
})
.then(()=> console.log('Mongodb Connected....'))
.catch(err => console.log("connection error"));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

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
}))

app.use(flash());

//global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// //how middleware works
// app.use(function(req, res, next){
//     //console.log(Date.now());
//     req.name = 'chris';
//     next();
// }); 
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

//Add Idea Form
app.get('/ideas/add', (req, res) =>{
    res.render('ideas/add');
    });

    //edit Idea Form
app.get('/ideas/edit/:id', (req, res) =>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        res.render('ideas/edit',{
            idea:idea
        });
    });
    res.render('ideas/edit');
    });


    //Idea Index page
    app.get('/ideas', (req, res) =>{
        Idea.find({})
        .sort({date: "desc"})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        });
        res.render('ideas/index');
    });

    //process form
    app.post('/ideas', (req, res) => {
       let errors = []

       if(!req.body.title){
           errors.push({text:'Please add a title'});
       }
       if(!req.body.details){
           errors. push({text: 'Please add some details'})
       }
       if(errors.length > 0){
           res.render('ideas/add', {
               errors: errors,
               title: req.body.title,
               detals:req.body.details
           });
       }else{
           const newUser = {
               title: req.body.title,
               details: req.body.details,
               
           }
           new Idea(newUser)
           .save()
           .then(idea => {
            req.flash('success_msg', 'Video idea added');
            res.redirect('/ideas');
           })
       }
    });

//Edit form process
app.put('/ideas/:id', (req, res) =>{
    Idea.findOne({
        _id: req.params._id
    })
    .then(idea =>{
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Video idea updated');
            res.redirect('/ideas');
        })
    })
});

//delete idea
app.delete('/ideas/:id',(req, res) =>{
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
    })
});

const port = 5000;

app.listen(port, () =>{
    console.log("Server started on port " + port);
});

