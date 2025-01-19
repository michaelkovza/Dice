import { getRoomId } from "./lib/getRoomId";
import './App.css';

function App() {
  const roomId = getRoomId()

  return (
    <div className="App">
       <p>RoomId: ${roomId}</p>
    </div>
  );
}

export default App;
