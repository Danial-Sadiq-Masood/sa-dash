import * as Plot from "@observablehq/plot";

import points from "./points.json"

const longitude = d3.scalePoint(new Set(Plot.valueof(points, "key")), [180, -180]).padding(0.5).align(1)


export default function drawChart() {
    return Plot.plot({
        width: 450,
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
            Plot.text([0.3, 0.4, 0.6,0.8], {
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
                y: 90 - 1.1,
                text: Plot.identity,
                lineWidth: 5,
                fontFamily : 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
            }),

            // areas
            Plot.area(points, {
                x1: ({ key }) => longitude(key),
                y1: ({ value }) => 90 - value,
                x2: 0,
                y2: 90,
                fill: "#606c38",
                stroke: "#283618",
                curve: "cardinal-closed",
                fillOpacity : 0.5
            }),

            // points
            Plot.dot(points, {
                x: ({ key }) => longitude(key),
                y: ({ value }) => 90 - value,
                fill: "#606c38",
                stroke: "white",
                r : 5
            }),

            // interactive labels
            Plot.text(
                points,
                Plot.pointer({
                    x: ({ key }) => longitude(key),
                    y: ({ value }) => 90 - value,
                    text: (d) => `${(100 * d.value).toFixed(0)}%`,
                    textAnchor: "start",
                    dx: 4,
                    fill: "currentColor",
                    stroke: "white",
                    maxRadius: 10
                })
            ),
        ]
    })
}