import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import Logo from './components/Logo'
import Home from './pages/Home/Home.jsx'
import Todo from './pages/Todo/Todo.jsx'
import { useTelegramUser } from './hooks/useTelegramUser';
import { useUserTasks } from './hooks/useUserTasks';
import Modal from './pages/Todo/Modal.jsx'
import Datepicker from './pages/Datepicker/Datepicker.jsx'




function App() {

  /* Заглушенная версия Tg Payload*/
  const telegramUser = {
    telegram_id: 123456789,
    user_name: "StepK08",
    first_name: "Stepan",
    last_name: "Kotoman"
  };


  const { user, loading, error } = useTelegramUser(telegramUser);
  const [activePage, setActivePage] = useState('home_page');
  const handlePageChange = (pageId) => setActivePage(pageId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {tasks, setTasks} = useUserTasks(telegramUser.telegram_id);



  const addTask = async (telegramId, description) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/create_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegram_id: telegramId, description }),
      });
      if (!res.ok) throw new Error("Ошибка при создании задачи");
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]); // добавляем задачу в state
    } catch (err) {
      console.error(err);
    }
  };


  const deleteTask = async (id) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/delete_task/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`Ошибка при удалении: ${response.status}`);

    // Если всё ок, обновляем локальный state
    setTasks(prev => prev.filter(task => task.id !== id));
  } catch (err) {
    console.error("Не удалось удалить задачу:", err);
  }
};




  return (
    <div className='container'>
      <Logo />
      <NavBar onButtonClick={handlePageChange} activePage={activePage} />

      <div className="page-content">
        {activePage === "home_page" && <Home />}
        {activePage === "datepicker" && <Datepicker telegramId={telegramUser.telegram_id}></Datepicker>}
        {activePage === "todo" && <Todo tasks={tasks} 
        deleteTask={deleteTask}
        setIsModalOpen={setIsModalOpen}/>}
      </div>


    
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTask={addTask}
        telegramId={telegramUser.telegram_id}
      />



    </div>
  );
}

export default App;