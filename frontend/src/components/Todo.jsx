import {FaTrash} from 'react-icons/fa6';
import {MdOutlineDone, MdModeEditOutline} from 'react-icons/md';

export function Todo(props) {
  return (
        <div className='flex justify-between'>
          <div className='flex items-center gap-x-4 overflow-hidden' >
            <button 
              onClick={() => props.submitCompleted(props.todo.todo_id, props.todo.description, props.todo.completed)} 
              className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center cursor-pointer ${props.todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-400' }`}>
              {props.todo.completed && <MdOutlineDone size={16} />}
            </button>
            <span>{props.todo.description}</span>
          </div>
          <div className='flex gap-x-2'>
            <button 
              className='p-2 text-gray-500 hover:text-green-400 duration-200 rounded-lg cursor-pointer'
              onClick={() => {
                props.setEditTodo(props.todo.todo_id);
                props.setEditedText(props.todo.description);
                setTimeout(() => {
                  document.getElementById(props.todo.todo_id).focus();
                }, 0);
              }} 
            >
              <MdModeEditOutline />
            </button>
            <button onClick={() => props.submitDelete(props.todo.todo_id)} className='p-2 text-gray-500 hover:text-red-600 duration-200 rounded-lg cursor-pointer'>
              <FaTrash />
            </button>
          </div>
        </div>
  )
}
