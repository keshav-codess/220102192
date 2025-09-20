import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Shortener from "./pages/Shortener";
import Statistics from "./pages/Statistics";
import RedirectHandler from "./pages/RedirectHandler";
import { Container, AppBar, Toolbar, Typography, Button } from "@mui/material";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>URL Shortener</Typography>
          <Button color="inherit" href="/">Shorten</Button>
          <Button color="inherit" href="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>

      <Container style={{ marginTop: 24 }}>
        <Routes>
          <Route path="/" element={<Shortener />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/:shortcode" element={<RedirectHandler />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
