// src/macros/PatientProfileCard.jsx
import React, { useRef, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import { Email, Phone, Cake, LocationOn, Download } from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function PatientProfileCard({ patient }) {
  const insuranceCardRef = useRef(null);
  
  // Memoized full address
    const { profile, contact, age, gender, bloodGroup, fullName, dateOfBirth, insurance } = patient;

  const address = useMemo(() => {
    if (!contact?.address) return "-";
    const { line1, line2, city, state, postalCode, country } = contact.address;
    return `${line1}, ${line2}, ${city}, ${state}, ${postalCode}, ${country}`;
  }, [contact]);

  // Memoized PDF download function
  const downloadInsuranceCard = useCallback(async () => {
    const element = insuranceCardRef.current;
    if (!element) return;

    const infoText = element.querySelector(".download-info");
    if (infoText) infoText.style.display = "none";

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 20, 20, pdfWidth, pdfHeight);
    pdf.save("insurance-card.pdf");

    if (infoText) infoText.style.display = "block";
  }, []);


  if (!patient) return <Box p={2}>Loading...</Box>;


  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      p={{ xs: 1, sm: 2 }}
      sx={{ background: "#e0f7fa", borderRadius: 3 }}
    >
      {/* Profile + Contact Card */}
      <Card
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          boxShadow: 3,
          background: "linear-gradient(135deg, #42a5f5 0%, #7e57c2 100%)",
          color: "white",
          transition: "transform 0.3s",
          "&:hover": { transform: "translateY(-5px)" },
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems="center"
          gap={{ xs: 1, sm: 3 }}
        >
          <Avatar
            src={profile?.photoUrl || "/images/default-avatar.png"}
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              border: "2px solid white",
            }}
            imgProps={{ loading: "lazy" }}
          />
          <Box textAlign={{ xs: "center", sm: "left" }}>
            <Typography variant="h6" fontSize={{ xs: 16, sm: 20 }}>
              {fullName || "N/A"}
            </Typography>
            <Typography variant="body2" fontSize={{ xs: 12, sm: 14 }}>
              {age || "-"} Years Old, {gender || "-"} | Blood {bloodGroup || "-"}
            </Typography>
            <Typography variant="body2" fontSize={{ xs: 12, sm: 14 }}>
              {profile?.occupation || "-"}
            </Typography>
            <Typography variant="body2" fontSize={{ xs: 12, sm: 14 }}>
              {profile?.maritalStatus || "-"} | {profile?.nationality || "-"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.5)", my: { xs: 1, sm: 2 } }} />

        <List dense>
          <ListItem>
            <ListItemIcon sx={{ color: "white", minWidth: { xs: 30, sm: 40 } }}>
              <Email fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={contact?.email || "-"}
              primaryTypographyProps={{ fontSize: { xs: 12, sm: 14 } }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ color: "white", minWidth: { xs: 30, sm: 40 } }}>
              <Phone fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={contact?.phone || "-"}
              primaryTypographyProps={{ fontSize: { xs: 12, sm: 14 } }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ color: "white", minWidth: { xs: 30, sm: 40 } }}>
              <Cake fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={dateOfBirth || "-"}
              primaryTypographyProps={{ fontSize: { xs: 12, sm: 14 } }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ color: "white", minWidth: { xs: 30, sm: 40 } }}>
              <LocationOn fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={address}
              primaryTypographyProps={{ fontSize: { xs: 12, sm: 14 } }}
            />
          </ListItem>
        </List>
      </Card>

      {/* Insurance Card */}
      <Card
        ref={insuranceCardRef}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          boxShadow: 3,
          background: "linear-gradient(to right, #a8edea, #fed6e3)",
          position: "relative",
          transition: "all 0.3s",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
          },
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" mb={2} fontSize={{ xs: 14, sm: 16 }}>
          Insurance Card
        </Typography>

        <Box mb={1}>
          <Typography variant="body2" fontSize={{ xs: 12, sm: 14 }}>
            <strong>Name:</strong> {fullName || "-"}
          </Typography>
          <Typography variant="body2" fontSize={{ xs: 12, sm: 14 }}>
            <strong>Age:</strong> {age || "-"}
          </Typography>
          <Typography variant="body2" fontSize={{ xs: 12, sm: 14 }}>
            <strong>Blood Group:</strong> {bloodGroup || "-"}
          </Typography>
        </Box>

        <Typography variant="body2" fontSize={{ xs: 12, sm: 14 }}>
          Provider: {insurance?.provider || "-"}
        </Typography>
        <Typography variant="body2" fontSize={{ xs: 12, sm: 14 }}>
          Plan: {insurance?.planName || "-"}
        </Typography>
        <Typography variant="body2" fontSize={{ xs: 12, sm: 14 }}>
          Policy Number: {insurance?.policyNumber || "-"}
        </Typography>
        <Typography variant="body2" mb={1} fontSize={{ xs: 12, sm: 14 }}>
          Coverage: ₹{insurance?.coverageDetails?.totalCoverage?.toLocaleString() || "-"}
        </Typography>

        <IconButton
          onClick={downloadInsuranceCard}
          sx={{
            position: "absolute",
            top: { xs: 8, sm: 10 },
            right: { xs: 8, sm: 10 },
            color: "#1976d2",
          }}
        >
          <Download fontSize="small" />
        </IconButton>

        <Typography
          variant="caption"
          color="text.secondary"
          className="download-info"
          fontSize={{ xs: 10, sm: 12 }}
        >
          Click the download icon to save PDF
        </Typography>
      </Card>
    </Box>
  );
}

export default React.memo(PatientProfileCard);
