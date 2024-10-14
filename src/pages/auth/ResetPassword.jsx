import { Box, useTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ForgotPasswordForm from "../../forms/ForgotPasswordForm";
import { white } from "../../styles/Styled";

const ResetPassword = ({ darkMode }) => {
  const theme = useTheme();
  const navigateTo = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams(); // Get the reset token from the URL params

  useEffect(() => {
    // Fetch the email associated with the reset token
    const fetchEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3500/api/user/reset-email/${token}` // Adjust API endpoint as needed
        );
        const data = response.data;
        if (data.success) {
          setEmail(data.email); // Set the email received from the backend
        } else {
          toast.error(data.message); // Handle errors if needed
        }
      } catch (error) {
        toast.error("Failed to fetch email");
      }
    };

    fetchEmail();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await axios.put(
        `http://localhost:3500/api/user/resetpassword/${token}`,
        { password },
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      navigateTo("/login");
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        background: darkMode ? theme.palette.background.default : white,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 64px)",
        paddingTop: {
          xs: "none",
          md: "64px",
          lg: "64px",
        },
      }}
    >
      <ForgotPasswordForm
        fields={[
          {
            label: "Email",
            name: "email",
            type: "email",
            value: email,
            onChange: () => {}, // Disabled field, no change handler needed
            disabled: true,
          },
          {
            label: "New Password",
            name: "password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
          },
          {
            label: "Confirm Password",
            name: "confirmPassword",
            type: "password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
          },
        ]}
        onSubmit={handleSubmit}
        buttonText="Reset Password"
        darkMode={darkMode}
        title={"Reset Password"}
        placeholder={"Enter your password"}
      />
    </Box>
  );
};

export default ResetPassword;
