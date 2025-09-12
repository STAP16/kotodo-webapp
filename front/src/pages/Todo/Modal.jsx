import { useState } from "react";
import ReactDOM from "react-dom";
import "./Modal.css"; // можно использовать CSS-файл или CSS-модуль

export default function Modal({ isOpen, onClose, addTask, telegramId}) {
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newTask = {description, status: false };
    await addTask(telegramId, description); // добавляем задачу в родительский state
    setDescription("");
    onClose(); // закрываем модалку
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modalOverlay">
      <div className="modalContent">
        <form onSubmit={handleSubmit}>
          <h3>Создать задачу</h3>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание задачи"
          />
          <div className="modalButtons">
            <button
              type="submit"
              className={`createBtn ${description.trim() ? "active" : ""}`}
              disabled={!description.trim()}
            >
              Создать
            </button>
            <button type="button" onClick={onClose} className="cancelBtn">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
