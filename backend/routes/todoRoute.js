const express = require('express')
const router=express.Router()
const{getTasks,deleteTask,createTask,getTask}=require('../controller/todoController')
const {protect} = require('../middleware/authMiddleware')

router.route('/task').get(protect,getTasks).post(protect,createTask)

router.route('/task/:id').get(protect,getTask).delete(protect,deleteTask)

module.exports=router