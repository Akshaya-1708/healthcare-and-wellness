// src/macros/WellnessStats.jsx
import React from "react";
import { Box, Typography, Card, LinearProgress } from "@mui/material";
import { LocalDrink, Hotel, Whatshot, DirectionsWalk } from "@mui/icons-material";

export default function WellnessStats({ data }) {
  if (!data) return null;

  const waterValue = parseFloat(data.waterIntakeAvg); // extract number from "2.8 L/day"
  const maxWater = 5; // max L/day
  const maxSleep = 12; // max hours/day
  const maxCalories = 1000; // arbitrary daily calories goal

  return (
    <Box display="flex" flexDirection="column" gap={3}>

      {/* Steps Monthly Card */}
      {data.stepsMonthly && (
        <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, backgroundColor: "#f0f4f8" }}>
          <Box display="flex" alignItems="center" mb={1}>
            <DirectionsWalk sx={{ color: "#1976d2", mr: 1 }} />
            <Typography variant="h6">Steps This Month</Typography>
          </Box>
          {Object.entries(data.stepsMonthly).map(([month, steps]) => (
            <Box key={month} display="flex" alignItems="center" gap={2} mb={1}>
              <Typography sx={{ minWidth: 50 }}>{month}:</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((steps / 10000) * 100, 100)}
                sx={{
                  flex: 1,
                  height: 10,
                  borderRadius: 5,
                  "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #42a5f5, #7e57c2)" },
                }}
              />
              <Typography>{steps}</Typography>
            </Box>
          ))}
        </Card>
      )}

      {/* Circular Stats */}
      <Box display="flex" gap={3} flexWrap="wrap">
        {/* Sleep Hours */}
        {data.sleepHoursAvg && (
          <Card sx={{ flex: 1, minWidth: 150, p: 2, borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
            <Hotel sx={{ fontSize: 40, color: "#8e24aa" }} />
            <Typography variant="subtitle1" mt={1}>Avg Sleep</Typography>
            <Box position="relative" display="inline-flex" mt={1}>
              <Box
                component="div"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `conic-gradient(#8e24aa ${(data.sleepHoursAvg / maxSleep) * 360}deg, #e0e0e0 0deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="subtitle2">{data.sleepHoursAvg}h</Typography>
              </Box>
            </Box>
          </Card>
        )}

        {/* Water Intake */}
        {data.waterIntakeAvg && (
          <Card sx={{ flex: 1, minWidth: 150, p: 2, borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
            <LocalDrink sx={{ fontSize: 40, color: "#1e88e5" }} />
            <Typography variant="subtitle1" mt={1}>Water Intake</Typography>
            <Box position="relative" display="inline-flex" mt={1}>
              <Box
                component="div"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `conic-gradient(#1e88e5 ${(waterValue / maxWater) * 360}deg, #e0e0e0 0deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="subtitle2">{data.waterIntakeAvg}</Typography>
              </Box>
            </Box>
          </Card>
        )}

        {/* Calories Burnt */}
        {data.caloriesBurntAvg && (
          <Card sx={{ flex: 1, minWidth: 150, p: 2, borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
            <Whatshot sx={{ fontSize: 40, color: "#f4511e" }} />
            <Typography variant="subtitle1" mt={1}>Calories Burnt</Typography>
            <Box position="relative" display="inline-flex" mt={1}>
              <Box
                component="div"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `conic-gradient(#f4511e ${(data.caloriesBurntAvg / maxCalories) * 360}deg, #e0e0e0 0deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="subtitle2">{data.caloriesBurntAvg} kcal</Typography>
              </Box>
            </Box>
          </Card>
        )}
      </Box>
    </Box>
  );
}
