import {IoClose} from 'react-icons/io5'
import {MdOutlineDone } from 'react-icons/md';

export function EditTodo(props) {
  return (
        <form onSubmit={props.submitChanges} className='flex items-center gap-x-3'>
          <input 
            className='flex-1 p-1 rounded-lg outline-gray-1 outline-non focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner'
            id={props.todo.todo_id}
            type="text" 
            name='description'
            defaultValue={props.editedText} 
            required
          />
          <div className='flex gap-2'>
            <button type='submit' className='p-2 bg-green-600 text-white rounded-lg hover:bg-green-500 duration-200 cursor-pointer'>
              <MdOutlineDone/> 
            </button>
            <button onClick={() => props.setEditTodo(null)} type='button' className='p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 duration-200 cursor-pointer'>
              <IoClose /> 
            </button>
          </div>
        </form>
  )
}

