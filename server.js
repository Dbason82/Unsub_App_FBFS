const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Redirect root to /unsubscribe
app.get("/", (req, res) => {
  res.redirect("/unsubscribe");
});

// Serve the unsubscribe page
app.get("/unsubscribe", (req, res) => {
  res.sendFile(__dirname + "/public/unsubscribe.html");
});

// Handle form submission
app.post("/unsubscribe", async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send("Email is required.");
  }

  try {
    const { error } = await supabase.from("unsubscribed_emails").insert([{ email }]);

    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).send("An error occurred. Please try again.");
    }

    res.send("You have been unsubscribed.");
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("An error occurred. Please try again.");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
