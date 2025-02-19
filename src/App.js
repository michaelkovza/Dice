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

function App() {
  const [roomStatus, setRoomStatus] = useState('WAITING')
  const [score, setScore] = useState(0)
    // 10 - win
    // 01 - loose
    // 11 - nichya
  const [winStatus] = useState(undefined)

  const roomId = getRoomId()
  const opponent = getOpponentData()

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
        const response= await joinGame(gameId, opponent)

        return response.json()
      },
      onSuccess: (data) => {
          if (data.status === 'IN_PROGRESS') {
            setRoomStatus(data.status)
          }
      }
  })


    const handleJoinGame = useCallback(() => {
        joinGameMutation.mutate({ gameId: roomId, opponent })
    }, [joinGameMutation, opponent, roomId])


  const userId = useMemo(() => {
      const params = new URLSearchParams(opponent)

      try {
          const user = JSON.parse(params.get('user'))

          return user.id
      } catch (error) {
          alert("App:userId:error", error)
      }
  }, [opponent])



  // 1) DONE Игрок зашел по ссылке и game_status === WAITING => показать сообщение о том, что ждем противника
  // 1.1) DONE Нужен запрос за game_status, который возвращает game_status 
  // 1.2) Опрашивать статус комнаты каждые 2 сек  
    
  // 2) Заход  второго игрока
  // 2.1) Передать данные игрока
  // 2.2)

    useEffect(() => {
        if (game.isLoading || !game.data || !opponent) {
            return
        }

        if (game.data.status === 'IN_PROGRESS') {
            setRoomStatus(game.data.status)
        }

        if (game.data.hostId === userId) {
            console.log("User is host, already joined")

            return
        }

        handleJoinGame()
    }, [game.data, game.isLoading, opponent, roomId, userId]);

  const handleSpin = useCallback(() => {

      if (!opponent) {
          throw new Error('No tgWebAppData')
      }

      try {
          fetch(
              `https://krutilka.michaelkovzanovich.workers.dev/api/room/${roomId}/spin`,
              {
                  method: "POST",
                  body: JSON.stringify({ playerId: String(userId) })
              }
          )
              .then(res => res.json())
              .then(res => {
                  if (res.opponent.id === userId) {
                      setScore(res.opponent.score);
                  } else if (res.host.id === userId) {
                      setScore(res.host.score);
                  }
              })
      } catch (error) {
          console.error(error)
      }

  }, [roomId, userId, opponent])

  return (
        <div style={{ backgroundColor: 'tomato' }} className="App">
           <p>RoomId: {roomId}</p>
           <p>Guest: {opponent}</p>

           <p>Status: {roomStatus}</p>

            { roomStatus === 'WAITING' && (<Waiting />) }

            { roomStatus === 'IN_PROGRESS' && <Dice onSpin={handleSpin} score={score} /> }

            { roomStatus === 'FINISHED' && <p>{ winStatus + ''  }</p> }
        </div>
  );
}

export default App;
