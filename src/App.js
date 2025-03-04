/* eslint-disable */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Waiting } from './components/Waiting/Waiting'
import { Dice } from './components/Dice/Dice'
import { Welcome } from './components/Welcome/Welcome'
import { Finished } from './components/Finished/Finished'

import { getRoomId } from "./lib/getRoomId";
import { getOpponentData } from "./lib/getOpponentData";

import { fetchGame } from "./api/fetchGameStatus"
import { joinGame } from "./api/joinGame";
import './App.css';
import css from '../src/components/Finished/Finished.module.css';
import { spinDice } from "./api/spinDice";

function App() {
    const [roomStatus, setRoomStatus] = useState('WELCOME')
    const [score, setScore] = useState(0)

    // undefined - не определен победелить
    // true - выйграл
    // false - проиграл
    const roomId = getRoomId()
    const opponent = getOpponentData()

    const userId = useMemo(() => {
        const params = new URLSearchParams(opponent)

        try {
            const user = JSON.parse(params.get('user'))

            return user.id
        } catch (error) {
            alert("App:userId:error", error)
        }
    }, [opponent])

    const game = useQuery({
        queryKey: ['gameQuery', roomId],
        queryFn: async () => {
            const response = await fetchGame(roomId)

            return await response.json()
        },
        // Если игра закончилась, то больше не запрашиваем данные
        refetchInterval: roomStatus === 'FINISHED' ? undefined : 5_000,
    })

    const joinGameMutation = useMutation({
        mutationFn: async ({ gameId, opponent }) => {
            const response = await joinGame(gameId, opponent)

            return response.json()
        },
        onSuccess: (data) => {
            if (['IN_PROGRESS', 'RE_SPIN'].includes(data.status)) {
                setRoomStatus(data.status)
            }
        }
    })

    const spinRollMutation = useMutation({
        mutationFn: async ({ gameId, playerId }) => {
            const response = await spinDice(gameId, playerId)

            return response.json()
        },
        onSuccess: (data) => {
            if (data.opponent.id === userId) {
                setScore(data.opponent.score);
            } else if (data.host.id === userId) {
                setScore(data.host.score);
            }

            if (data.status === 'FINISHED') {
                game.refetch()
            }
        },
    })

    const handleSpinDice = useCallback(() => {
        setRoomStatus('IN_PROGRESS')
        spinRollMutation.mutate({ gameId: roomId, playerId: userId })
    }, [roomId, userId, spinRollMutation])

    const handleJoinGame = useCallback(() => {
        joinGameMutation.mutate({ gameId: roomId, opponent })
    }, [joinGameMutation, opponent, roomId])

    useEffect(() => {
        if (game.isLoading || !game.data || !opponent) {
            return
        }

        setRoomStatus(game.data.status)

        if (game.data.host.id !== userId) {
            handleJoinGame()
        }
    }, [game.data, game.isLoading, opponent, roomId, userId]);

    const results = useMemo(() => {
        if (roomStatus !== "FINISHED") {
            return
        }

        const isHost = userId === game.data.host.id

        const player = isHost ? game.data.host : game.data.opponent;
        const opponent = isHost ? game.data.opponent : game.data.host;

        return {
            className: player?.isWinner ? css.winner : css.loser,
            title: player?.isWinner ? 'Вы победили!' : 'Вы проиграли!',
            scoreX: player?.score,
            scoreY: opponent?.score,
        };
    }, [roomStatus])

    console.log(results);

    return (
        <div style={{ backgroundColor: 'tomato' }} className="App">
            {/* <p>RoomId: {roomId}</p>
           <p>Guest: {opponent}</p>

           <p>Status: {roomStatus}</p> */}

            {roomStatus === 'WELCOME' && <Welcome />}

            {roomStatus === 'WAITING' && (<Waiting opponentName={opponent.name} />)}

            {['IN_PROGRESS', 'RE_SPIN'].includes(roomStatus) && <Dice isReSpin={roomStatus === 'RE_SPIN'} onSpin={handleSpinDice} score={score} />}

            { roomStatus === 'FINISHED' && (
                <Finished className={results.className} title={results.title} scoreX={results.scoreX} scoreY={results.scoreY} />
            ) }
        </div>
    );
}

export default App;
