import BottomButton from '../UI/Button/BottomButton'
import css from './Waiting.module.css'


// TODO добавить имя опонента, подумать должно ли быть оно кликабельным
export const Waiting = ({ opponentName = 'opponentName' }) => {
    return (
        <main className={css.root}>
            <h1 className={css.title}>We are waiting for @{opponentName} to roll the dice</h1>

            <BottomButton
                style={{ background: "none", color: "black" }}
                onClick={
                    // TODO сделать клик по кнопке, который ведет на главную
                    () => null
                }
                text="Go home"
            />
        </main>
    )
}