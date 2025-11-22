// src/macros/EnhancedTabsSection.jsx
import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
import Appointments from "../micros/Appointments";
import WellnessStats from "../micros/Wellness";
import LabReportsTab from "../micros/LabReports";

export default function EnhancedTabsSection({ yearsData }) {
  const [tabIndex, setTabIndex] = useState(0);
  const year = "2025"; // Example: current year
  const data = yearsData?.[year] || {};

  // Tabs configuration
  const tabConfig = [
    { label: "Appointments", key: "appointments" },
    { label: "Medications", key: "medications" },
    { label: "Wellness", key: "wellness" },
    { label: "Lab Reports", key: "labReports" },
    { label: "Radiology", key: "radiologyReports" },
    { label: "Billings", key: "billings" },
    { label: "Surgeries", key: "surgeries" },
  ];

  const handleChange = (event, newValue) => setTabIndex(newValue);

  return (
    <Box>
      {/* Tab Header */}
      <Paper sx={{ borderRadius: 3, mb: 2, boxShadow: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: 3,
              backgroundColor: "#1976d2",
            },
          }}
        >
          {tabConfig.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              sx={{
                textTransform: "none",
                fontWeight: tabIndex === index ? "bold" : "500",
                fontSize: 14,
                minWidth: 120,
                mx: 1,
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  transform: "scale(1.05)",
                },
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <Box>
        {tabConfig.map((tab, index) => (
          <TabPanel key={index} value={tabIndex} index={index} data={data[tab.key]} tabKey={tab.key} />
        ))}
      </Box>
    </Box>
  );
}

// Separate TabPanel Component
function TabPanel({ value, index, data, tabKey }) {
  if (value !== index) return null;

  switch (tabKey) {
    case "appointments":
      return (
      <Appointments data={data} />
      );

    case "medications":
      return (
        <Box>
          <Typography variant="h6" mb={1}>
            Medications
          </Typography>
          <List dense>
            {data?.map((med) => (
              <ListItem key={med.id} sx={{ mb: 1, borderRadius: 2, "&:hover": { backgroundColor: "#f3f6fb" } }}>
                <ListItemText
                  primary={`${med.name} (${med.dosage})`}
                  secondary={`Frequency: ${med.frequency} | Status: ${med.status}`}
                />
              </ListItem>
            ))}
            {!data?.length && <Typography>No medications</Typography>}
          </List>
        </Box>
      );

    case "wellness":
      return (
        <Box>
          <Typography variant="h6" mb={1}>
            Wellness Stats
          </Typography>
        <WellnessStats data={data} />
        </Box>
      );
       case "Lab Reports":
      return (
        <Box>
          <Typography variant="h6" mb={1}>
            Wellness Stats
          </Typography>
         
        <LabReportsTab data={data} />
        </Box>
      );

    default:
      return <Typography>No data available for this section</Typography>;
  }
}
