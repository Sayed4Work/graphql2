import axios from "axios";

const API_URL = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

export async function queryData(query, variables) {
    const token = localStorage.getItem("jwt");

    if (!token) {
        console.error("No token found. Please log in.");
        return null;
    }

    try {
        const requestData = { query };

        if (variables && Object.keys(variables).length > 0) {
        requestData.variables = variables; // Add variables only if not empty
        }
        const response = await axios.post(
        API_URL,
        requestData,
        {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        }
        );
        // Check if there is any data returned
        const data = response.data?.data;

        if (!data) {
            console.error("No data returned from GraphQL query.");
            return null;
        }
        if (data.transaction) {
            return data.transaction; 
        } else if (data.user) {
            return data.user;  
        } else {
            return data;  // Return all data if no specific structure is found
        }
        
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}
 