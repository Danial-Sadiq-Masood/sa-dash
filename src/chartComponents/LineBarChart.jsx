import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Spinner } from "@/components/ui/spinner.jsx"

import { useRef, useEffect } from "react"
import { createBarChartMachine } from './d3BarLine.js'

export default function ChartHolder({ setShowTooltip, setTooltipData }) {

    const ref = useRef()
    const actor = useRef()

    useEffect(
        () => {
            if (actor.current) {
                return;
            }

            actor.current = createBarChartMachine({
                dataLoaded: true,
                setShowTooltip,
                setTooltipData,
                rootNode: ref.current
            });

            actor.current.start();

            return () => {
                //actorOptions.stop();
            }
        }
        , [])


    return (
        <Card>
            <CardHeader className="bg-[#f7fbff]">
                <CardTitle className="text-left text-lg">Public Health Facilities</CardTitle>
                <CardDescription className="text-left">SPI-RT Assessments</CardDescription>
            </CardHeader>
            <CardContent className="relative">
                <div
                    className="absolute top-0 left-0 w-[100%] h-[100%] rounded-b-xl flex flex-col justify-center items-center"
                >
                    <Spinner className="text-white z-10" size="Large">
                        <span className="text-white z-10">Loading Data</span>
                    </Spinner>
                    <div
                        className="absolute top-0 left-0 w-[100%] h-[100%] rounded-b-xl bg-black opacity-50"
                    >
                    </div>
                </div>
                <div className="w-[856px] font-sans" ref={ref}>
                </div>
            </CardContent>
        </Card>
    )
}