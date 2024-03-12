import React from "react";
import styles from "../../styles.module.css";
import forg from "../forget.module.css";
import { useRouter } from 'next/router';

export default function Forget({params}: {params: { id: string}}){

    return(
        <div className={styles.DarkScreen}>
            <div className={forg.Screen}>
                <h1 className={styles.title}>Esqueci a senha</h1>
                <div className={styles.DarkDiv}>
                <h2>Código: {params.id}</h2>
                <input className={styles.text} type="text" id="senha" placeholder="Senha"></input>
                <input className={styles.text} type="text" id="confSenha" placeholder="Confirmar Senha"></input>
                    <button className={styles.DarkButton}> Confirmar</button>
                </div>
            </div>
        </div>
    );
}