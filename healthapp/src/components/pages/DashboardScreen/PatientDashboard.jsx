// src/components/PatientDashboard.jsx
import React, { useState } from "react";
import { Box, Fab, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CloseIcon from "@mui/icons-material/Close";
import { useGetPatientProfileQuery } from "../../../app/service/patientDetails";
import PatientProfileCard from "../../macros/ProfileCard";
import RightSection from "../../macros/DetailsSection";
import DashboardReport from './DashboardReport';
import ChatbotPopup from '../../macros/Chatbot'

export default function PatientDashboard() {
  const { data, isLoading } = useGetPatientProfileQuery();
  const [openChat, setOpenChat] = useState(false);

  if (isLoading || !data) return <Box p={2}>Loading...</Box>;

  const handleOpenChat = () => setOpenChat(true);
  const handleCloseChat = () => setOpenChat(false);

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
        width="100%"
        gap={2}
        p={2}
        sx={{ boxSizing: "border-box" }}
      >
        {/* LEFT SECTION */}
        <Box sx={{ width: { xs: "100%", sm: "100%", md: "30%" } }}>
          <PatientProfileCard patient={data} />
        </Box>

        {/* RIGHT SECTION */}
        <Box sx={{ width: { xs: "100%", sm: "100%", md: "70%" } }}>
          <RightSection
            yearsData={data.years}
            insurance={data.insurance}
            careTeam={data.careTeam}
            riskScores={data.riskScores}
            lifestyle={data.lifestyle}
          />
          {/* Dashboard charts */}
        </Box>
      </Box>

      {/* Support Chat Floating Button */}
      <Fab
        color="primary"
        aria-label="support"
        onClick={handleOpenChat}
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          zIndex: 1000,
        }}
      >
        <SupportAgentIcon />
      </Fab>

      {/* Chatbot Dialog */}
   <Dialog
      open={openChat}
      onClose={handleCloseChat}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
          background: "linear-gradient(145deg, #f0f4f8, #d9e2ff)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#6c63ff",
          color: "#fff",
          fontWeight: "bold",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        Support Chat
        <IconButton
          onClick={handleCloseChat}
          sx={{ color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          height: "500px",
          padding: 0,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <ChatbotPopup patientData={data} />
      </DialogContent>
    </Dialog>

    </>
  );
}
