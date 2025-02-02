import { Button } from '../Button/Button'

export const Dice = ({ onSpin, score }) => {
    return (
        <main>
            <Button disabled={Boolean(score)} onClick={onSpin} text="Бросить кубик" />
        </main>
    )
}