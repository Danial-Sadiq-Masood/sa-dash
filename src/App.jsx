import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBarChartMachine } from './d3BarLine.js'
import drawRadialChart from './plotRadarChart'
import Tooltip from './tooltip'

function App() {

  const [showTooltip, setShowTooltip] = useState(false);
  const [toolTipData, setTooltipData] = useState({ data: { rows: [] } });


  return (
    <>
      <Tooltip showTooltip={showTooltip} toolTipData={toolTipData} />
      <ChartHolder key={1} setShowTooltip={setShowTooltip} setTooltipData={setTooltipData} />
      <RadialChartHolder key={2} setShowTooltip={setShowTooltip} setTooltipData={setTooltipData} />
    </>
  )
}

function ChartHolder({ setShowTooltip, setTooltipData }) {

  const ref = useRef()

  useEffect(
    () => {
      const actorOptions = createBarChartMachine({
        dataLoaded: true,
        setShowTooltip,
        setTooltipData,
        rootNode: ref.current
      });

      //ref.current.appendChild(node);

      return () => {

        actorOptions.stop();
        //ref.current.removeChild(node)
      }
    }
    , [])

  return (
    <div className="w-[856px] font-sans" ref={ref}>

    </div>
  )
}

function RadialChartHolder({ setShowTooltip, setTooltipData }) {

  const ref = useRef()

  useEffect(
    () => {
      const radialPlot = drawRadialChart();

      //ref.current.appendChild(node);
      ref.current.append(radialPlot);
      return () => radialPlot.remove();
    }
    , [])

  return (
    <div className="w-[856px] font-sans" ref={ref}>

    </div>
  )
}

export default App
