import * as Plot from "@observablehq/plot";

import * as d3 from "d3"


import { createMachine, createActor, setup } from 'xstate';

const machineEvents = {
    'DATA_LOADED': 'DATA_LOADED',
    'CHART_DRAWN': 'CHART_DRAWN'
}

function createRadialChartMachine({
    dataLoaded,
    setShowTooltip,
    setTooltipData,
    rootNode
}) {

    const initState = 'loading';

    const barChartMachine = setup({

        actions: {
            create_chart: ({ self, event }) => {
                buildChart(
                    //setShowTooltip,
                    //setTooltipData,
                    rootNode,
                    event.data
                );
                self.send({
                    type: machineEvents.CHART_DRAWN
                })
            }
        }
    })
        .createMachine({
            id: 'barChartMachine',
            initial: initState,
            states: {
                'loading': {
                    on: {
                        'DATA_LOADED': {
                            target: 'drawing'
                        }
                    },
                },
                'drawing': {
                    entry: {
                        type: 'create_chart'
                    },
                    on: {
                        'CHART_DRAWN': {
                            target: 'loaded'
                        }
                    }
                },
                'loaded': {
                    type: 'parallel',
                    on: {
                        'DATA_LOADING': {
                            target: 'loading_filtered_data'
                        },
                        'DATA_LOADED': {
                            target: 'drawing'
                        },
                    },
                    states: {
                        hover: {
                            initial: 'not_hovering',
                            states: {
                                hovering: {
                                    on: {
                                        mouseout: {
                                            target: 'not_hovering'
                                        }
                                    },
                                    entry: ({ event }) => {
                                        if (event.data) {
                                            event.data.rows = [
                                                { name: 'Facilities Assesed', val: event.data.Assessed },
                                                { name: 'Percentage Complete', val: event.data.PercentageComplete + '%' }
                                            ]
                                            setTooltipData({
                                                position: event.position,
                                                data: event.data
                                            });
                                            setShowTooltip(true)
                                        }

                                        if (event.nodesToFade) {
                                            event.nodesToFade
                                                .style('opacity', 0.6)
                                        }

                                        const d3Root = d3.select(rootNode.current);

                                        event.idsToFade.forEach(d => {
                                            d3Root.select(d.id)
                                                .style('opacity', d.opacity)
                                        })
                                    }
                                },
                                not_hovering: {
                                    on: {
                                        mouseover: {
                                            target: 'hovering',
                                        }
                                    },
                                    entry: () => {
                                        setShowTooltip(false);

                                        const d3Root = d3.select(rootNode.current);

                                        d3Root.select('#line')
                                            .style('opacity', 1)

                                        d3Root.select('#circles')
                                            .style('opacity', 1)

                                        d3Root.select('#bars')
                                            .style('opacity', 1)

                                        d3Root.selectAll('#bars rect')
                                            .style('opacity', 1)
                                    }
                                }
                            }
                        },
                        filter: {
                            initial: 'not_filtered',
                            states: {
                                filtered: {

                                },
                                not_filtered: {
                                }
                            }
                        }
                    }
                },
                'loading_filtered_data': {
                    on: {
                        'DATA_LOADED': {
                            target: ['drawing']
                        }
                    },
                    exit: () => {
                    }
                }
            },
        });

    const actor = createActor(barChartMachine);

    return actor;
}

export { createRadialChartMachine };

export default function buildChart(rootNode, points) {

    rootNode.current.replaceChildren();

    points = points.map(d => ({...d,MetricValue : d.MetricValue / 100}))

    const longitude = d3.scalePoint(new Set(Plot.valueof(points, "Description")), [180, -180]).padding(0.5).align(1)

    const radarPlot =  Plot.plot({
        margin : 18,
        width: 240,
        projection: {
            type: "azimuthal-equidistant",
            rotate: [0, -90],
            // Note: 0.625° corresponds to max. length (here, 0.5), plus enough room for the labels
            domain: d3.geoCircle().center([0, 90]).radius(1.22)()
        },
        color: { legend: false },
        marks: [
            // grey discs
            Plot.geo([1, 0.8, 0.6, 0.4, 0.2], {
                geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
                stroke: "black",
                fill: "black",
                strokeOpacity: 0.3,
                fillOpacity: 0.03,
                strokeWidth: 0.5
            }),

            // white axes
            Plot.link(longitude.domain(), {
                x1: longitude,
                y1: 90 - 1,
                x2: 0,
                y2: 90,
                stroke: "white",
                strokeOpacity: 0.5,
                strokeWidth: 2.5
            }),

            // tick labels
            Plot.text([0.2, 0.4, 0.6,0.8], {
                x: 180,
                y: (d) => 90 - d,
                dx: 2,
                textAnchor: "start",
                text: (d) => `${100 * d}%`,
                fill: "currentColor",
                stroke: "white",
                fontSize: 8
            }),

            // axes labels
            Plot.text(longitude.domain(), {
                x: longitude,
                y: 90 - 1.2,
                text: Plot.identity,
                lineWidth: 5,
                fontFamily : 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
                fontSize : 9
            }),

            // areas
            Plot.area(points, {
                x1: ({ Description }) => longitude(Description),
                y1: ({ MetricValue }) => 90 - MetricValue,
                x2: 0,
                y2: 90,
                fill: "#338137",
                stroke: "#283618",
                curve: "linear-closed",
                fillOpacity : 0.5
            }),

            // points
            Plot.dot(points, {
                x: ({ Description }) => longitude(Description),
                y: ({ MetricValue }) => 90 - MetricValue,
                d : (d) => d,
                fill: "#338137",
                stroke: "white",
                r : 4
            }),

            // interactive labels
            Plot.text(
                points,
                Plot.pointer({
                    x: ({ Description }) => longitude(Description),
                    y: ({ MetricValue }) => 90 - MetricValue,
                    text: (d) => `${(100 * d.MetricValue).toFixed(0)}%`,
                    textAnchor: "start",
                    dx: 4,
                    fill: "currentColor",
                    stroke: "white"
                }),
            ),
        ]
    })

    rootNode.current.appendChild(radarPlot);
}