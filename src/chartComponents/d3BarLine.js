import * as d3 from "d3";
import data from './data1.json'

const dataFiltered = data.slice(4)

import { createMachine, createActor, setup, assign } from 'xstate';

const machineEvents = {
    'DATA_LOADED': 'DATA_LOADED',
    'CHART_DRAWN': 'CHART_DRAWN'
}

function createBarChartMachine({
    dataLoaded,
    setShowTooltip,
    setTooltipData,
    rootNode
}) {

    const initState = 'loading';

    const barChartMachine = setup({

        actions: {
            create_chart: ({ context, self, event }) => {
                //console.log(context);
                //console.log(self);
                console.log(event);
                buildChart(
                    setShowTooltip,
                    setTooltipData,
                    rootNode,
                    self,
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
            context : {
                chartData : data,
                filteredData : data
            },
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
                            target: ['loaded.hover.not_hovering', 'loaded.filter.filtered']
                        }
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
                                    entry : ({context, self, event})=>{
                                        console.log('Entering filtered state line')
                                        console.log(context.filteredData, 'fd line')
                                        rootNode.current.replaceChildren();

                                        buildChart(
                                            setShowTooltip,
                                            setTooltipData,
                                            rootNode,
                                            self,
                                            event.data
                                        );
                                    }
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
                            target: ['loaded.hover.not_hovering', 'loaded.filter.filtered']
                        }
                    }
                }
            },
        });

    const actor = createActor(barChartMachine);

    /*runningMachine.subscribe({
        complete: () => {
            rootNode.replaceChildren();
        }
    });*/

    return actor;
}

export { createBarChartMachine };

//console.log(feedbackMachine)

function buildChart(
    setShowTooltip, 
    setTooltipData, 
    rootNode, 
    actorService,
    chartData
) {
    const margin = ({ top: 20, right: 100, bottom: 30, left: 100 })
    const height = 700
    const width = 1200

    const y2Axis = g => g
        .attr("transform", `translate(${width - margin.right},0)`)
        .call(d3.axisRight(y2))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", margin.right)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(data.y2))

    const y1Axis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        //.style("color", "steelblue")
        .call(d3.axisLeft(y1).ticks(null, "s"))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(data.y1))

    const x = d3.scaleBand()
        .domain(chartData.map((d, i) => d.ProvinceName))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.2)

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickSizeOuter(0))

    const y2 = d3.scaleLinear()
        .domain(d3.extent(chartData, d => d.PercentageComplete))
        .rangeRound([height - margin.bottom, margin.top])

    const y1 = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.Assessed)])
        .rangeRound([height - margin.bottom, margin.top])

    const line = d3.line()
        .x((d, i) => x(d.ProvinceName) + x.bandwidth() / 2)
        .y(d => y2(d.PercentageComplete))

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("class", "max-h-[500px]");

    svg.append("g")
        .attr('id', 'bars')
        .attr("fill", "#006105")
        .attr("fill-opacity", 0.8)
        .selectAll("rect")
        .data(chartData)
        .join("rect")
        .attr("x", d => x(d.ProvinceName))
        .attr("width", x.bandwidth())
        .attr("y", d => y1(d.Assessed))
        .attr("rx", 5)
        .attr("height", d => y1(0) - y1(d.Assessed))
        .on("mouseover", (e, d) => {
            actorService.send({
                type: 'mouseover',
                idsToFade: [
                    { id: '#line', opacity: 0.3 },
                    { id: '#circles', opacity: 0.3 }
                ],
                nodesToFade: svg.selectAll('#bars rect').filter(({ ProvinceName }) => d.ProvinceName != ProvinceName),
                data: d,
                position: calcTooltipPosition(e.pageX, e.pageY)
            });
        })
        .on("mouseout", (e, d) => {
            actorService.send({
                type: 'mouseout'
            });
        })

    svg.append("path")
        .attr("id", "line")
        .attr("fill", "none")
        .attr("stroke", "#283618")
        .attr("stroke-miterlimit", 1)
        .attr("stroke-width", 3)
        .attr("d", line(chartData))
        .on("mouseover", (d) => {
            actorService.send({
                type: 'mouseover',
                idsToFade: [
                    { id: '#bars', opacity: 0.6 }
                ]
            });
        })
        .on("mouseout", () => {
            actorService.send({
                type: 'mouseout'
            });
        })

    svg.append("g")
        .attr("id", "circles")
        .attr("fill", "white")
        .attr("fill-opacity", 1)
        .selectAll("circle")
        .data(chartData)
        .join("circle")
        .attr("stroke", "#283618")
        .attr("stroke-width", 1.5)
        .attr("cx", (d, i) => x(d.ProvinceName) + x.bandwidth() / 2)
        .attr("r", 5)
        .attr("cy", d => y2(d.PercentageComplete))
        .on("mouseover", (e, d) => {
            actorService.send({
                type: 'mouseover',
                idsToFade: [
                    { id: '#bars', opacity: 0.6 }
                ],
                data: d,
                position: calcTooltipPosition(e.pageX, e.pageY)
            });
        })
        .on("mouseout", (e, d) => {

            actorService.send({
                type: 'mouseout'
            });
        })

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(y1Axis);

    svg.append("g")
        .call(y2Axis);

    svg.selectAll('text').attr('class', 'barChartText')

    rootNode.current.appendChild(svg.node());

    console.log('building chart');
}

export default buildChart;

function calcTooltipPosition(x, y) {
    let left, right, bottom, top;

    if (y < window.innerHeight * 0.60) {
        top = `${y + 30}px`;
        bottom = 'unset';
    }
    else {
        bottom = `${window.innerHeight - y + 20}px`;
        top = 'unset';
    }

    left = `${x - 145}px`;

    if (x - 145 < 15) {
        left = `15px`;
    }
    else if (x + 145 > window.innerWidth) {
        left = 'unset';
        right = '25px';
    }

    return {
        top, right, bottom, left
    }
}