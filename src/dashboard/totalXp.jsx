import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { queryData } from "../api/api";

export function TotalXP() {
  const navigate = useNavigate();
  const [userXP, setUserXP] = useState(null);

  useEffect(() => {
      const token = localStorage.getItem("jwt");
      if (!token) {
          navigate("/");
          return
      }
      const query = `
      {
        transaction_aggregate (
          where:{  
            event: { path: { _eq: "/bahrain/bh-module" } }
            type: { _eq: "xp" }
          }
        )
        
        {
          aggregate{
            sum{
              amount
            }
          }
        }

      }
      `;
      queryData(query, [])
      .then( data => {
          if (data) {
              setUserXP(data?.transaction_aggregate?.aggregate?.sum?.amount); // Store user info
          } else {
              console.error("User info not found");
          }
      })
      .catch(error => console.error("Error fetching user info:", error));
  }, [navigate]);
  return (
<div style={{ textAlign: "center", padding: "20px" }}>
  <h1
    style={{
      fontSize: "4.5rem", // Bigger XP text
      fontWeight: "900",
      background: "linear-gradient(45deg, #00ff00, #008000, #004d00)",
      WebkitBackgroundClip: "text",
      color: "transparent",
      textShadow: "4px 4px 10px rgba(0, 255, 0, 0.6)",
      letterSpacing: "3px",
      marginBottom: "2px",
      textTransform: "uppercase",
    }}
  >
    <strong>XP</strong>
  </h1>
  <p
    style={{
      fontSize: "2.5rem",
      fontWeight: "bold",
      background: "linear-gradient(90deg, #00ff00, #66ff66)",
      WebkitBackgroundClip: "text",
      textShadow: "2px 2px 8px rgba(0, 255, 0, 0.2)",
      padding: "5px 15px",
      borderRadius: "10px",
      display: "inline-block",
      color: "black"
    }}
  >
    {userXP}
  </p>
</div>
  );
}