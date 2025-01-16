const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // To load environment variables

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    try {
      const { error } = await supabase
        .from("unsubscribed_emails")
        .insert([{ email }]);

      if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "An error occurred. Please try again." });
      }

      res.status(200).json({ message: "You have been unsubscribed." });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ error: "An error occurred. Please try again." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
