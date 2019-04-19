const express=require('express');
const router=express.Router();
const User=require('../../model/User')
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');

//@route Get /api/users/test
//test
router.get('/test',(req,res)=>{
    res.json({msg:"users work"})
})

//@route Post /api/users/register
//register
router.post('/register',(req,res)=>{
    console.log(1);
    
    User.findOne({email:req.body.email})
    .then(user=>{
        if(user){
        return res.status(400).json({email:"Email already exist"})
    }else{
        console.log(2)
        const avatar=gravatar.url(req.body.email,{
            s:'200',//size
            r:'pg', //rating
            d:'mm'//default
        });
        const newUser=new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            avatar
        });

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                newUser.password=hash;
                newUser
                .save()
                .then(user=>res.json(user))
                .catch(err=>console.log(err))
            })
        })

    }
    })
    console.log(3)
})
module.exports=router 