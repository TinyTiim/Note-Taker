// Get DOM elements
const noteTitle = document.querySelector('.note-title');
const noteText = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');
const noteList = document.querySelector('.list-container .list-group');

// Function to fetch notes from the server
const getNotes = () => fetch('/api/notes').then((response) => response.json());

// Function to save a note to the server
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

// Function to delete a note from the server
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Function to render the list of notes
const renderNoteList = (notes) => {
  noteList.innerHTML = '';

  if (notes.length === 0) {
    const noNotesEl = document.createElement('li');
    noNotesEl.classList.add('list-group-item');
    noNotesEl.innerText = 'No saved notes';
    noteList.appendChild(noNotesEl);
  } else {
    notes.forEach((note) => {
      const liEl = document.createElement('li');
      liEl.classList.add('list-group-item');

      const spanEl = document.createElement('span');
      spanEl.classList.add('list-item-title');
      spanEl.innerText = note.title;

      const deleteBtnEl = document.createElement('i');
      deleteBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );

      // Event listener for deleting a note
      deleteBtnEl.addEventListener('click', () => {
        deleteNote(note.id)
          .then(() => {
            getAndRenderNotes();
            setActiveNote({});
            renderActiveNote();
          })
          .catch((error) => {
            console.error('Error deleting note:', error);
          });
      });

      liEl.appendChild(spanEl);
      liEl.appendChild(deleteBtnEl);
      noteList.appendChild(liEl);

      // Event listener for viewing a note
      liEl.addEventListener('click', () => {
        setActiveNote(note);
        renderActiveNote();
      });
    });
  }
};

// Function to get and render the notes from the server
const getAndRenderNotes = () => {
  getNotes()
    .then((notes) => {
      renderNoteList(notes);
    })
    .catch((error) => {
      console.error('Error fetching notes:', error);
    });
};

// Function to set the active note
let activeNote = {};

// Function to set the active note
const setActiveNote = (note) => {
  activeNote = note;
};

// Function to render the active note in the editor
const renderActiveNote = () => {
  if (activeNote.id) {
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
    saveNoteBtn.style.display = 'none';
  } else {
    noteTitle.value = '';
    noteText.value = '';
    saveNoteBtn.style.display = 'inline';
  }
};

// Event listener for saving a note
saveNoteBtn.addEventListener('click', () => {
  if (activeNote.id) {
    // Updating an existing note
    const updatedNote = {
      id: activeNote.id,
      title: noteTitle.value.trim(),
      text: noteText.value.trim(),
    };

    saveNote(updatedNote)
      .then(() => {
        getAndRenderNotes();
        setActiveNote({});
        renderActiveNote();
      })
      .catch((error) => {
        console.error('Error saving note:', error);
      });
  } else {
    // Creating a new note
    const newNote = {
      title: noteTitle.value.trim(),
      text: noteText.value.trim(),
    };

    saveNote(newNote)
      .then(() => {
        getAndRenderNotes();
        setActiveNote({});
        renderActiveNote();
      })
      .catch((error) => {
        console.error('Error saving note:', error);
      });
  }
});

// Event listener for creating a new note
newNoteBtn.addEventListener('click', () => {
  setActiveNote({});
  renderActiveNote();
});

// Initialize the application
getAndRenderNotes();
renderActiveNote();
