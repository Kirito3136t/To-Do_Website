const express=require('express')
const asyncHandler=require('express-async-handler')
const admin = require('firebase-admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//@desc Register a new User
//@route /api/users/register
//@access PUBLIC
const registerUser=asyncHandler(async(req,res)=>{
    const{name,email,password}=req.body

    if(!name || !password || !email ){
        res.status(400)
        throw new Error('Please include all fields')
     }

    //Find if user already exists
    const userSnapshot = await db.collection('users').where('email', '==', email).get();

if (!userSnapshot.empty) {
  res.status(400);
  throw new Error('User already exists');
}


    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password,salt)

    const userData={
        name,
        email,
        password:hashPassword
    }

    const response=await db.collection("users").add(userData)

    if(response){
        res.status(201).json({
        id:response.id,
        name,
        email,
        token:generateToken(response.id)
        })
    }else{
        res.status(400)
        throw new error('Invalid user data')
    }
})
    

    const generateToken = (id) =>{
        return jwt.sign({id},process.env.JWT_SECRET,{
            expiresIn:'30d'
        })
        
    }

//@desc    Login a user
//@route   /api/users/login 
//@access  Public
const loginUser=asyncHandler(async(req,res)=>{
    const {email , password} = req.body
    
    const userRef = db.collection('users').where('email', '==', email);
    const user = await userRef.get();

    if (user.empty) {
        res.status(400);
        throw new Error('Not Authorized');
      }
    

    let passwordAuth; 
    let userId;
    let name;

    user.forEach((doc) => {
        const user = doc.data();
        name=user.name;
        userId = doc.id;
        passwordAuth = user.password;

        
        // Process the user data, including the password field
        console.log('User ID:', userId);
        console.log('Password:', password);
    })
    
    if(user && (await bcrypt.compare(password,passwordAuth))){
        res.status(200).json({
            userId,
            name,
            email,
            token:generateToken(userId)
            })
    }else{
        res.status(401)
        throw new Error ('You are unauthorized')
    }
    })
    
    

    const db=admin.firestore()

module.exports={registerUser,loginUser}