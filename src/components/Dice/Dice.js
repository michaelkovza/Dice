import { useState } from "react";
import { motion } from "framer-motion";
import {Button} from "../Button/Button";

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
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <motion.div
                className="w-24 h-24 flex items-center justify-center bg-white border-4 border-gray-800 rounded-lg"
                animate={{ rotate: rolling ? 360 : 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            >
                {!rolling && <DiceFace value={dots} />}
            </motion.div>
            <Button onClick={rollDice} disabled={rolling}>Бросить кубик</Button>
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
        <div className="relative w-full h-full flex items-center justify-center">
            {dotPositions[value]?.map(([x, y], index) => (
                <motion.div
                    key={index}
                    className="absolute w-4 h-4 bg-black rounded-full"
                    style={{ top: `${y}%`, left: `${x}%`, transform: "translate(-50%, -50%)" }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                />
            ))}
        </div>
    );
}
