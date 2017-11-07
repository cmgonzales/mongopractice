const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose very important
mongoose.connect('mongodb://localhost/vidjot-dev',{
//need to set that to true or error will happen    
useMongoClient: true
})
.then(()=> console.log('Mongodb Connected....'))
.catch(err => console.log("error"));

// Load Idea Model
require('./models.Idea');
const Idea = mongoose.model('ideas');

//handlebars middleware
// handle bars templete engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//how middleware works
app.use(function(req, res, next){
    //console.log(Date.now());
    req.name = 'chris';
    next();
}); 
// Index route
app.get('/', (req, res) => {
    const title = 'Welcom';
   res.render('INDEX', {title: title
});
});
// About rout
app.get('/about', (req,res) =>{
res.render('about');
});



const port = 5000;

app.listen(port, () =>{
    console.log("Server started on port " + port);
});


