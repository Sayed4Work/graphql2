import { useEffect, useState } from "react";
import { queryData } from "../api/api";
import RadarChart from "../charts/RadarChart";

export function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const query = `
        { 
            transaction (where: {type: {_like: "%skill_%"}} order_by: {id: asc}) {
            type
            amount
            }
        }
      `;

      try {
        const data = await queryData(query);
        console.log("Fetched Data:", data);
        
        // Ensure we store only the transaction array
        setSkills(data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSkills();
  }, []);

  const validTypes = new Set([
    "skill_algo",
    "skill_go",
    "skill_html",
    "skill_back-end",
    "skill_front-end",
    "skill_js"
  ]);

  const calculateTotals = (transactions) => {
    const totals = {};
    if (transactions?.length) {
      for (const item of transactions) {
        if (validTypes.has(item.type)) {
          totals[item.type] = (totals[item.type] || 0) + item.amount;
        }
      }
    }

    console.log("Calculated Totals:", totals); // Debugging output
    return Object.entries(totals).map(([type, amount]) => ({
      type: type.replace("skill_", ""), // Remove "skill_"
      amount
    }));  };

  if (skills === null) {
    return <p>Loading skills...</p>;
  }
  
  const totals = calculateTotals(skills);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <RadarChart data={totals} /> 
    </div>
  );
}
