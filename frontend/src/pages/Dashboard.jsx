import { useState } from "react";
import {
  Container,
  Paper,
  Button,
  Box,
} from "@mui/material";

import API from "../services/api";

import Navbar from "../components/Navbar";
import Analytics from "../components/Analytics";
import LogInteraction from "../components/LogInteraction";
import ChatInterface from "../components/ChatInterface";
import InteractionHistory from "../components/InteractionHistory";

function Dashboard() {
  const [selectedInteraction, setSelectedInteraction] = useState(null);

  const downloadPDF = async () => {
    try {
      const response = await API.get("/export/pdf", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = "Interaction_Report.pdf";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.log(err);
      alert("PDF Download Failed");
    }
  };

  return (
    <>
      <Navbar />

      <Container
        maxWidth="xl"
        sx={{
          mt: 4,
          mb: 5,
        }}
      >
        <Button
          variant="contained"
          color="success"
          sx={{ mb: 3 }}
          onClick={downloadPDF}
        >
          Export PDF
        </Button>

        <Analytics />

        <Box
          sx={{
            display: "flex",
            gap: "100px",
            mt: 4,
            alignItems: "flex-start",
            flexDirection: {
              xs: "column",
              lg: "row",
            },
          }}
        >
          {/* Left Side */}
          <Box
            sx={{
              flex: 2.5,
              width: "100%",
            }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 3,
              }}
            >
              <LogInteraction
                selectedInteraction={selectedInteraction}
                clearSelection={() =>
                  setSelectedInteraction(null)
                }
              />
            </Paper>
          </Box>

          {/* Right Side */}
          <Box
            sx={{
              flex: 1,
              width: {
                xs: "100%",
                lg: 360,
              },
            }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 3,
                position: "sticky",
                top: 20,
              }}
            >
              <ChatInterface />
            </Paper>
          </Box>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <InteractionHistory
              onEdit={setSelectedInteraction}
            />
          </Paper>
        </Box>

      </Container>
    </>
  );
}

export default Dashboard;