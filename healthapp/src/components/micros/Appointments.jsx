// src/components/appointments/AppointmentsTab.jsx
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  IconButton,
  Chip,
} from "@mui/material";
import { CheckCircle, CalendarToday, PictureAsPdf } from "@mui/icons-material";

export default function AppointmentsTab({ data }) {
  const closedAppointments = data?.closed || [];
  const upcomingAppointments = data?.upcoming || [];

  // Gradient colors for medication tags
  const gradientColors = [
    "linear-gradient(135deg,#42a5f5,#7e57c2)",
    "linear-gradient(135deg,#ff8a65,#ff7043)",
    "linear-gradient(135deg,#26a69a,#66bb6a)",
    "linear-gradient(135deg,#ffb74d,#ffa726)",
  ];

  const getGradientColor = (index) => gradientColors[index % gradientColors.length];

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Closed Appointments */}
      <Box>
        <Box display="flex" alignItems="center" mb={1} gap={1}>
          <CheckCircle sx={{ color: "#4caf50" }} />
          <Typography variant="h6">Upcoming Appointments</Typography>
        </Box>

        {closedAppointments.length ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {closedAppointments.map((app) => (
              <Card
                key={app.id}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  backgroundColor: "#f9f9f9",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="#1976d2">
                    {app.date} - {app.doctor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.department} | Summary: {app.summary || "-"}
                  </Typography>
                  {app.notes && (
                    <Typography variant="body2" mt={1}>
                      Notes: {app.notes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography>No closed appointments</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Upcoming Appointments */}
      <Box>
        <Box display="flex" alignItems="center" mb={1} gap={1}>
          <CalendarToday sx={{ color: "#1976d2" }} />
          <Typography variant="h6">Closed Appointments</Typography>
        </Box>

        {upcomingAppointments.length ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {upcomingAppointments.map((app, idx) => (
              <Card
                key={app.id}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  backgroundColor: "#ffffff",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="#1976d2">
                    {app.date} at {app.time} - {app.doctor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.department} | Reason: {app.reason || "-"}
                  </Typography>
                  {app.notes && (
                    <Typography variant="body2" mt={1}>
                      Notes: {app.notes}
                    </Typography>
                  )}

                  {/* Medications / Prescriptions */}
                  {app.medications?.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                        Prescriptions:
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={1}>
                        {app.medications.map((med) => (
                          <Box
                            key={med.id}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            flexWrap="wrap"
                            gap={1}
                          >
                            <Box>
                              <Typography variant="body2">
                                {med.name} ({med.dosage}) | {med.frequency}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Duration: {med.startDate} - {med.endDate}
                              </Typography>
                              <Box mt={0.5} display="flex" flexWrap="wrap" gap={0.5}>
                                {med.tags?.map((tag, idx) => (
                                  <Chip
                                    key={idx}
                                    label={tag}
                                    size="small"
                                    sx={{
                                      background: getGradientColor(idx),
                                      color: "white",
                                      fontWeight: "500",
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>

                            {/* Prescription PDF download */}
                            {med.prescriptionFile && (
                              <IconButton
                                href={med.prescriptionFile}
                                target="_blank"
                                size="small"
                                sx={{ color: "#d32f2f" }}
                                title="Download Prescription PDF"
                              >
                                <PictureAsPdf fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography>No upcoming appointments</Typography>
        )}
      </Box>
    </Box>
  );
}
