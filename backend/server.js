const express = require('express')
const app = express()

const {errorHandler } = require('./middleware/errorMiddleWare')
const dotenv=require('dotenv').config()
const PORT = process.env.PORT || 8000 
const admin = require('firebase-admin')
const credentials = require('../key.json')

admin.initializeApp({
    credential:admin.credential.cert(credentials)
})

app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.use('/',require('./routes/userRoutes'))

app.use('/',require('./routes/todoRoute'))

app.use(errorHandler)

const db=admin.firestore()

app.listen(PORT,()=>{console.log(`Running on port: ${PORT}`)})