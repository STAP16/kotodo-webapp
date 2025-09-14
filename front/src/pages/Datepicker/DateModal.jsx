import "./DateModal.css"
import { useState } from "react";
import ReactDOM from "react-dom";

export default function DateModal({
  id,
  isOpen,
  onClose,
  telegramId,
  setPlaningDays,
  selectedDate,
}) {

  const [description, setDescription] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    if (!selectedDate || !description.trim()) return;

    const newDay = {
        id: id,
        telegramId: telegramId,
        day: selectedDate.day,
        currentMonth: selectedDate.currentMonth,
        currentYear: selectedDate.currentYear,
        description: description.trim()
    };

    try {
        const response = await fetch("http://localhost:8000/days/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newDay)
        });

        if (!response.ok) {
        throw new Error("Ошибка при сохранении задачи");
        }

        const savedDay = await response.json();

        setPlaningDays((prev) => [...prev, savedDay]);

        setDescription("");
        onClose();
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось сохранить задачу");
    }
    };


  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modalOverlay">
      <div className="modalContent">
        <form onSubmit={handleSave}>
          <h3>Добавить активность</h3>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
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

