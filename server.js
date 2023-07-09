const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const notesFilePath = path.join(__dirname, 'public', 'db', 'db.json');

// Get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes file:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

// Save a new note
app.post('/api/notes', (req, res) => {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes file:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      const notes = JSON.parse(data);
      const newNote = {
        id: Date.now(),
        title: req.body.title,
        text: req.body.text,
      };
      notes.push(newNote);
      fs.writeFile(notesFilePath, JSON.stringify(notes), (err) => {
        if (err) {
          console.error('Error writing notes file:', err);
          res.status(500).json({ error: 'An error occurred' });
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes file:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      fs.writeFile(notesFilePath, JSON.stringify(updatedNotes), (err) => {
        if (err) {
          console.error('Error writing notes file:', err);
          res.status(500).json({ error: 'An error occurred' });
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.redirect('/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
