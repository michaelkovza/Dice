import { getRoomId } from "./lib/getRoomId";
import { getOpponentData } from "./lib/getOpponentData";
import './App.css';

import { Waiting } from './components/Waiting/Waiting'
import { Dice } from './components/Dice/Dice'

import { useState, useEffect, useCallback, useMemo } from 'react'

function App() {
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

  const [roomStatus, setRoomStatus] = useState('WAITING')
  const [score, setScore] = useState(0)
    // 10 - win
    // 01 - loose
    // 11 - nichya
  const [winStatus, setWinStatus] = useState(undefined)

  // 1) DONE Игрок зашел по ссылке и game_status === WAITING => показать сообщение о том, что ждем противника
  // 1.1) DONE Нужен запрос за game_status, который возвращает game_status 
  // 1.2) Опрашивать статус комнаты каждые 2 сек  
    
  // 2) Заход  второго игрока
  // 2.1) Передать данные игрока
  // 2.2)

  useEffect(() => {
    if (!roomId) {
     console.error('No roomId')
     return
    }

    fetch(`https://krutilka.michaelkovzanovich.workers.dev/api/room/${roomId}/status`)
      .then(res => res.json())
      .then(data => {
          setRoomStatus(data.status)
      })
      .catch(error => alert(error))
  }, [roomId]);

  useEffect(() => {
      if (!opponent) {
        console.error('No opponentData')
      }

      fetch(
        `https://krutilka.michaelkovzanovich.workers.dev/api/room/${roomId}/join`,
        {
          method: "POST",
          body: JSON.stringify({ opponentData: opponent })
        }
        )
        .then(res => res.json())
        .then(gameData => {
            if (gameData.opponent.id === userId) {
                setScore(gameData.opponent.score);
            } else if (gameData.host.id === userId) {
                setScore(gameData.host.score);
            }

            if (gameData.status !== 'FINISHED') {
                return
            }

            let isWinner = false;

            const isHost = userId === gameData.host.id
            const isOpponent = userId === gameData.opponent.id

            if (isHost && gameData.host.score > gameData.opponent.score) {
                isWinner = true;
            } else if (isOpponent && gameData.opponent.score > gameData.host.score) {
                isWinner = true;
            }

            setWinStatus(isWinner);
        })

  }, [opponent, roomId, userId]);

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

  }, [roomId, userId])

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
