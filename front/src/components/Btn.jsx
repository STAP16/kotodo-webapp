
export default function Btn({icon, id, onClick, isActive = false}) {



    const handleClick = () => {
    if (onClick) {
      onClick(id); // Передаем ID кнопки
    }
  };

    return (

        <button className={`nav-btn ${isActive ? 'active' : ''}`}onClick={handleClick}>
            <img src={icon} alt="" className="page-logo" />
        </button>

    )

}