import { getRoomId } from "./lib/getRoomId";
import './App.css';
import {getOpponentData} from "./lib/getOpponentData";

function App() {
  const roomId = getRoomId()
  const opponent = getOpponentData()

  return (
    <div className="App">
       <p>RoomId: {roomId}</p>
       <p>Guest: {opponent}</p>
    </div>
  );
}

export default App;
