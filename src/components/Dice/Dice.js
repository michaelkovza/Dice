import { useState } from "react";
import { motion } from "framer-motion";
import BottomButton from "../UI/Button/BottomButton";

import css from './index.module.css';


export const Dice = () => {
    const [rolling, setRolling] = useState(false);
    const [dots, setDots] = useState(generateRandomDots());
    const [result, setResult] = useState(null);

    function generateRandomDots() {
        return Math.floor(Math.random() * 6) + 1;
    }
    
    const rollDice = () => {
        setRolling(true);
        setDots(null);

        setTimeout(() => {
            const newResult = generateRandomDots();
            setDots(newResult);
            setResult(newResult);
            setRolling(false);
        }, 500);
    };

    return (
        <div className={css.root}>
            <div className={css.diceContainer}>
                <motion.div
                    className={css.dice}
                    style={{ backgroundColor: "#F5F1E9" }}
                    animate={
                        rolling
                            ? {
                                rotate: [-180],
                            }
                            : { rotate: 0 }
                    }
                    transition={{
                        duration: 1.2,
                        ease: "easeInOut",
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                    }}
                >
                    <DiceFace value={dots} rolling={rolling} />
                </motion.div>
            </div>
            <div className={css.buttonContainer}>
                <BottomButton style={{ backgroundColor: "black", color: "white" }} onClick={rollDice} disabled={rolling} text="Бросить кубик" />
            </div>
        </div>
    );
}

function DiceFace({ value }) {
    const dotPositions = [
        [],
        [[50, 50]],
        [[30, 30], [70, 70]],
        [[30, 30], [50, 50], [70, 70]],
        [[30, 30], [30, 70], [70, 30], [70, 70]],
        [[30, 30], [30, 70], [50, 50], [70, 30], [70, 70]],
        [[30, 25], [30, 50], [30, 75], [70, 25], [70, 50], [70, 75]],
    ];

    return (
        <div className={css.dotContainer}>
            {value !== null &&
                dotPositions[value]?.map(([x, y], index) => (
                    <motion.div
                        key={index}
                        className={css.dot}
                        style={{ top: `${y}%`, left: `${x}%`, transform: "translate(-50%, -50%)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                    />
                ))}
        </div>
    );
}
