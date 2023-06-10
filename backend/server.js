/*import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
import express from 'express';
const app = express();

async function createUser(email, password) {
  const newUser = await prisma.user.create({
    data: {
      email,
      password
    }
  })
  console.log('New user created:', newUser)
  return newUser
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id }
  })
  console.log('Found user:', user)
  return user
}


async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new Error('Invalid email or password')
  }

  const passwordMatches = user.password === password

  if (!passwordMatches) {
    throw new Error('Invalid email or password')
  }

  console.log('User logged in:', user)
  return user
}


// CREATE a new to-do list item for a user
async function createToDoListItem(userId, text) {
  const newToDoListItem = await prisma.toDoListItem.create({
    data: {
      text,
      user: { connect: { id: userId } }
    }
  })
  console.log('New to-do list item created:', newToDoListItem)
  return newToDoListItem
}

// READ all to-do list items for a user by user ID
async function getAllToDoListItemsForUser(userId) {
  const toDoListItems = await prisma.toDoListItem.findMany({
    where: { userId }
  })
  console.log('Found', toDoListItems.length, 'to-do list items for user with ID', userId)
  console.log(toDoListItems)
  return toDoListItems
}



// DELETE a to-do list item by ID
async function deleteToDoListItem(id) {
  const deletedToDoListItem = await prisma.toDoListItem.delete({
    where: { id }
  })
  console.log('To-do list item deleted:', deletedToDoListItem)
  return deletedToDoListItem
}


app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Test the CRUD operations
async function main() {
 // await prisma.$connect()

  // Create a new user
  //const newUser = await createUser('hello@example.com', 'password')

  

  // Read a single user by ID
  //const userById = await getUserById(newUser.id)


  // Create a new to-do list item for a user
  //const newToDoListItem = await createToDoListItem(userById.id, 'Buy groceries')

  // Read all to-do list items for a user by user ID
  //const allToDoListItemsForUser = await getAllToDoListItemsForUser(userById.id)


  // Delete a to-do list item by ID
 //const deletedToDoListItem = await deleteToDoListItem(newToDoListItem.id)


 //const user = await login('hello@example.com', 'password')

 // await prisma.$disconnect()
}

main()
  .catch(e => {
    console.error(e)
  //  process.exit(1)
  })*/


  import { PrismaClient } from '@prisma/client';
import express from 'express';
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Route to register a new user
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const newUser = await prisma.user.create({
    data: {
      email,
      password,
    },
  });
  res.json({ message: 'User registered successfully', id: newUser.id });
});

// Route to login as a user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const passwordMatches = user.password === password;
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', userId: user.id });
});

// Route to add a new task
app.post('/tasks', async (req, res) => {
  const { userId, text } = req.body;
  if (!userId || !text) {
    return res.status(400).json({ message: 'User ID and text are required' });
  }
  const newTask = await prisma.toDoListItem.create({
    data: {
      text,
      user: { connect: { id: userId } },
    },
  });
  res.json({ message: 'Task added successfully', taskId: newTask.id });
});
//retutn all the tasks to one user 
app.get('/tasks/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const tasks = await prisma.toDoListItem.findMany({
    where: { userId: userId },
  });
  res.json(tasks);
});
// Route to delete a task by ID
app.delete('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const deletedTask = await prisma.toDoListItem.delete({
    where: { id: taskId },
  });
  if (!deletedTask) {
    return res.status(404).json({ message: `Task with ID ${taskId} not found` });
  }
  res.json({ message: `Task with ID ${taskId} deleted successfully` });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});