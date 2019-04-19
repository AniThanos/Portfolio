const express=require('express');
const app=express();
const mongoose=require('mongoose');
const users=require('./routes/apis/users')
const profile=require('./routes/apis/profile')
const posts=require('./routes/apis/posts')
const bodyParser=require('body-parser');


//body-parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

let port=process.env.port||5002
app.listen(port,()=>console.log(`Server running on ${port}`));

const db=require('./config/keys').mongoURI;

//connect to mongodb using mongoose
mongoose.connect(db,{ useNewUrlParser: true })
    .then(()=>console.log("MongoDB connected"))
    .catch(err=>{console.log(err)})
app.get('/',(req,res)=>{
    res.send("hello World")
})

//use Routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);