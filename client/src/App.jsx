// App.jsx
import React from "react";
import guitarDb from "@tombatossals/chords-db/lib/guitar.json";
import SongBody from "./components/SongBody";


function App() {
  return (
    <div className="p-10 text-xl">
      <SongBody></SongBody>
    </div>
  );
}

export default App;