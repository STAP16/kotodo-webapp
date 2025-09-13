import { useState } from "react";
import styles from "./Datepicker.module.css"

export default function Datepicker() {
  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  return (
    <div>
      <h2>
        <h2>{monthNames[currentMonth]} {currentYear}</h2>
      </h2>

      <div className={styles.date_days}>
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(day => (
          <div className={styles.day_item} key={day}>{day}</div>
        ))}
      </div>

      <div className={styles.date_container}>
        {daysArray.map((day, index) => (
          <div key={index} className={styles.date_item}>{day}</div>
        ))}
      </div>
      <button onClick={handlePrevMonth}>{"<"}</button>
      <button onClick={handleNextMonth}>{">"}</button>
    </div>
  );
}
