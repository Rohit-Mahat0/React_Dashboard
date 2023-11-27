import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChartRace = ({ data, barColor }) => {
  const d3Container = useRef(null);

  // Debounce function to limit rapid successive executions
  const debounce = (func, delay) => {
    let inDebounce;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };

  useEffect(() => {
    if (data && d3Container.current) {
      // Function to draw or redraw the chart
      const drawChart = (sortedData, width, height) => {
        // Clear any existing content
        d3.select(d3Container.current).selectAll("*").remove();

        // Create SVG element with a viewBox for responsiveness
        const svg = d3.select(d3Container.current)
          .append('svg')
          .attr('viewBox', `0 0 ${width} ${height}`);

        // Set up scales
        const xScale = d3.scaleLinear()
          .domain([0, d3.max(sortedData, d => d.sales)])
          .range([0, width - 60]);

        const yScale = d3.scaleBand()
          .domain(sortedData.map(d => d.month))
          .range([0, height])
          .padding(0.1);

        // Draw bars, labels, etc., using scales
        svg.selectAll('rect')
            .data(sortedData)
            .join('rect')
            .attr('x', 0)
            .attr('y', d => yScale(d.month))
            .attr('width', d => xScale(d.sales))
            .attr('height', yScale.bandwidth())
            .attr('fill', barColor || 'steelblue');

        // Add month labels inside the bars
        svg.selectAll('.month-label')
            .data(sortedData)
            .join('text')
            .attr('class', 'month-label')
            .attr('x', 5)
            .attr('y', d => yScale(d.month) + yScale.bandwidth() / 2)
            .attr('dy', '0.35em')
            .attr('fill', 'white')
            .text(d => d.month);

        // Add sales values outside the bars
        svg.selectAll('.sales-label')
            .data(sortedData)
            .join('text')
            .attr('class', 'sales-label')
            .attr('x', d => xScale(d.sales) + 5) // Adjusted to use xScale
            .attr('y', d => yScale(d.month) + yScale.bandwidth() / 2)
            .attr('dy', '0.35em')
            .text(d => d.sales);
      };

      // Initial draw
      const containerWidth = d3Container.current.clientWidth;
      const containerHeight = d3Container.current.clientHeight;
      const sortedData = [...data].sort((a, b) => b.sales - a.sales);
      drawChart(sortedData, containerWidth, containerHeight);

      // Debounced resize handler
      const debouncedDrawChart = debounce((width, height) => {
        drawChart(sortedData, width, height);
      }, 100);

      // Resize observer for responsiveness
      const resizeObserver = new ResizeObserver(entries => {
        if (!entries || entries.length === 0) return;
        const { width, height } = entries[0].contentRect;
        debouncedDrawChart(width, height);
      });

      resizeObserver.observe(d3Container.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [data, barColor]);

  return (
    <div className="d3-component" ref={d3Container} />
  );
};

export default BarChartRace;
