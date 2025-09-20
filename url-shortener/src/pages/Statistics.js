import { useEffect, useState } from "react";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";
import { loadUrls } from "../utils/storage";
import { Log } from "../../Logging-Middleware/logging.js";

export default function Statistics() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    (async () => {
      await Log("frontend", "info", "statistics", "Statistics page opened");
      setUrls(loadUrls());
    })();
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>Shortener Statistics</Typography>

      {urls.length === 0 && <Typography>No data yet.</Typography>}

      {urls.map(u => (
        <Card key={u.shortcode} style={{ marginTop: 12 }}>
          <CardContent>
            <Typography>Short: {window.location.origin}/{u.shortcode}</Typography>
            <Typography>Original: {u.longUrl}</Typography>
            <Typography>Created: {new Date(u.createdAt).toLocaleString()}</Typography>
            <Typography>Expires: {new Date(u.expiryTs).toLocaleString()}</Typography>
            <Typography>Total Clicks: {u.clicks?.length || 0}</Typography>

            <Typography variant="subtitle2" style={{ marginTop: 8 }}>Click details</Typography>
            <List dense>
              {(u.clicks || []).slice().reverse().map((c, i) => (
                <ListItem key={i}>
                  <div>
                    <div><strong>Time:</strong> {new Date(c.ts).toLocaleString()}</div>
                    <div><strong>Source:</strong> {c.source}</div>
                    <div><strong>Geo:</strong> {c.geo}</div>
                  </div>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
