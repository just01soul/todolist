import { useEffect, useState } from 'react'
import './App.css'

type Todo = {
  id: number
  text: string
  completed: boolean
}
type Filter = "all" | "active" | "completed"

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem("todos")
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])
  
  function handleAdd () {
    if (!inputValue.trim()) return

    const newTodo: Todo ={
      id: Date.now(),
      text: inputValue,
      completed: false
    }

    setTodos([newTodo, ...todos])
    setInputValue("")
  }

  function handleToggle (id: number) {
    setTodos(todos.map(todo =>
      todo.id === id ? {...todo, completed: !todo.completed} : todo
    ))
  }

  function handleDelete (id: number) {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === "all") return true
    if (filter === "active") return !todo.completed
    return todo.completed
  })

  function iconCheck (check: boolean) {
    if (check === true) {
      return '❌';
    }

    return '✅';
  }

  return (
    <>
      <h1 className='heading'>Список задач</h1>
      <div className='adder'>
        <input name="todoInput" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Введите задачу" className='inputTodo'/>
        <button type='button' onClick={handleAdd} className='btn btnAdd'>Добавить задачу</button>
      </div>
      <div className='filterPanel'>
        <button type='button' onClick={() => setFilter("all")} className={`btn btnFilter ${filter === "all" ? "active" : ""}`}>Все</button>
        <button type='button' onClick={() => setFilter("active")} className={`btn btnFilter ${filter === "active" ? "active" : ""}`}>Активные</button>
        <button type='button' onClick={() => setFilter("completed")} className={`btn btnFilter ${filter === "completed" ? "active" : ""}`}>Выполненные</button>
      </div>
      <ul className='todos'>
        {visibleTodos.map(todo => (
          <li key={todo.id} className={`todo todo-${todo.completed}`}>
            {todo.text}
            <div className='action'>
              <button type='button' onClick={() => handleToggle(todo.id)} className='btn'>{iconCheck(todo.completed)}</button>
              <button type='button' onClick={() => handleDelete(todo.id)} className='btn'>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
