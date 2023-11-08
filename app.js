const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://xenoncluster:placementsite@cluster0.eqa7d5n.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model('User', {
  email: String,
  password: String,
});

app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User with the same email already exists');
    }

    // Hash the password before storing in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Successful signup
    res.status(200).send({ message: 'Signup successful' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
