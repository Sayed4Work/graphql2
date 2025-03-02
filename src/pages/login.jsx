import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigation hook
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("username:", username, "Password:", password);
  
    const credentials = btoa(`${username}:${password}`); // Encode in Base64

    fetch("https://learn.reboot01.com/api/auth/signin", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      }
    })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json(); // Get error details
        throw new Error(errorData.message || "Login failed");
      }
      return response.json(); // Convert response to JSON
    })
    .then(token => {
      if (token) {
        localStorage.setItem("jwt", token); // Store the JWT securely
        console.log("JWT Stored Successfully");
          // **Redirect to Dashboard**
          navigate("/dashboard");
      } else {
        throw new Error("No token received");
      }
    })
    .catch((error) => {
      console.error("Error:", error.message)
      setErrorMessage(error.message); // Display error to user
    });
  };
  

  return (
    <Box
      sx={{ 
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f4ff", // Light gray background
      }}
      className="login-page"
    >
      <Container maxWidth="xs">
        <Box
          className="shadow-lg rounded-lg bg-white p-8"
          sx={{ textAlign: "center", padding: "20px", borderRadius: "1rem"  }}
        >
          <Typography variant="h2" gutterBottom color="black">
            GraphQL
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 3 }} // Margin-bottom
              required
              InputLabelProps={{
                required: false, // Remove the required asterisk
              }}
            />

            {/* Password Field */}
            <FormControl variant="outlined" fullWidth sx={{ mb: 3 }}>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                required
              />
            </FormControl>

            {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mb: 1 }}>
              {errorMessage}
            </Typography>
            )}

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};


export default Login;
