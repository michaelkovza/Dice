import React from 'react'
import css from './Welcome.module.css'
import BottomButton from '../UI/Button/BottomButton'

export const Welcome = () => {
    return (
        <div className={css.root}>
            <div className={css.block}>
                <div className={css.textContainer}>
                    <h1>WELCOME<br /> TO CUBE GAME</h1>
                    <p>Roll the dice and defeat your<br /> opponent! Luck is everything</p>
                </div>
            </div>
            <div className={css.buttonContainer}>
                <BottomButton text="Start game" />
            </div>
        </div>
    )
}


