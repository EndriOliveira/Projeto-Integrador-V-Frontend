import React from "react";
import styles from "../styles.module.css";
import forg from "./forget.module.css";

export default function Forget(){
    return(
        <div className={styles.DarkScreen}>
            <div className={forg.Screen}>
                <h1 className={styles.title}>Esqueci a senha</h1>
                <div className={styles.DarkDiv}>
                    <input className={styles.text} type="text" id="email" placeholder="E-mail"></input>
                    <button className={styles.DarkButton}> Continuar</button>
                </div>
            </div>
        </div>
    );
}