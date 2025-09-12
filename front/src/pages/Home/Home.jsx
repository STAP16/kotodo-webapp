import styles from "./Home.module.css"
import avatar from "./AVATAR.png"

export default function Home() {
    return (
        <div className={styles.home_box}>
            <div className={styles.info_container}>
                <img src={avatar} alt="" />
                <h2>Котоман Cтепан Олегович</h2> 
                {/* Имя пользователя и его аватарка телеграма */}
            </div>
        </div>

    )

}