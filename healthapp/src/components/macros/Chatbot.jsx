// src/components/ChatbotPopup.jsx
import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, TextField, Button, CircularProgress } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { GoogleGenAI } from "@google/genai";

// Patient data coming via props
export default function ChatbotPopup({ open, onClose, patientData }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello! I am your healthcare assistant." },
  ]);
  const [loading, setLoading] = useState(false); // loading state

  // Initialize Gemini client
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true); // start loading

    const fullPrompt = `
Patient Data:
${JSON.stringify(patientData, null, 2)}

User: ${userMessage}
    `;

    try {
      const chat = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });

      const botReply = chat.text;
      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, I'm having trouble right now." },
      ]);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return patientData.years["2025"].appointments.upcoming.map((appt, idx) => (
          <ReactMarkdown key={idx}>
            {`- **Date:** ${appt.date}\n- **Doctor:** ${appt.doctor}\n- **Department:** ${appt.department}\n- **Reason:** ${appt.reason}\n`}
          </ReactMarkdown>
        ));
      case 1:
        return <ReactMarkdown>{patientData.allergies.map(a => `- ${a}`).join("\n")}</ReactMarkdown>;
      case 2:
        return patientData.years["2025"].appointments.upcoming.flatMap(appt => appt.medications).map((med, idx) => (
          <ReactMarkdown key={idx}>
            {`- **Name:** ${med.name}\n- **Dosage:** ${med.dosage}\n- **Frequency:** ${med.frequency}\n`}
          </ReactMarkdown>
        ));
      case 3:
        return patientData.years["2025"].labReports.map((lab, idx) => (
          <ReactMarkdown key={idx}>
            {`- **Test:** ${lab.testName}\n- **Date:** ${lab.date}\n- **Status:** ${lab.status}\n`}
          </ReactMarkdown>
        ));
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: "100%", p: 2 }}>
      <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} variant="fullWidth">
        <Tab label="Appointments" />
        <Tab label="Allergies" />
        <Tab label="Medications" />
        <Tab label="Lab Reports" />
      </Tabs>

      <Box sx={{ mt: 2, mb: 2, minHeight: "120px", overflowY: "auto" }}>
        {renderTabContent()}
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        {messages.map((msg, i) => (
          <Typography
            key={i}
            sx={{
              textAlign: msg.role === "user" ? "right" : "left",
              p: 1,
              m: 1,
              backgroundColor: msg.role === "user" ? "#d0f0fd" : "#f1f1f1",
              borderRadius: 1,
            }}
          >
            {msg.content}
          </Typography>
        ))}

        {loading && (
          <Typography
            sx={{
              textAlign: "left",
              p: 1,
              m: 1,
              backgroundColor: "#f1f1f1",
              borderRadius: 1,
              fontStyle: "italic",
              color: "#888",
            }}
          >
            AI is typing...
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button variant="contained" onClick={handleSendMessage} disabled={loading}>
          Send
        </Button>
      </Box>
    </Box>
  );
}
