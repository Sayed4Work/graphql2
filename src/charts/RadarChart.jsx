import React from "react";

const RadarChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  const height = 300; // Chart size
  const size = 300; // Chart size
  const center = size / 2; // Center point
  const radius = size / 2.5; // Outer radius
  const levels = 5; // Number of concentric circles
  const angleSlice = (2 * Math.PI) / data.length; // Angle between points

  // Normalize data
  const maxValue = Math.max(...data.map((d) => d.amount)) || 1;
  const scale = (value) => (value / maxValue) * radius;

  return (
    <svg width={height + 50} height={height + 50} viewBox={`-30 -30 ${height + 60} ${height + 60}`}>
      {/* Background Circles */}
      {[...Array(levels)].map((_, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={((i + 1) / levels) * radius}
          stroke="lightgray"
          fill="none"
        />
      ))}

      {/* Straight Center Lines to Labels */}
      {data.map((d, i) => {
        const x = center + Math.cos(i * angleSlice) * radius;
        const y = center + Math.sin(i * angleSlice) * radius;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="gray"
            strokeWidth="1.5" // Make lines more visible
          />
        );
      })}

      {/* Data Polygon */}
      <polygon
        points={data
          .map((d, i) => {
            const scaledValue = scale(d.amount);
            const x = center + Math.cos(i * angleSlice) * scaledValue;
            const y = center + Math.sin(i * angleSlice) * scaledValue;
            return `${x},${y}`;
          })
          .join(" ")}
        fill="rgba(0, 123, 255, 0.4)"
        stroke="blue"
        strokeWidth="2"
      />

      {/* Labels & Data Points */}
      {data.map((d, i) => {
        const scaledValue = scale(d.amount);
        const xLabel = center + Math.cos(i * angleSlice) * (radius + 20); // Move label outward
        const yLabel = center + Math.sin(i * angleSlice) * (radius + 20);
        const pointX = center + Math.cos(i * angleSlice) * scaledValue;
        const pointY = center + Math.sin(i * angleSlice) * scaledValue;

        // Adjust label position to avoid overlap
        const textOffsetX = xLabel > center ? 5 : -12; // Shift right or left
        const textOffsetY = yLabel > center ? 5 : 0; // Shift down or up

        return (
          <g key={i}>
            {/* Skill Labels */}
            <text
              x={xLabel + textOffsetX}
              y={yLabel + textOffsetY}
              textAnchor="middle"
              fontSize="12px"
              fill="black"
              fontWeight="bold"
            >
              {d.type}
            </text>
            {/* Data Points */}
            <circle cx={pointX} cy={pointY} r="4" fill="blue" />
          </g>
        );
      })}
    </svg>
  );
};

export default RadarChart;
