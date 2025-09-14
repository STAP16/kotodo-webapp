import { useState, useEffect } from "react";
import styles from "./Datepicker.module.css"
import DateModal from "./DateModal";
import ViewDayModal from "./ViewDayModal";

export default function Datepicker({telegramId}) {
  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const [planingDays, setPlaningDays] = useState([]); // Использовать касмтоный хук tgid


    useEffect(() => {
    const fetchPlaningDays = async () => {
      try {
        const response = await fetch(`http://localhost:8000/days/${telegramId}`);
        if (!response.ok) {
          throw new Error("Ошибка при загрузке задач");
        }

        const data = await response.json();

        // Формируем массив в нужном формате
        const formatted = data.map((task) => ({
          id: task.id,
          telegramId: task.telegramId,
          currentMonth: task.currentMonth,
          currentYear: task.currentYear,
          day: task.day,
          description: task.description
        }));
        setPlaningDays(formatted);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    if (telegramId) {
      fetchPlaningDays();
    }
  }, [telegramId]);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());


  const [selectedDate, setSelectedDate] = useState(null); // здесь хранится выбранная дата
  const [isOpen, setIsOpen] = useState(false); // управление модалкой
  const [viewingDay, setViewingDay] = useState(null);

  // const {planingDays, setPlaningTasks} = useUserPlaningDays(telegramId);

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
  let firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }


  // Этот масив формируем с бека, и обновляем локально в случае добавления да-да!


const handleDeleteDay = async (dayData) => {
  if (!dayData.id) {
    console.error("Нет ID задачи для удаления");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8000/days/${dayData.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Ошибка при удалении задачи");
    }

    // Убираем из локального состояния
    setPlaningDays(prev => prev.filter(d => d.id !== dayData.id));

    // Закрываем просмотр модалки
    setViewingDay(null);
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Не удалось удалить задачу");
  }
};

  const handleDayClick = (day) => {
    if (!day) return;

    const found = planingDays.find(
      (d) =>
        d.day === day &&
        d.currentMonth === currentMonth &&
        d.currentYear === currentYear
    );

    if (found) {
      setViewingDay(found);
      console.log(found)
    } else {
      setSelectedDate({ day, currentMonth, currentYear });
      setIsOpen(true);
    }
  };

  return (
    <div>
      <h2>
        {monthNames[currentMonth]} {currentYear}
        <div className={styles.month_nav}>
          <button onClick={handlePrevMonth}>{"<"}</button>
          <button onClick={handleNextMonth}>{">"}</button>
        </div>
      </h2>

      <div className={styles.date_days}>
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(day => (
          <div className={styles.day_item} key={day}>{day}</div>
        ))}
      </div>

      <div className={styles.date_container}>
        {daysArray.map((day, index) => (
          <div key={index} 
          className={`${planingDays.some((d) => d.day === day && d.currentMonth==currentMonth && d.currentYear==currentYear && d.telegramId===telegramId) ? styles.date_item_active : styles.date_item}`}
          onClick={() => handleDayClick(day)}>{day}</div>
        ))}
      </div>

        <DateModal
        id={selectedDate?.id}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        telegramId={telegramId} 
        setPlaningDays={setPlaningDays}
        selectedDate={selectedDate}
        planingDays={planingDays}
        ></DateModal>


        <ViewDayModal
        dayData={viewingDay}
        onClose={() => setViewingDay(null)}
        onDelete={handleDeleteDay}
        />
    </div>

  );
}
