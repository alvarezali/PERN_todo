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

  const getTodos = async () => {
    try {
      const res = await axios.get(`${URL}/todos`);
      setTodos(res.data);
    } catch(err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getTodos();
  }, [])
  
  //Submit new todo
  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    const dataObj = Object.fromEntries(formData.entries());
    
    try {
      await axios.post(`${URL}/todos`, {
        ...dataObj,
        completed: false,
      });
      e.target.reset();
      getTodos();
    } catch(err) {
      console.error(err.message);
    }
  }

  //Submit changes to edit a todo
  const submitChanges = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dataObj = Object.fromEntries(formData.entries());

    try {
      await axios.put(`${URL}/todos/${editTodo}`,{
        description: dataObj.description,
      });
      setEditedText('');
      setEditTodo(null);
      e.target.reset();
      getTodos();
    } catch(err) {
      console.error(err.message);
    }
  }

  //Delete todo
  const submitDelete = async (id) => {
    try {
      await axios.delete(`${URL}/todos/${id}`);
      setEditTodo(null);
      setTodos(todos => todos.filter(todo => todo.todo_id !== id));
    } catch(err) {
      console.error(err.message);
    }
  }

  //Toggle complete todo
  const submitCompleted = async (id, description, completed) => {
    try {
      await axios.put(`${URL}/todos/${id}`, {
        description: description,
        completed: !completed,
      });
      setTodos(todos => todos.map(todo => (todo.todo_id === id ? {...todo, completed: !todo.completed} : todo)));
    } catch(err) {
      console.log(err.message);
    }
  }

  return (

    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4" >
      <div className="fixed top-10 bg-gray-300 rounded-xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl text-center font-bold text-gray-700 mb-8">PERN TODO APP</h1>
        <CreateTodo submitForm={submitForm} />
        <div>
          {todos.length ===0 ? 
          (<p className='text-gray-600'>No tasks available. Add a new task!</p>) : 
          (
            <div className='flex flex-col gap-y-4'>
              {todos.map((todo) => {
                return (
                  <div key={todo.todo_id}>
                    {editTodo === todo.todo_id ? 
                    (<EditTodo submitChanges={submitChanges} setEditTodo={setEditTodo} todo={todo} editedText={editedText} />) : 
                    (<Todo submitCompleted={submitCompleted} setEditTodo={setEditTodo} setEditedText={setEditedText} submitDelete={submitDelete} todo={todo} />)}
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
