import {useState, useEffect} from 'react';
import axios from 'axios';
import {URL} from './config.js';
import {Todo} from './components/Todo.jsx'
import {EditTodo} from './components/EditTodo.jsx';
import {CreateTodo} from './components/CreateTodo.jsx';
import {FaTrash} from 'react-icons/fa6';
import {IoClose} from 'react-icons/io5'
import {MdOutlineDone, MdModeEditOutline} from 'react-icons/md';


function App() {

  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Get all todos from pgAdmin4
  const getTodos = async () => {

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${URL}/todos`);
      setTodos(res.data);
    } catch(err) {
      console.error(err.message);
      setError('Failed to fetch todos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  //Mount all todos on page load
  useEffect(() => {
    getTodos();
  }, [])
  
  //Submit newly created todo
  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    const dataObj = Object.fromEntries(formData.entries());
    
    if(!dataObj.description.trim()) {
      alert('Please provide a description.');
      document.getElementById('form-input').focus();
      return
    } 

    try {
      const res = await axios.post(`${URL}/todos`, {
        ...dataObj,
        completed: false,
      });
      e.target.reset();
      setTodos(prevTodos => [...prevTodos, res.data]);

    } catch(err) {
      console.error(err.message);
      setError('Failed to add todo. Please, try again.');
    }
  }

  //Submit edited todo
  const submitChanges = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dataObj = Object.fromEntries(formData.entries());

    const currDescription = todos.find(todo => todo.todo_id === editTodo).description;
    const newDescription = dataObj.description.trim();

    if(currDescription === newDescription) {
      setEditTodo(null);
      return;
    }

    if(!dataObj.description.trim()) {
      alert('Please provide a description.');
      document.getElementById(editTodo).focus();
      return;
    } 

    try {
      setError(null);
      await axios.put(`${URL}/todos/${editTodo}`,{
        description: dataObj.description,
      });
      e.target.reset();
      setEditedText('');
      setEditTodo(null);
      setTodos(todos.map(todo => todo.todo_id === editTodo ? {...todo, description: dataObj.description, completed: false} : todo ));

    } catch(err) {
      console.error(err.message);
      setError('Failed to update todo. Please, try again.');
    }
  }

  //Delete todo
  const submitDelete = async (id) => {
    try {
      setError(null);
      await axios.delete(`${URL}/todos/${id}`);
      setEditTodo(null);
      setTodos(todos => todos.filter(todo => todo.todo_id !== id));
    } catch(err) {
      console.error(err.message);
      setError('Failed to delete todo. Please, try again.');
    }
  }

  //Toggle complete todo
  const submitCompleted = async (id, description, completed) => {
    try {
      setError(null);
      await axios.put(`${URL}/todos/${id}`, {
        description: description,
        completed: !completed,
      });
      setTodos(todos => todos.map(todo => (todo.todo_id === id ? {...todo, completed: !todo.completed} : todo)));
    } catch(err) {
      console.log(err.message);
      setError('Failed to update todo. Please, try again.');
    }
  }

  //Rendering react components
  return (

    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4" >
      <div className="fixed top-10 bg-gray-300 rounded-xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl text-center font-bold text-gray-700 mb-8">PERN TODO APP</h1>
        
        <CreateTodo submitForm={submitForm} />

        {error && (
          <div className='flex justify-center items-center w-full h-5 rounded-xl bg-red-100 text-sm text-gray-300 p-4 rounded'>
            {error}
          </div>
        )}

        <div>
          {loading ? (
            <div className='w-full h-40 rounded-3xl flex justify-center items-center bg-yellow-200'>
              <h1 className='text-gray-800 text-4xl font-bold'>Loading task...</h1>
            </div>
          ) : todos.length ===0 ? 
          (<p className='text-gray-900'>No tasks available. Add a new task!</p>) : 
          (
            <div className='flex flex-col gap-y-4'>
              {todos.map((todo) => {
                return (
                  <div key={todo.todo_id}>
                    {editTodo === todo.todo_id ? 
                    (<EditTodo 
                        submitChanges={submitChanges} 
                        setEditTodo={setEditTodo} 
                        editedText={editedText}
                        todo={todo}  />) : 
                    (<Todo 
                      submitCompleted={submitCompleted}
                      setEditedText={setEditedText}
                      submitDelete={submitDelete}
                      setEditTodo={setEditTodo}             
                      todo={todo} />)}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>

  )
}

export default App
