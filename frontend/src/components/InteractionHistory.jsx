import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  TextField,
  Button,
} from "@mui/material";

function InteractionHistory({ onEdit }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await API.get("/history");
      console.log("History API:", res.data);
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this interaction?"
  );

  if (!confirmDelete) return;

  try {

    await API.delete(`/delete/${id}`);

    alert("Interaction Deleted Successfully");

    loadHistory();

  } catch (err) {

    console.log(err);

    alert("Delete Failed");

  }

};
  
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Interaction History
      </Typography>
      
      <TextField
      label="Search Doctor / Hospital / Specialty"
      fullWidth
      sx={{ mb: 3 }}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

      {history.length === 0 ? (
        <Typography>No interactions found.</Typography>
      ) : (
        <Stack spacing={2}>
          {history
  .filter((item) => {
    const q = search.toLowerCase();

    return (
      item.doctor_name?.toLowerCase().includes(q) ||
      item.hospital?.toLowerCase().includes(q) ||
      item.specialty?.toLowerCase().includes(q) ||
      item.notes?.toLowerCase().includes(q)
    );
  })
  .map((item) => (
            <Card key={item.id}>
              <CardContent>

                <Typography variant="h6">
                  {item.doctor_name || "N/A"}
                </Typography>

                <Typography color="text.secondary">
                  {item.hospital || "N/A"}
                </Typography>

                <Typography>
                  <b>Specialty:</b> {item.specialty || "N/A"}
                </Typography>

                <Typography>
                  <b>Interaction Type:</b> {item.interaction_type || "N/A"}
                </Typography>

                <Typography>
                  <b>Interaction Date:</b> {item.interaction_date || "N/A"}
                </Typography>

                <Typography>
                  <b>Follow Up:</b> {item.follow_up_date || "N/A"}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">
                  <b>Notes</b>
                </Typography>

                <Typography>
                  {item.notes}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => onEdit(item)}
                  >
                   Edit
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  sx={{ ml: 2 }}
                  onClick={() => handleDelete(item.id)}
                 >
                  Delete
                </Button>

                <Typography variant="subtitle1">
                  <b>AI Summary</b>
                </Typography>

                <Typography>
                  {item.summary}
                </Typography>

              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </>
  );
}

export default InteractionHistory;