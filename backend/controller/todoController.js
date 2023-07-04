const asyncHandler = require('express-async-handler')
const admin = require('firebase-admin')


//Get all task
const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    // Get user document from Firestore
    const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
    const user = userSnapshot.data();

    if (!user) {
      res.status(401);
      throw new Error('No user found');
    }

 // Get tickets from Firestore based on the user ID
const tasksSnapshot = await admin.firestore().collection('tasks').where('user', '==', userId).get();
const tasks = [];

tasksSnapshot.forEach((taskSnapshot) => {
  const task = taskSnapshot.data();
  const taskId = taskSnapshot.id; // Get the task ID
  task.taskId = taskId; // Add the task ID to the task object
  tasks.push(task);
});

res.status(200).json(tasks);

  } catch (error) {
    res.status(500);
    throw new Error('Server error');
  }
});

//Get single tasl
const getTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  try {
    // Get user document from Firestore
    const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
    const user = userSnapshot.data();

    if (!user) {
      res.status(401);
      throw new Error('No user found');
    }

    // Get task document from Firestore
    const taskSnapshot = await admin.firestore().collection('tasks').doc(taskId).get();
    const task = taskSnapshot.data();

    if (!task) {
      res.status(400);
      throw new Error('No task found');
    }

    if (task.user !== userId) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const { title, description, priority, createdAt ,time } = task; // Destructure the task object

    res.status(200).json({ title, description, priority, taskId, createdAt ,time});
  } catch (error) {
    res.status(500);
    throw new Error('Server error');
  }
});





    
//Create tickets
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, time } = req.body;
  const userId = req.user.id;

  try {
    // Create a new task document in the "tasks" collection
    const taskRef = await admin.firestore().collection('tasks').add({
      title,
      description,
      priority,
      time,
      user: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      taskId: '', // Initialize the taskId field with an empty value
    });

    // Retrieve the newly created task document ID
    const taskId = taskRef.id;

    // Update the taskId field in the task document with the actual taskId
    await taskRef.update({ taskId });

    // Retrieve the newly created task document
    const taskSnapshot = await taskRef.get();
    const task = taskSnapshot.data();

    res.status(201).json(task);
  } catch (error) {
    res.status(500);
    throw new Error('Server error');
  }
});


// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  try {
    // Get user document from Firestore
    const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
    const user = userSnapshot.data();

    if (!user) {
      res.status(401);
      throw new Error('No user found');
    }

    // Get task document from Firestore
    const taskRef = admin.firestore().collection('tasks').doc(taskId);
    const taskSnapshot = await taskRef.get();
    const task = taskSnapshot.data();

    if (!task) {
      res.status(400);
      throw new Error('No task found');
    }

    if (task.user !== userId) {
      res.status(401);
      throw new Error('Not authorized');
    }

    // Delete the task document
    await taskRef.delete();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500);
    throw new Error('Server error');
  }
});

    
    

    const db=admin.firestore()

    module.exports={
        getTasks,
        getTask,
        createTask,
        deleteTask
    }