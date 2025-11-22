// src/components/ChatbotPopup.jsx
import React, { useState, useRef, useEffect } from "react";
import { Box, Tabs, Tab, Typography, TextField, Button } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { GoogleGenAI } from "@google/genai";

export default function ChatbotPopup({ open, onClose, patientData }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello! I am your healthcare assistant." },
  ]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

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
      setLoading(false);
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
    <Box
      sx={{
        height: "90%",
        display: "flex",
        flexDirection: "column",
        p: 3,
        borderRadius: 3,
        background: "linear-gradient(145deg, #f5f7fa, #e0e7ff)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        overflowY: "auto", // <-- enable scrolling for the whole popup
      }}
    >
      {/* Tabs */}
      <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} variant="fullWidth">
        <Tab label="Appointments" />
        <Tab label="Allergies" />
        <Tab label="Medications" />
        <Tab label="Lab Reports" />
      </Tabs>

      {/* Tab content */}
      <Box
        sx={{
          mt: 2,
          mb: 2,
          p: 2,
          backgroundColor: "#ffffffcc",
          borderRadius: 2,
        }}
      >
        {renderTabContent()}
      </Box>

      {/* Messages */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
        {messages.map((msg, i) => (
          <Typography
            key={i}
            sx={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              p: 1,
              m: 1,
              backgroundColor: msg.role === "user" ? "#c0f0fd" : "#f0f0f0",
              borderRadius: 2,
              maxWidth: "75%",
              wordBreak: "break-word",
            }}
          >
            {msg.content}
          </Typography>
        ))}

        {loading && (
          <Typography
            sx={{
              alignSelf: "flex-start",
              p: 1,
              m: 1,
              backgroundColor: "#f0f0f0",
              borderRadius: 2,
              fontStyle: "italic",
              color: "#555",
            }}
          >
            Healthcare Assistant is typing...
          </Typography>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={loading}
          sx={{ borderRadius: 2, backgroundColor: "#6c63ff" }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
