import axios from "axios";

const LOCAL_PROXY_URL = "http://localhost:4000/log";

export async function Log(stack, level, packageName, message) {
  const payload = { stack, level, package: packageName, message };

  try {
    const res = await axios.post(LOCAL_PROXY_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log(`[${level.toUpperCase()}] [${stack}] [${packageName}] ${message}`);
    return res.data;
  } catch (err) {
    console.error("Failed to send log:", err.response?.data || err.message);
  }
}
