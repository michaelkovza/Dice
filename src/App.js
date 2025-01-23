import { getRoomId } from "./lib/getRoomId";
import { getOpponentData } from "./lib/getOpponentData";
import './App.css';

import { useState, useEffect } from 'react'

function App() {
  const roomId = getRoomId()
  const opponent = getOpponentData()

  const [roomStatus, setRoomStatus] = useState('WAITING')

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
      .then(data => { setRoomStatus(data.status) })
      .catch(error => alert(error))
  }, []);

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
        .then(gameData => console.log(gameData))

    }, []);

  return (
    <div style={{ backgroundColor: 'tomato' }} className="App">
       <p>RoomId: {roomId}</p>
       <p>Guest: {opponent}</p>
        
       <p>Status: {roomStatus}</p>
    </div>
  );
}

export default App;
