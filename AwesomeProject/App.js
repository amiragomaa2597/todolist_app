import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [toDoList, setToDoList] = useState([]);
  const [user, setUser] = useState(null);
  const update = async id => {
    if (id != null) {
      await fetch(`http://10.0.2.2:3000/tasks/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async response => await response.json())
        .then(async data => {
          console.log(data);
          const updatedTodoItems = await data.map(task => ({
            id: task.id,
            text: task.text,
          }));
          await setToDoList(updatedTodoItems);
        })
        .catch(error => console.error(error));
      setIsAuthenticated(true);
    }
  };
  const handleLoginPress = async () => {
    setToDoList([]);
    setUser(null);
    await fetch('http://10.0.2.2:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(async response => await response.json())
      .then(async data => {
        console.log(data.userId);
        if (data.userId) {
          setUser(data.userId);
          await update(user);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(error => console.error(error));
  };

  const handleRegisterPress = () => {
    // This function will handle the navigation to registration page
    setIsRegistering(true);
    setUser(null);
    setEmail(null);
    setPassword(null);
    setNewItemText([]);
  };
  const handleRegisterDone = async () => {
    setIsRegistering(false);
    setUser(null);
    setEmail(null);
    setPassword(null);
    setNewItemText([]);
    await fetch('http://10.0.2.2:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(async response => await response.json())
      .then(async data => {
        await setUser(data.id);
        console.log(data.id);
      })
      .catch(error => console.error(error));
    if (user != null) {
      update(user);
    } else {
      setIsAuthenticated(false);
    }
  };

  const handleBackPress = () => {
    // This function will handle going back to the previous page
    setIsRegistering(false);
    setIsAuthenticated(false);
    setUser(null);
    setEmail(null);
    setPassword(null);
    setNewItemText([]);
  };
  const handleAddItemPress = async () => {
    if (newItemText && user) {
      await fetch('http://10.0.2.2:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newItemText,
          userId: user,
        }),
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }
    setNewItemText('');
    await update(user);
  };

  const handleDoneItemPress = async id => {
    // This function will handle deleting an item from the to-do list
    setToDoList(toDoList.filter(item => item.id !== id));

    // Delete the task with the given ID
    await fetch(`http://10.0.2.2:3000/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Task deleted successfully');
      })
      .catch(error => console.error(error));
  };

  if (isRegistering) {
    return (
      <View style={[styles.container, styles.purpleBackground]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegisterDone}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (isAuthenticated) {
    return (
      <View style={[styles.container, styles.purpleBackground]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>To-Do List</Text>
        <View style={styles.addItemContainer}>
          <TextInput
            style={[styles.input, styles.addItemInput]}
            placeholder="Add new item..."
            value={newItemText}
            onChangeText={setNewItemText}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddItemPress}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {toDoList.map(item => (
          <View key={item.id} style={styles.listItem}>
            <Text style={styles.listItemText}>{item.text}</Text>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => handleDoneItemPress(item.id)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  } else {
    return (
      <View style={[styles.container, styles.purpleBackground]}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegisterPress}>
          <Text style={styles.registerButtonText}>Register Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    overflow: 'scroll',
  },
  purpleBackground: {
    backgroundColor: '#8B00FF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  registerButton: {
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addItemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  addItemInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    width: '100%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  listItemText: {
    flex: 1,
    color: '#333',
  },
  doneButton: {
    backgroundColor: '#8B00FF',
    padding: 10,
    borderRadius: 5,
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
