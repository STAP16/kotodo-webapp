import AddTaskBtn from "./AddTaskBtn";
import styles from "./Todo.module.css"
import { useEffect } from "react";
import TodoCard from "./TodoCard";

export default function Todo({tasks, deleteTask, setIsModalOpen}) {

  const sortedTasks = [...tasks].sort((a, b) => b.id - a.id);


    return (
      <div className={styles.todo_card_page}>
        <h2>Задачи</h2>
        <div className={styles.card_section}>
          {sortedTasks.map((task) => (
          <TodoCard
          key={task.id}
          id={task.id}
          description={task.description}
          status={task.status}
          deleteTask={deleteTask} />))}
        </div>
        <AddTaskBtn onClick={() => setIsModalOpen(true)}>
        </AddTaskBtn>
      </div>
    )
}