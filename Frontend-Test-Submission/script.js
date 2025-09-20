const { Log } = require("../Logging-Middleware/logging.js");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIxMDAwMDE4MTA4QGRpdC5lZHUuaW4iLCJleHAiOjE3NTgzNTAwMTIsImlhdCI6MTc1ODM0OTExMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjM4MmU1N2U2LWVlNDItNDFhYy05MzFjLTA3ZTIwNWU4YWUzYyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Imtlc2hhdiBjaGF1aGFuIiwic3ViIjoiNTE5OGY4OTEtNDEwOC00MmNiLTlhOTgtNGJhY2JmYjhlNjZiIn0sImVtYWlsIjoiMTAwMDAxODEwOEBkaXQuZWR1LmluIiwibmFtZSI6Imtlc2hhdiBjaGF1aGFuIiwicm9sbE5vIjoiMjIwMTAyMTkyIiwiYWNjZXNzQ29kZSI6IlNrbW5ldyIsImNsaWVudElEIjoiNTE5OGY4OTEtNDEwOC00MmNiLTlhOTgtNGJhY2JmYjhlNjZiIiwiY2xpZW50U2VjcmV0IjoiQlpVcVJFa3B3WW1Ucnh1bSJ9.Id8cOmK1mY58JVTDvnZdhptrkVvfBhSPIDQYW0U_Cq0";

async function submitForm(data) {
  try {
    await Log("frontend", "info", "api", "Submitting form data", TOKEN);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await Log("frontend", "info", "api", `Form submission simulated for ${data.name}`, TOKEN);

    console.log("Frontend log sent successfully.");
  } catch (err) {
    await Log("frontend", "fatal", "api", `Unexpected error: ${err.message}`, TOKEN);
    console.error(err);
  }
}

submitForm({ name: "Keshav" });
