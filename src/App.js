/* eslint-disable */
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useMutation, useQuery} from '@tanstack/react-query'

import {Waiting} from './components/Waiting/Waiting'
import {Dice} from './components/Dice/Dice'

import {getRoomId} from "./lib/getRoomId";
import {getOpponentData} from "./lib/getOpponentData";

import {fetchGame} from "./api/fetchGameStatus"
import {joinGame} from "./api/joinGame";
import './App.css';
import {spinDice} from "./api/spinDice";

function App() {
    const [roomStatus, setRoomStatus] = useState('WAITING')
    const [score, setScore] = useState(0)

    // undefined - не определен победелить
    // true - выйграл
    // false - проиграл
    const [isWin, setIsWin] = useState(undefined)
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
        refetchInterval: 10_000,
    })

    const joinGameMutation = useMutation({
        mutationFn: async ({ gameId, opponent }) => {
            const response = await joinGame(gameId, opponent)

        return response.json()
      },
      onSuccess: (data) => {
          if (['IN_PROGRESS', 'RE_SPIN'].includes(data.status)) {
            setRoomStatus(data.status)
          }}
    })

    const spinRollMutation = useMutation({
        mutationFn: async ({gameId, playerId}) => {
            const response = await spinDice(gameId, playerId)

            return response.json()
        },
        onSuccess: (data) => {
            if (data.opponent.id === userId) {
                setScore(data.opponent.score);
            } else if (data.host.id === userId) {
                setScore(data.host.score);
            }


            // TODO вот это место номер 2 что-то сделать с признаком победы
            console.log(data)
        },
    })

    const handleSpinDice = useCallback(() => {
        spinRollMutation.mutate({gameId: roomId, playerId: userId})
    },[roomId, userId, spinRollMutation])

    const handleJoinGame = useCallback(() => {
        joinGameMutation.mutate({ gameId: roomId, opponent })
    }, [joinGameMutation, opponent, roomId])

    useEffect(() => {
        if (game.isLoading || !game.data || !opponent) {
            return
        }

        setRoomStatus(game.data.status)

        // TODO вот это место номер 1 что-то сделать с признаком победы
        console.log(game.data)

        if (game.data.host.id === userId) {
            console.log("User is host, already joined")

            return
        }

        if (game.data.status !== 'FINISHED') {
            handleJoinGame()
        }
    }, [game.data, game.isLoading, opponent, roomId, userId]);

    return (
        <div style={{ backgroundColor: 'tomato' }} className="App">
            {/* <p>RoomId: {roomId}</p>
           <p>Guest: {opponent}</p>

           <p>Status: {roomStatus}</p> */}

            {roomStatus === 'WAITING' && (<Waiting opponentName={opponent.name} />)}

            {['IN_PROGRESS', 'RE_SPIN'].includes(roomStatus) && <Dice isReSpin={roomStatus === 'RE_SPIN'} onSpin={handleSpinDice} score={score} />}

            {roomStatus === 'FINISHED' && <p>признак победы</p>}
        </div>
    );
}

export default App;
