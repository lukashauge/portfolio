import {useState, useEffect} from 'react'

export default function Stopwatch(props: {running: boolean, resetTick: boolean, color?: string}) {

    const [time, setTime] = useState(0);
    const {running, resetTick, color = "var(--contrastColor)"} = props;

    useEffect(() => {
        setTime(0);
    }, [resetTick]);

    useEffect(() => {
        const intervalID = setInterval(() => 
            {
                if (running) {
                    setTime((time) => time + 11);
                }
            }, 11);
        
        return () => clearInterval(intervalID);
    }, [running]);

    const timerData = {
            hr: ("0" + Math.floor(time/3600000)%60).slice(-1)+"hr",
            min: ("0" + Math.floor(time/60000)%60).slice(-2)+"m",
            sec: ("0" + Math.floor(time/1000)%60).slice(-2)+"s",
            ms: ("000" + time%1000).slice(-3)+"ms"
        }

    return (
    <div style={{display: "flex", justifyContent: "center", gap: "5px", paddingBottom: "30px"}}>
        {timerData.hr!="0hr"?<div className="timer-cell"><p style={{color: color}}>{timerData.hr}</p></div>:<></>}
        {timerData.min!="00m"?<div className="timer-cell"><p style={{color: color}}>{timerData.min}</p></div>:<></>}
        <div className="timer-cell"><p style={{color: color}}>{timerData.sec}</p></div>
        <div className="timer-cell"><p style={{color: color}}>{timerData.ms}</p></div>
    </div>
  )
}
