import Btn from "../../components/Btn";
import icon from "./add_icon.svg";
import styles from "./Todo.module.css"

export default function AddTaskBtn({onClick}) {

    return (
        <div className={styles.create_task_btn}>
            <Btn id="add_task"
            icon={icon}
            onClick={onClick}></Btn>
        </div>

    )

}