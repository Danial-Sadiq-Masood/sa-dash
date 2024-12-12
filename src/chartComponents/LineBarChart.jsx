import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Spinner } from "@/components/ui/spinner.jsx"

import { useRef, useEffect, useState, act } from "react"
import { createBarChartMachine } from './d3BarLine.js'

export default function ChartHolder({
    setShowTooltip,
    setTooltipData,
    status,
    data,
    dataUpdatedAt
}) {

    const loadingData = status === 'loading'
    const ref = useRef()

    const actor = useRef(createBarChartMachine({
        dataLoaded: loadingData,
        setShowTooltip,
        setTooltipData,
        rootNode: ref
    }));

    useEffect(
        () => {
            actor.current.start();

            window.machine = actor.current;
        }
        , [])

    useEffect(
        () => {
            if (status === 'success') {
                actor.current.send({
                    type: 'DATA_LOADED',
                    data: data
                })
            } else if (status === 'loading') {
                actor.current.send({
                    type: 'DATA_LOADING'
                })
            }
        }
        , [loadingData, dataUpdatedAt])

    return (
        <Card>
            <CardHeader className="bg-[#f7fbff]">
                <CardTitle className="text-left text-lg">Public Health Facilities</CardTitle>
                <CardDescription className="text-left">SPI-RT Assessments</CardDescription>
            </CardHeader>
            <CardContent className="relative min-h-[500px] py-10">
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
                <div className="w-[100%] flex justify-center font-sans" ref={ref}>
                </div>
            </CardContent>
        </Card>
    )
}