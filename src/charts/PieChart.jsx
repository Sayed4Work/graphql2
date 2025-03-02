import React from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";

export default function PieAnimation({ audits, auditRatio }) {
  const valueFormatter = (item) => `${ item.value }`;

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <PieChart
        height={300}
        series={[
          {
            data: audits.map((audit, index) => ({
              ...audit,
              color: index === 0 ? "#0047AB" : "#C70039", // ✅ Custom colors
            })),
            innerRadius: 100, // Creates a donut hole
            outerRadius: 140,
            arcLabelMinAngle: 20,
            valueFormatter,
          },
        ]}
        slotProps={{
          legend: { hidden: false }, // Hide the default legend
        }}
        renderLabel={({ cx, cy }) => (
          <text
            x={cx} // Center X
            y={cy} // Center Y
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="18"
            fontWeight="bold"
            fill="black"
          >
            {auditRatio !== null ? `${auditRatio}` : "Loading..."}
          </text>
        )}
      />
    </Box>
  );
}
