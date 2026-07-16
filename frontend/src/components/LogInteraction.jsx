import { useState, useEffect } from "react";
import API from "../services/api";

import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Paper,
} from "@mui/material";

function LogInteraction({
  selectedInteraction,
  clearSelection,
}) {
  const [doctor, setDoctor] = useState("");
  const [hospital, setHospital] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [interactionType, setInteractionType] = useState("");
  const [interactionDate, setInteractionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [followupDate, setFollowupDate] = useState("");

const [summary, setSummary] = useState("");
const [editingId, setEditingId] = useState(null);

  const handleSubmit = async () => {
  try {

    if (editingId) {

      // UPDATE
      const res = await API.put(`/update/${editingId}`, {
        doctor_name: doctor,
        hospital: hospital,
        specialty: specialty,
        interaction_type: interactionType,
        interaction_date: interactionDate,
        notes: notes,
        follow_up_date: followupDate,
      });

      setSummary(res.data.summary);

      alert("Interaction Updated Successfully");

      setEditingId(null);

      clearSelection();

      window.location.reload();

    } else {

      // SAVE NEW
      const res = await API.post("/log", {
        doctor_name: doctor,
        hospital: hospital,
        specialty: specialty,
        interaction_type: interactionType,
        interaction_date: interactionDate,
        notes: notes,
        follow_up_date: followupDate,
      });

      setSummary(res.data.summary);

      alert("Interaction Saved Successfully");
    }

  } catch (error) {
    console.error(error);
    alert("Operation Failed");
  }
};
useEffect(() => {
  if (!selectedInteraction) return;

  setEditingId(selectedInteraction.id);

  setDoctor(selectedInteraction.doctor_name || "");
  setHospital(selectedInteraction.hospital || "");
  setSpecialty(selectedInteraction.specialty || "");
  setInteractionType(selectedInteraction.interaction_type || "");
  setInteractionDate(selectedInteraction.interaction_date || "");
  setNotes(selectedInteraction.notes || "");
  setFollowupDate(selectedInteraction.follow_up_date || "");
  setSummary(selectedInteraction.summary || "");

}, [selectedInteraction]);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Log Interaction
      </Typography>

      <Stack spacing={2}>

        <TextField
          label="Doctor Name"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          fullWidth
        />

        <TextField
          label="Hospital / Clinic"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          fullWidth
        />

        <TextField
          label="Specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          fullWidth
        />

        <TextField
          select
          label="Interaction Type"
          value={interactionType}
          onChange={(e) => setInteractionType(e.target.value)}
          fullWidth
        >
          <MenuItem value="Visit">Visit</MenuItem>
          <MenuItem value="Call">Call</MenuItem>
          <MenuItem value="Email">Email</MenuItem>
        </TextField>

        <TextField
          type="date"
          label="Interaction Date"
          InputLabelProps={{ shrink: true }}
          value={interactionDate}
          onChange={(e) => setInteractionDate(e.target.value)}
          fullWidth
        />

        <TextField
          label="Notes"
          multiline
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
        />

        <TextField
          type="date"
          label="Follow Up Date"
          InputLabelProps={{ shrink: true }}
          value={followupDate}
          onChange={(e) => setFollowupDate(e.target.value)}
          fullWidth
        />

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
          >
            {editingId ? "Update Interaction" : "Save Interaction"}
          </Button>

        {summary && (
          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">
              AI Summary
            </Typography>

            <Typography sx={{ mt: 2 }}>
              {summary}
            </Typography>
          </Paper>
        )}

      </Stack>
    </>
  );
}

export default LogInteraction;