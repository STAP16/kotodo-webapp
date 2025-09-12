import home_page from "../assets/main.png"
import datepicker from "../assets/datepicker.png"
import todo_icon from "../assets/todo_icon.png"
import Btn from "./Btn"

export default function NavBar({activePage, onButtonClick}) {
    return (
        <div className="novigation">
          <div className="nav-tools">
            <Btn icon={home_page} 
            id="home_page" 
            onClick={onButtonClick}
            isActive={activePage === 'home_page'} ></Btn>
            <Btn icon={datepicker} 
            id="datepicker" 
            onClick={onButtonClick}
            isActive={activePage === 'datepicker'} ></Btn>
            <Btn icon={todo_icon}  id="todo" 
            onClick={onButtonClick}
            isActive={activePage === 'todo'}></Btn>
          </div>
        </div>
    )
}