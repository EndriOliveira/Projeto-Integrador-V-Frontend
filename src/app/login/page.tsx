import React from "react";
import styles from "../styles.module.css"
import Login from "./login.module.css"

export default function login(){
    return (
        <div className={styles.Screen}>
            <div className={Login.imgs}></div>
            <div className={Login.allright}>
                <h1 className={styles.title}> Login</h1>
                <input className={styles.text} type="text" id="email" placeholder="E-mail"></input>
                <input className={styles.text} type="password" id="Senha" placeholder="Senha"></input>
                <button className={styles.button}> Entrar</button>
            </div>
        </div>
        
    );
}