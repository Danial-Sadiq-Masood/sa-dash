"use client"

import { TrendingUp } from "lucide-react"
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"


import { Spinner } from "@/components/ui/spinner.jsx"

const chartData = [
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
}

export default function Gauge({loadingData, data}) {


    const endAngle = data?.data ? Math.min((data.data.Assessed / data.data.TotalFacilities) * 360, 360) : 0;

    const assessments = data?.data ? data.data.Assessed : 0;

    const total = data?.data ? data.data.TotalFacilities : 0;

    return (
        <Card>
            <CardHeader className="bg-[#f7fbff]">
                <CardTitle className="text-left text-lg">Public Health Facilities</CardTitle>
                <CardDescription className="text-left">Assessment Progress</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-4 pb-2 relative">
            {
                    loadingData
                    &&
                    <div
                        className="z-10 absolute top-0 left-0 w-[100%] h-[100%] rounded-b-xl flex flex-col justify-center items-center"
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
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] relative"
                >
                    <RadialBarChart
                        
                        data={chartData}
                        startAngle={0}
                        endAngle={endAngle}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar isAnimationActive={false} dataKey="visitors" background fill="#006105" cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy - 30}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {assessments.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy - 6}
                                                    className="fill-muted-foreground"
                                                >
                                                    /
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy + 18}
                                                    className="fill-foreground text-2xl font-bold"
                                                    color="red"
                                                >
                                                    {total.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 42}
                                                    className="fill-muted-foreground"
                                                >
                                                    Assesments
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
