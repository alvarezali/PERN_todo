
export function CreateTodo(props) {

  return (
        
        <form onSubmit={props.submitForm} className='flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6'>
          <input 
            className='flex-1 w-full outline-none px-3 py-2 text-gray-600 placeholder-gray-600 '
            id='form-input'
            name='description'
            type="text"  
            placeholder='Your task here' 
            required 
          />
          <button type='submit' className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer'>
            Add task
          </button>
        </form>
  )
}
