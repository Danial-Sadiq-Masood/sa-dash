import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Select from './Select'
import { createBarChartMachine } from './d3BarLine.js'
import drawRadialChart from './plotRadarChart'
import Tooltip from './tooltip'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function App() {

  const [showTooltip, setShowTooltip] = useState(false);
  const [toolTipData, setTooltipData] = useState({ data: { rows: [] } });



  return (
    <div className="flex flex-col gap-6">
      <div>
        <Select />
      </div>
      <Tooltip showTooltip={showTooltip} toolTipData={toolTipData} />
      <ChartHolder key={1} setShowTooltip={setShowTooltip} setTooltipData={setTooltipData} />
      <RadialChartHolder key={2} setShowTooltip={setShowTooltip} setTooltipData={setTooltipData} />
    </div>
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
    <Card>
      <CardHeader className="bg-[#f7fbff]">
        <CardTitle className="text-left text-lg">Public Health Facilities</CardTitle>
        <CardDescription className="text-left">SPI-RT Assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-[856px] font-sans" ref={ref}>
        </div>
      </CardContent>
    </Card>
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
    <Card>
      <CardHeader className="bg-[#f7fbff]">
        <CardTitle className="text-left text-lg">Public Health Facilities</CardTitle>
        <CardDescription className="text-left">SPI-RT Assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-[856px] font-sans m-4" ref={ref}>
        </div>
      </CardContent>
    </Card>
  )
}

export default App
