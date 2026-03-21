import {useState, useEffect} from 'react';
import axios from 'axios';
import {URL} from './config.js';
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

  const submitDelete = async (id) => {
    try {
      await axios.delete(`${URL}/todos/${id}`);
      setEditTodo(null);
      setTodos(todos => todos.filter(todo => todo.todo_id !== id));
    } catch(err) {
      console.error(err.message);
    }
  }

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
        
        <form onSubmit={submitForm} className='flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6'>
          <input 
            className='flex-1 w-full outline-none px-3 py-2 text-gray-600 placeholder-gray-600 '
            name='description'
            type="text"  
            placeholder='Your task here' 
            required 
          />
          <button type='submit' className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer'>
            Add task
          </button>
        </form>

        <div>
          {todos.length ===0 ? 
          (
            <p className='text-gray-600'>No tasks available. Add a new task!</p>
          ) : 
          (
            <div className='flex flex-col gap-y-4'>
              {todos.map((todo) => {
                return (
                  <div key={todo.todo_id}>
                    {editTodo === todo.todo_id ? 
                    (
                      <form onSubmit={submitChanges} className='flex items-center gap-x-3'>
                        <input 
                          className='flex-1 p-1 rounded-lg outline-gray-1 outline-non focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner'
                          id={todo.todo_id}
                          type="text" 
                          name='description'
                          defaultValue={editedText} 
                          required
                        />
                        <div className='flex gap-2'>
                          <button type='submit' className='p-2 bg-green-600 text-white rounded-lg hover:bg-green-500 duration-200 cursor-pointer'>
                            <MdOutlineDone/> 
                          </button>
                          <button onClick={() => setEditTodo(null)} type='button' className='p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 duration-200 cursor-pointer'>
                            <IoClose /> 
                          </button>
                        </div>
                      </form>
                    ) : 
                    (
                      <div className='flex justify-between'>
                        <div className='flex items-center gap-x-4 overflow-hidden' >
                          <button 
                            onClick={() => submitCompleted(todo.todo_id, todo.description, todo.completed)} 
                            className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center cursor-pointer ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-400' }`}>
                            {todo.completed && <MdOutlineDone size={16} />}
                          </button>
                          <span>{todo.description}</span>
                        </div>
                        <div className='flex gap-x-2'>
                          <button 
                            className='p-2 text-gray-500 hover:text-green-400 duration-200 rounded-lg cursor-pointer'
                            onClick={() => {
                              setEditTodo(todo.todo_id);
                              setEditedText(todo.description);
                              setTimeout(() => {
                                document.getElementById(todo.todo_id).focus();
                              }, 0);
                            }} 
                          >
                            <MdModeEditOutline />
                          </button>
                          <button onClick={() => submitDelete(todo.todo_id)} className='p-2 text-gray-500 hover:text-red-600 duration-200 rounded-lg cursor-pointer'>
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
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
