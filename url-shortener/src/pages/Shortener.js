
import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import { Log } from "../../Logging-Middleware/logging.js";
import { loadUrls, saveUrls } from "../utils/storage";
import { genShortcode, formatExpiry, nowTs } from "../utils/helpers";

const MAX_ROWS = 5;
const DEFAULT_VALIDITY = 30; 

export default function Shortener() {
  const [rows, setRows] = useState([{ longUrl: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    Log("frontend", "info", "page", "Shortener page opened");
    const saved = loadUrls();
    setResults(saved);
  }, []);

  function addRow() {
    if (rows.length >= MAX_ROWS) return;
    setRows([...rows, { longUrl: "", validity: "", shortcode: "" }]);
  }

  function changeRow(i, field, v) {
    const r = [...rows]; r[i][field] = v; setRows(r);
  }

  function validUrl(u) {
    try {
      const url = new URL(u);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch { return false; }
  }

  function isAlnum(s) { return /^[a-zA-Z0-9_-]{3,30}$/.test(s); }

  async function handleShorten() {
    await Log("frontend", "info", "shortener", `Attempting to shorten ${rows.length} URLs`);
    const existing = loadUrls();
    const usedShortcodes = new Set(existing.map(e => e.shortcode));

    const created = [];
    for (const r of rows) {
      const longUrl = r.longUrl.trim();
      if (!validUrl(longUrl)) {
        await Log("frontend", "error", "shortener", `Invalid URL: ${longUrl}`);
        alert(`Invalid URL: ${longUrl}`);
        return;
      }
      const validity = r.validity === "" ? DEFAULT_VALIDITY : parseInt(r.validity, 10);
      if (isNaN(validity) || validity <= 0) {
        await Log("frontend", "error", "shortener", `Invalid validity for ${longUrl}`);
        alert(`Invalid validity for ${longUrl}`);
        return;
      }

      let shortcode = r.shortcode.trim();
      if (shortcode) {
        if (!isAlnum(shortcode)) {
          await Log("frontend", "error", "shortener", `Invalid custom shortcode: ${shortcode}`);
          alert(`Custom shortcode must be alphanumeric/underscore/dash (3-30 chars): ${shortcode}`);
          return;
        }
        if (usedShortcodes.has(shortcode)) {
          await Log("frontend", "error", "shortener", `Shortcode collision: ${shortcode}`);
          alert(`Shortcode already in use: ${shortcode}`);
          return;
        }
      } else {
        do {
          shortcode = genShortcode(6);
        } while (usedShortcodes.has(shortcode));
      }

      usedShortcodes.add(shortcode);
      const createdAt = nowTs();
      const expiryTs = formatExpiry(createdAt, validity).getTime();

      const item = {
        longUrl,
        shortcode,
        createdAt,
        expiryTs,
        clicks: []
      };

      created.push(item);
      existing.push(item);
      await Log("frontend", "info", "shortener", `Created shortcode ${shortcode} for ${longUrl}`);
    }

    saveUrls(existing);
    setResults(existing);
    setRows([{ longUrl: "", validity: "", shortcode: "" }]);
    await Log("frontend", "info", "shortener", `Shortening completed: ${created.length} items`);
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>Shorten up to {MAX_ROWS} URLs</Typography>

      <Grid container spacing={2}>
        {rows.map((r, i) => (
          <Grid item xs={12} key={i}>
            <Card>
              <CardContent>
                <TextField label="Original URL" fullWidth margin="dense" value={r.longUrl}
                  onChange={(e) => changeRow(i, "longUrl", e.target.value)} />
                <Box display="flex" gap={2} mt={1}>
                  <TextField label="Validity (minutes)" type="number" value={r.validity}
                    onChange={(e) => changeRow(i, "validity", e.target.value)} />
                  <TextField label="Custom shortcode (optional)" value={r.shortcode}
                    onChange={(e) => changeRow(i, "shortcode", e.target.value)} />
                  <Button variant="outlined" onClick={() => { changeRow(i, "longUrl", ""); changeRow(i, "validity", ""); changeRow(i, "shortcode", ""); }}>Clear</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Button variant="contained" onClick={addRow} disabled={rows.length >= MAX_ROWS}>+ Add Row</Button>
          <Button variant="contained" color="primary" onClick={handleShorten} style={{ marginLeft: 12 }}>Shorten</Button>
        </Grid>

        <Grid item xs={12} style={{ marginTop: 24 }}>
          <Typography variant="h6">Results & Existing Short URLs</Typography>
          {results.length === 0 && <Typography>No shortened URLs yet.</Typography>}
          {results.map((r, i) => (
            <Card key={r.shortcode + i} style={{ marginTop: 8 }}>
              <CardContent>
                <Typography>Original: {r.longUrl}</Typography>
                <Typography>Short: <a href={`/${r.shortcode}`}>{window.location.origin}/{r.shortcode}</a></Typography>
                <Typography>Created: {new Date(r.createdAt).toLocaleString()}</Typography>
                <Typography>Expires: {new Date(r.expiryTs).toLocaleString()}</Typography>
                <Typography>Clicks: {r.clicks?.length || 0}</Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}
