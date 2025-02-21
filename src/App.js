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
import { spinDice } from "./api/spinDice";

function App() {
    const [roomStatus, setRoomStatus] = useState('WAITING')
    const [score, setScore] = useState(0)
    // 10 - win
    // 01 - loose
    // 11 - nichya
    const [winStatus] = useState(undefined)
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
            const data = await response.json()

            return {
                hostId: data.host.id,
                status: data.status,
            }
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

        if (['IN_PROGRESS', 'RE_SPIN'].includes(game.data.status)) {
            setRoomStatus(game.data.status)
        }

        if (game.data.hostId === userId) {
            console.log("User is host, already joined")

            return
        }

        handleJoinGame()
    }, [game.data, game.isLoading, opponent, roomId, userId]);

    return (
        <div style={{ backgroundColor: 'tomato' }} className="App">
            {/* <p>RoomId: {roomId}</p>
           <p>Guest: {opponent}</p>

           <p>Status: {roomStatus}</p> */}

            {roomStatus === 'WAITING' && (<Waiting opponentName={opponent.name} />)}

            {['IN_PROGRESS', 'RE_SPIN'].includes(roomStatus) && <Dice isReSpin={roomStatus === 'RE_SPIN'} onSpin={handleSpinDice} score={score} />}

            {roomStatus === 'FINISHED' && <p>{winStatus + ''}</p>}
        </div>
    );
}

export default App;
