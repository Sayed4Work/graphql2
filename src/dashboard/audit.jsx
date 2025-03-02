import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { queryData } from "../api/api";
import PieAnimation from "../charts/PieChart";

export function Audit() {
  const navigate = useNavigate();
  const [auditRatio, setAuditRatio] = useState(null);
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/");
      return;
    }

    const userID = parseInt(localStorage.getItem("userID"), 10);
    const variables = { userID };

    const query = `
      query getAudits($userID: Int!) {
        auditsReceived: audit_aggregate(
          where: { auditorId: { _neq: $userID }, grade: { _is_null: false } }
        ) {
          aggregate {
            count
          }
        }
        auditsDone: audit_aggregate(
          where: { auditorId: { _eq: $userID }, grade: { _is_null: false } }
        ) {
          aggregate {
            count
          }
        }
        xpUp: transaction_aggregate(where: { type: { _eq: "up" }}) {
          aggregate {
            sum {
              amount
            }
          }
        }
        xpDown: transaction_aggregate(where: { type: { _eq: "down" }}) {
          aggregate {
            sum {
              amount
            }
          }
        }
      }
    `;

    queryData(query, variables)
      .then((data) => {
        if (data) {
          const done = parseInt(data?.auditsDone?.aggregate?.count, 10) || 0;
          const received = parseInt(
            data?.auditsReceived?.aggregate?.count,
            10
          ) || 0;

          const xpUp = data?.xpUp?.aggregate?.sum?.amount || 0;
          const xpDown = data?.xpDown?.aggregate?.sum?.amount || 1; // Avoid division by zero

          const ratio = xpDown !== 0 ? (xpUp / xpDown).toFixed(2) : 0; // Calculate ratio safely
          setAuditRatio(ratio);

          // Update pie chart data dynamically
          setAudits([
            { label: "Done", value: done },
            { label: "Received", value: received },
          ]);
        } else {
          console.error("No data received.");
        }
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',  // Stack elements vertically
      alignItems: 'center',     // Center horizontally
      padding: '20px',
    }}>
      <PieAnimation audits={audits} auditRatio={auditRatio} />
      <h2 style={{ marginLeft: '-10%' }}>Audits Ratio: {auditRatio}</h2>
    </div>
  );
}
