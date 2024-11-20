import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import chart from './d3BarLine.js'
import Tooltip from './tooltip'

function App() {

  const [showTooltip, setShowTooltip] = useState(false);
  const [toolTipData, setTooltipData] = useState({data : {}});


  return (
    <>
      <Tooltip showTooltip={showTooltip} toolTipData={toolTipData} />
      <ChartHolder key={1} setShowTooltip={setShowTooltip} setTooltipData={setTooltipData}/>
    </>
  )
}

function ChartHolder({setShowTooltip, setTooltipData}) {

  const ref = useRef()

  useEffect(
    () => {
      const node = chart(setShowTooltip, setTooltipData);

      ref.current.appendChild(node);

      return () => {
        ref.current.removeChild(node)
      }
    }
    , [])

  return (
    <div className="w-[856px] font-sans" ref={ref}>

    </div>
  )
}

export default App
