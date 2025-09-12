import { useState, useEffect } from "react";

export function useUserTasks(telegramId) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!telegramId) return;

    fetch(`http://127.0.0.1:8000/tasks/${telegramId}`)
      .then(res => res.json())
      .then(data => setTasks(data.tasks || []))
      .catch(err => console.error(err));
  }, [telegramId]);

  return { tasks, setTasks };
}