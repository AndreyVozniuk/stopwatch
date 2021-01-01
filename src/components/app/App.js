import {useState, useEffect} from 'react'
import {createStopwatchStream, doubleClick$, click$} from '../../services/stopwatchService'
import {toFormat} from '../../helper'
import './App.css'

function App() {
  const [seconds, setSeconds] = useState(0)
  const [runStopwatch, setRunStopwatch] = useState(false)
  const [time, setTime] = useState(toFormat(0))
  const [wait, setWait] = useState(false)

  useEffect(() => {
    if(runStopwatch){
      const sub = createStopwatchStream(seconds).subscribe(setSeconds)

      return () => sub.unsubscribe()
    }else{
      if(!wait) setSeconds(0)
    }
  }, [runStopwatch, wait])

  useEffect(() => {
    setTime(toFormat(seconds))
  }, [seconds])

  useEffect(() => {
    doubleClick$.subscribe(() => {
      setWait(true)
      setRunStopwatch(false)
    })
  }, [])
    
  function startStopBtnHandler() {
    if(wait){
      setWait(false)
      setRunStopwatch(true)
    }else{
      setRunStopwatch(prev => !prev)
    }
  }

  function resetHandler() {
    new Promise((resolve, reject) => {
      setRunStopwatch(false)
      setSeconds(0)
      resolve()
    }).then(() => {
      setRunStopwatch(true)
    })
  }
  
  return <div className='App'>
    <div className='stopwatch-info'>
      {time.hours} <div style={{marginBottom: '5px'}}>:</div> 
      {time.minutes} <div style={{marginBottom: '5px'}}>:</div> 
      {time.seconds}
    </div>

    <div className='stopwatch-buttons'>
      <button className='app-btn' onClick={startStopBtnHandler}>{runStopwatch ? 'Stop' : 'Start'}</button>
      <button className='app-btn' onClick={() => click$.next()} disabled={!runStopwatch}>Wait</button>
      <button className='app-btn' onClick={resetHandler} disabled={!runStopwatch}>Reset</button>
    </div>
  </div>
}

export default App
