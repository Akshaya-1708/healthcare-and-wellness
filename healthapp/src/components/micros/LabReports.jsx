// src/components/labReports/LabReportsTab.jsx
import React from "react";
import { Box, Card, CardContent, Typography, IconButton, Chip } from "@mui/material";
import { PictureAsPdf, EventNote } from "@mui/icons-material";

export default function LabReportsTab({ reports }) {
  if (!reports || reports.length === 0) {
    return <Typography>No lab reports available.</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {reports.map((report) => (
        <Card
          key={report.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderRadius: 3,
            boxShadow: 3,
            transition: "0.3s",
            "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
            backgroundColor: "#f5f5f5",
          }}
        >
          {/* Report Info */}
          <CardContent sx={{ flex: 1 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <EventNote sx={{ color: "#1976d2" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                {report.testName}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Date: {report.date}
            </Typography>
            <Box mt={1}>
              <Chip
                label={report.status}
                color={report.status === "Completed" ? "success" : "warning"}
                size="small"
              />
            </Box>
          </CardContent>

          {/* PDF Download */}
          {report.reportUrl && (
            <IconButton
              href={report.reportUrl}
              target="_blank"
              sx={{ color: "#d32f2f" }}
              title="Download Lab Report PDF"
            >
              <PictureAsPdf fontSize="large" />
            </IconButton>
          )}
        </Card>
      ))}
    </Box>
  );
}
