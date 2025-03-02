import { useEffect, useState } from "react";
import { queryData } from "../api/api";
import { LineChart } from "@mui/x-charts/LineChart";

function XpPerMonth() {
  const [monthlyXp, setMonthlyXp] = useState([]);
  const [totalXp, setTotalXp] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchXp = async () => {
      const query = `
      {
        transaction(
          where: { 
            type: { _eq: "xp" }, 
            event: { object: { name: { _eq: "Module" } } } 
          }, 
          order_by: { id: asc }
        ) {
          id
          amount
          createdAt
        }
      }`;

      try {
        const data = await queryData(query);
        console.log(data);
        if (data && data.length > 0) {
          const transactions = data;

          const monthlyXp = getMonthlyXp(transactions);
          const totalxp = getTotalXp(transactions);
          setMonthlyXp(monthlyXp);
          setTotalXp(totalxp);
          console.log(monthlyXp);
        } else {
          setError("Could not fetch XP data");
        }
      } catch (error) {
        setError(
          error.message || "An unexpected error occurred while fetching XP data"
        );
      }
    };
    fetchXp();
  }, []);

  return (
    <>
      {error && <p className="text-white text-center text-lg font-bold mb-2">{error}</p>}

      {monthlyXp.length > 0 && totalXp ? (
      <div>
          <LineChart
            xAxis={[{ scaleType: "point", data: monthlyXp.map((d) => d.month) }]}
            series={[{ data: monthlyXp.map((d) => d.xp), curve: "linear" , color: "rgba(2, 154, 2, 0.6)" }]}
            width={600}
            height={400}
          />
        </div>
      ) : null}
    </>
  );
}

export default XpPerMonth;

function getMonthlyXp(transactions) {
    // Initialize an object with all 12 months set to 0 XP
    const monthlyXpMap = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1, // Month from 1 to 12
      xp: 0,
    })).reduce((acc, { month, xp }) => {
      acc[month] = xp;
      return acc;
    }, {});
  
    // Process transactions and sum XP per month
    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      const month = date.getMonth() + 1; // Convert to 1-12
  
      monthlyXpMap[month] += transaction.amount / 1000;
    });
  
    // Convert object back to an array
    return Object.entries(monthlyXpMap).map(([month, xp]) => ({
      month: parseInt(month), // Ensure numeric values for x-axis
      xp: parseFloat(xp.toFixed(2)), // Ensure XP values are formatted correctly
    }));
  }
  

function getTotalXp(transactions) {
  return transactions.reduce((acc, transaction) => acc + transaction.amount / 1000, 0).toFixed(0);
}
