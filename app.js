const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
 
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
    const title = 'Welcome to the  ';
   res.render('INDEX', {title: title
});
});
// About rout
app.get('/about', (req,res) =>{
res.render('about');
});
//Search route

app.get("/search", (req, res) =>{
    res.render('search');
});


const port = 5000;

app.listen(port, () =>{
    console.log("Server started on port " + port);
});


