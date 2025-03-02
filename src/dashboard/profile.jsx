import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { FaMars, FaVenus, FaQuestion } from "react-icons/fa"; // Import gender icons
import { queryData } from "../api/api";
import { CountryFlag } from "./flag";

export function Profile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/");
            return
        }
        const query = `
        {
            user {
                id
                login
                attrs
                campus
            }
        }
        `;
        queryData(query, [])
        .then( data => {
            if (data.length > 0) {
                localStorage.setItem("userID", data[0].id)
                setUserData(data[0]); // Store user info
            } else {
                console.error("User info not found");
            }
        })
        .catch(error => console.error("Error fetching user info:", error));
    }, [navigate]);
    const country = userData?.attrs.country;
    const gender = userData?.attrs?.genders;
    // Determine gender symbol
    const getGenderIcon = (gender) => {
        if (gender?.toLowerCase() === "male") return <FaMars style={{ color: "blue" }} />;
        if (gender?.toLowerCase() === "female") return <FaVenus style={{ color: "pink" }} />;
        return <FaQuestion style={{ color: "gray" }} />;
    };
    const imageId = String(userData?.attrs?.["pro-picUploadId"] || "");
    useEffect(() => {
        if (imageId) {
            const proPic = getProPic(imageId);
            console.log(proPic);
        }
    }, [imageId]);

    return (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr auto", // Ensures the flag is always in the last column
          gap: "15px", 
          alignItems: "center",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
          color: "black",
          fontSize: "0.8rem"
        }}>
          <p><strong>Full name: </strong>{userData?.attrs?.firstName} {userData?.attrs?.lastName}</p>
          <p><strong>Username: </strong>{userData?.login}</p>
    
              {/* Country Flag appears in the last column */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px"}}>
             <CountryFlag country={country} />
          </div>

          <p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <strong>Gender: </strong> {getGenderIcon(gender)} {gender}
          </p>
          <p><strong>CPR: </strong>{userData?.attrs?.CPRnumber}</p>
    

        </div>
      );
    /* country, genders, othereq, graddate, jobtitle, lastName, CPRnumber, firstName, qualifica, employment, PhoneNumber, addressCity, dateOfBirth, medicalInfo,
        emergencyTel, placeOfBirth, addressStreet, qualification, addressCountry, countryOfBirth, id-cardUploadId, pro-picUploadId, addressPostalCode, emergencyLastName,
        emergencyFirstName, emergencyAffiliation, addressComplementStreet, general-conditionsAccepted} */
    //TODO: create HTML for user info
}


 // function to fetch the profile picture
 async function getProPic(imageId) {
    const token = localStorage.getItem("jwt");
    if (!token) {
        console.error("Token (jwt) not found");
        return null;
    }
    console.log(imageId);
    // Properly encode the parameters
    const encodedFileId = encodeURIComponent(imageId);
    const encodedToken = encodeURIComponent(token);

    const API_URL = `https://learn.reboot01.com/api/storage?fileId=${encodedFileId}&token=${encodedToken}`;

    console.log(API_URL);
    try {
        const response = await fetch(API_URL, {
            method: "GET", // Specify the request method
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${encodedToken}`,
            },
        });
    
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // Parse the JSON response
        const data = await response.json();
        console.log("Image fetched successfully:", data);
    } catch (error) {
        console.error("Error fetching user picture:", error);
    }
}

