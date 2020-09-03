import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import classes from './GameScreen.module.css';
const ENDPOINT = "http://127.0.0.1:4000";

export default function GameScreen() {
  const [minute, setMinute] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [betState, setBetState] = useState(false)

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('time-update', data => {
        setMinute(data.minute);
        setSeconds(data.second);
    })
    socket.on('close-bets', data => {
      setBetState(data)
    })
    socket.on('open-bets', data => {
      setBetState(data)
    })
  }, []);

  
  return (
    <div className={classes.grid_container}>
            <div className={classes.item}>
                <span style={{textAlign:'center'}}><h2>0{minute} : {seconds>=0 && seconds<10 ? '0'+seconds : seconds}</h2></span>
                <input type="text"/>
            </div>
            <div className={classes.item}>
                <button className={classes.submitButton} disabled={betState}>BET!</button>
            </div>
            <div className={classes.item}>Previous rounds</div>
    </div>
  );
}
