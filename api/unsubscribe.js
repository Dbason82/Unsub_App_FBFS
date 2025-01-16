// api/unsubscribe.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const email = req.body.email;

    if (!email) {
      return res.status(400).send('Email is required.');
    }

    try {
      const { error } = await supabase.from('unsubscribed_emails').insert([{ email }]);

      if (error) {
        console.error('Error inserting data:', error);
        return res.status(500).send('An error occurred. Please try again.');
      }

      return res.status(200).send('You have been unsubscribed.');
    } catch (err) {
      console.error('Server error:', err);
      return res.status(500).send('An error occurred. Please try again.');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
