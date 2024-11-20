import * as d3 from "d3";
import data from './data1.json'

console.log(data)

const margin = ({ top: 20, right: 30, bottom: 30, left: 40 })
const height = 500
const width = 856

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
    .domain(data.map((d, i) => d.ProvinceName))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1)

const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
        .tickSizeOuter(0))

const y2 = d3.scaleLinear()
    .domain(d3.extent(data, d => d.PercentageComplete))
    .rangeRound([height - margin.bottom, margin.top])

const y1 = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Assessed)])
    .rangeRound([height - margin.bottom, margin.top])

const line = d3.line()
    .x((d, i) => x(d.ProvinceName) + x.bandwidth() / 2)
    .y(d => y2(d.PercentageComplete))

const chart = (setShowTooltip, setTooltipData) => {
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .attr('id', 'bars')
        .attr("fill", "#606c38")
        .attr("fill-opacity", 0.8)
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.ProvinceName))
        .attr("width", x.bandwidth())
        .attr("y", d => y1(d.Assessed))
        .attr("rx", 5)
        .attr("height", d => y1(0) - y1(d.Assessed))
        .on("mouseover", (e, d) => {
            console.log('in mouseover');

            console.log(calcTooltipPosition(e.pageX, e.pageY))

            setTooltipData({
                position: calcTooltipPosition(e.pageX, e.pageY),
                data: d
            });

            setShowTooltip(true);

            svg.select('#line')
                .style('opacity', 0.3)

            svg.select('#circles')
                .style('opacity', 0.3)
        })
        .on("mouseout", (e, d) => {
            console.log('in mouseout');

            setShowTooltip(false);

            svg.select('#line')
                .style('opacity', 1)

            svg.select('#circles')
                .style('opacity', 1)
        })

    svg.append("path")
        .attr("id", "line")
        .attr("fill", "none")
        .attr("stroke", "#283618")
        .attr("stroke-miterlimit", 1)
        .attr("stroke-width", 3)
        .attr("d", line(data))
        .on("mouseover", () => {
            svg.select('#bars')
                .style('opacity', 0.5)
        })
        .on("mouseout", () => {
            svg.select('#bars')
                .style('opacity', 1)
        })

    svg.append("g")
        .attr("id", "circles")
        .attr("fill", "white")
        .attr("fill-opacity", 1)
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("stroke", "#283618")
        .attr("stroke-width", 1.5)
        .attr("cx", (d, i) => x(d.ProvinceName) + x.bandwidth() / 2)
        .attr("r", 5)
        .attr("cy", d => y2(d.PercentageComplete))
        .on("mouseover", (e, d) => {
            console.log('in mouseover');

            console.log(calcTooltipPosition(e.pageX, e.pageY))

            setTooltipData({
                position: calcTooltipPosition(e.pageX, e.pageY),
                data: d
            });

            setShowTooltip(true);

            svg.select('#bars')
                .style('opacity', 0.6)
        })
        .on("mouseout", (e, d) => {
            console.log('in mouseout');

            setShowTooltip(false);

            svg.select('#bars')
                .style('opacity', 1)
        })

    /*svg.append("g")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", 0)
        .attr("height", height)
        .append("title")
        .text(d => `${d.year}
      ${d.sales.toLocaleString("en")} new cars sold
      ${d.efficiency.toLocaleString("en")} mpg average fuel efficiency`);*/

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(y1Axis);

    svg.append("g")
        .call(y2Axis);

    return svg.node();
}

export default chart;

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
};