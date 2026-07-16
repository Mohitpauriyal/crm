import { useState } from "react";
import API from "../services/api";

import {
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";

function ChatInterface() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleChat = async () => {

    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    try {

      const res = await API.post("/chat", {
        question: question,
      });

      setAnswer(res.data.answer);

    } catch (err) {
      console.log(err);
      alert("Failed to get AI response");
    }

  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        AI Chat
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          height: 300,
          p: 2,
          overflowY: "auto",
          mb: 2,
          bgcolor: "#fafafa",
        }}
      >

        <Typography color="primary" sx={{ mb: 2 }}>
          🤖 AI Assistant
        </Typography>

        {answer ? (
          <Typography>
            {answer}
          </Typography>
        ) : (
          <Typography color="text.secondary">
            Ask anything about your CRM interactions.
          </Typography>
        )}

      </Paper>

      <Stack spacing={2}>

        <TextField
          multiline
          rows={4}
          placeholder="Example: Show all interactions with Dr Sharma"
          fullWidth
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={handleChat}
        >
          Send to AI
        </Button>

      </Stack>
    </>
  );
}

export default ChatInterface;