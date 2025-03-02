import { useEffect, useState } from "react";

export function CountryFlag({ country }) {
  const [flagUrl, setFlagUrl] = useState(null);

  useEffect(() => {
    if (!country) return;

    fetch(`https://restcountries.com/v3.1/name/${country}?fields=flags`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch flag");
        return response.json();
      })
      .then((data) => {
        const flag = data[0]?.flags?.png;
        if (flag) {
          setFlagUrl(flag);
        } else {
          console.log("Flag not found");
        }
      })
      .catch(() => console.log("Could not load flag"));
  }, [country]);

  return (
        <img
          src={flagUrl}
          alt={`${country} flag`}
          width="120"
          height="80"
          style={{ borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0,0,0,0.2)" }}
        />
  );
}