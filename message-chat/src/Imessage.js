import React, { useState } from "react";
import Chat from "./Chat";
import "./Imessage.css";
import Sidebar from "./Sidebar";

function Imessage() {
  const [creating, setCreating] = useState(false)

  const getData = (data) => { 
    console.log(data);
    setCreating(data);
  };

  return (
    <div className="imessage">
      <Sidebar getData={getData} creating = {creating}/>
      <Chat creating={creating} getData={getData}/>
    </div>
  );
}

export default Imessage;
