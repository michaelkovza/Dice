import { useState } from "react";
import { motion } from "framer-motion";
import {Button} from "../Button/Button";

import css from './index.module.css'



export const Dice = () => {
    const [rolling, setRolling] = useState(false);
    const [dots, setDots] = useState(generateRandomDots());
    const [result, setResult] = useState(null);

    console.log(result);

    function generateRandomDots() {
        return Math.floor(Math.random() * 6) + 1;
    }

    const rollDice = () => {
        setRolling(true);
        setDots(0);

        setTimeout(() => {
            const newResult = generateRandomDots();
            setDots(newResult);
            setResult(newResult);
            setRolling(false);
        }, 1200);
    };

    return (
        <div className={css.root}>
            <motion.div
                className={css.dice}
                animate={rolling ? { rotate: [0, -90, -180, -270, -270, -180, -90, 0] } : { rotate: 0 }}
                transition={{ duration: 1.2, ease: "linear" }}
            >
                {!rolling && <DiceFace value={dots} />}
            </motion.div>
            <Button onClick={rollDice} disabled={rolling} text="Бросить куби" />
        </div>
    );
}

function DiceFace({ value }) {
    const dotPositions = [
        [],
        [[50, 50]],
        [[20, 20], [80, 80]],
        [[20, 20], [50, 50], [80, 80]],
        [[20, 20], [20, 80], [80, 20], [80, 80]],
        [[20, 20], [20, 80], [50, 50], [80, 20], [80, 80]],
        [[20, 20], [20, 50], [20, 80], [80, 20], [80, 50], [80, 80]],
    ];

    return (
        <div className={css.dotContainer}>
            {dotPositions[value]?.map(([x, y], index) => (
                <motion.div
                    key={index}
                    className={css.dot}
                    style={{ top: `${y}%`, left: `${x}%`, transform: "translate(-50%, -50%)" }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                />
            ))}
        </div>
    );
}
