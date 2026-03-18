import {useState} from 'react'
import axios from 'axios';
import {URL} from './config.js'

function App() {

  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const [editedText, setEditedText] = useState('');
  
  const onSubmitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    const dataObj = Object.fromEntries(formData.entries());
    
    try {
      await axios.post(`${URL}/todos`, {
        ...dataObj,
        completed: false,
      });

    } catch(err) {
      console.error(err.message);
    }
  }

  return (

    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4" >
      <div className="bg-gray-300 rounded-xl shadow-xl w-full max-w-lg p-8">
        
        <h1 className="text-4xl font-bold text-gray-700 mb-8">PERN TODO APP</h1>
        
        <form onSubmit={onSubmitForm} className='flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6'>
          <input 
            className='flex-1 w-full outline-none px-3 py-2 text-gray-600 placeholder-gray-600 '
            name='description'
            type="text"  
            placeholder='Your task here' 
            required 
          />
          <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer'>
            Add task
          </button>
        </form>
      </div>
    </div>

  )
}

export default App
