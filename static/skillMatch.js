document.addEventListener('DOMContentLoaded', function() {
    const width = document.getElementById('skillMatchCanvas').clientWidth;
    const height = document.getElementById('skillMatchCanvas').clientHeight;

    const svg = d3.select('#skillMatchCanvas')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Sample data - replace with actual data from your backend
    const nodes = [
        { id: "JavaScript", group: 1, score: 0.9 },
        { id: "Python", group: 1, score: 0.8 },
        { id: "React", group: 2, score: 0.85 },
        { id: "Node.js", group: 2, score: 0.75 },
        { id: "SQL", group: 3, score: 0.95 },
        { id: "AWS", group: 3, score: 0.7 }
    ];

    const links = [
        { source: "JavaScript", target: "React", value: 0.8 },
        { source: "JavaScript", target: "Node.js", value: 0.7 },
        { source: "Python", target: "SQL", value: 0.6 },
        { source: "Node.js", target: "AWS", value: 0.5 }
    ];

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    const node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("circle")
        .attr("r", 20)
        .attr("fill", d => d3.interpolateBlues(d.score));

    node.append("text")
        .text(d => d.id)
        .attr("x", 0)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("fill", "#666")
        .style("font-size", "12px");

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
});