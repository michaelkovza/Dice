import BottomButton from '../UI/Button/BottomButton'
import classes from './Waiting.module.css'


export const Waiting = ({ opponentName }) => {
    return (
        <main className={classes.Waiting}>
            <h1>We are waiting for {opponentName} to roll the dice</h1>
            <BottomButton
                onClick={''}
                text="Go home"
            />
        </main>
    )
}