import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

function Analytics() {

  const [data, setData] = useState({
    total_doctors: 0,
    total_interactions: 0,
    visits: 0,
    calls: 0,
    emails: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await API.get("/analytics");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{ mb: 4 }}
    >

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <Card sx={{ p: 1 }}>
          <CardContent>
            <Typography variant="h6">👨‍⚕️ Doctors</Typography>
            <Typography variant="h4">{data.total_doctors}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <Card sx={{ p: 1 }}>
          <CardContent>
            <Typography variant="h6">📋 Interactions</Typography>
            <Typography variant="h4">{data.total_interactions}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <Card sx={{ p: 1 }}>
          <CardContent>
            <Typography variant="h6">🏥 Visits</Typography>
            <Typography variant="h4">{data.visits}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={6} lg={2.4}>
        <Card sx={{ p: 1 }}>
          <CardContent>
            <Typography variant="h6">📞 Calls</Typography>
            <Typography variant="h4">{data.calls}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={6} lg={2.4}>
        <Card sx={{ p: 1 }}>
          <CardContent>
            <Typography variant="h6">📧 Emails</Typography>
            <Typography variant="h4">{data.emails}</Typography>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}

export default Analytics;