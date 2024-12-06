import { useEffect, useRef } from "react";
import { createRadialChartMachine } from "./d3RadarChart"
import { Spinner } from "@/components/ui/spinner.jsx"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function RadialChartHolder({
    setShowTooltip,
    setTooltipData,
    loadingData,
    data
}) {

    const ref = useRef();

    const actor = useRef(createRadialChartMachine({
        dataLoaded: true,
        setShowTooltip,
        setTooltipData,
        rootNode: ref
    }));

    useEffect(
        () => {
            actor.current.start();

            window.radarMachine = actor.current;
        }
        , [])

    useEffect(
        () => {
            if (!loadingData) {
                actor.current.send({
                    type: 'DATA_LOADED',
                    data : data
                })
            } else {
                actor.current.send({
                    type: 'DATA_LOADING'
                })
            }
        }
        , [loadingData])

    return (
        <Card>
            <CardHeader className="bg-[#f7fbff]">
                <CardTitle className="text-left text-lg">Public Health Facilities</CardTitle>
                <CardDescription className="text-left">SPI-RT Assessments</CardDescription>
            </CardHeader>
            <CardContent className="relative min-h-[200px] py-0">
                {
                    loadingData
                    &&
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
                }
                <div className="font-sans" ref={ref}>
                </div>
            </CardContent>
        </Card>
    )
}