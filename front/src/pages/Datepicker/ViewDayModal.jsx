import "./ViewDateModal.css"
import ReactDOM from "react-dom";

export default function ViewDayModal({ dayData, onClose, onDelete }) {
  if (!dayData) return null;

    const monthNames = [
    "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
    "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
  ];

  return ReactDOM.createPortal(
    <div className="view-modalOverlay">
        <div className="view-modalContent">
            <h3>{dayData.day} {monthNames[dayData.currentMonth]} {dayData.currentYear}</h3>
            <p>{dayData.description}</p>
            <div className="view-modalButtons">
                <button onClick={() => onDelete(dayData)}>Удалить</button>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    </div>,
    document.body
  );
}
