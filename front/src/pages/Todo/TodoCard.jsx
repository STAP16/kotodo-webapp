import { useState, useEffect } from "react";
import styles from "./Todo.module.css";

export default function TodoCard({ id, description, deleteTask }) {
  const [removing, setRemoving] = useState(false);
  const [entering, setEntering] = useState(true);

  // Анимация появления
  useEffect(() => {
    const timer = setTimeout(() => setEntering(false), 10); // сразу снимаем entering после монтирования
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {

    const audio = new Audio("/gong-1.mp3");
    audio.play();

    setRemoving(true);
    setTimeout(() => deleteTask(id), 300);
  };

  return (
    <li
      className={`${styles.todo_item} ${
        removing ? styles.removing : entering ? styles.entering : ""
      }`}
    >
      <p>{description}</p>
      <input type="checkbox" onChange={handleRemove} />
    </li>
  );
}
