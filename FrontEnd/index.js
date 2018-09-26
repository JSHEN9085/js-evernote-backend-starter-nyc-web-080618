document.addEventListener("DOMContentLoaded", () => {

//step 1 get;
const allNotes = document.getElementById("noteContainer");

fetch('http://localhost:3000/api/v1/users')
.then(response => response.json())
.then(userData => {
  let currentUserId = userData[0].id;
  allNotes.className = `${currentUserId}`
  allNotes.innerHTML = userData[0].notes.map((note) => {
    return `<div id=noteDiv-${note.id} > ${note.id} > ${note.title}
    <button type="button" id=notePreview-${note.id} name="preview" >Preview</button>
    <button type="edit" id=noteEdit-${note.id} name="edit" >Edit</button>
    <button type="button" id=noteDelete-${note.id} name="delete" >Delete</button>
    <div></div>
    <div></div>
    <br>
    </div>`
  }).join("")
})

//step 2 preview
allNotes.addEventListener("click", (event) => {
  if (event.target.name === "preview"){
    let noteId = event.target.id.split("-")[1];
    fetch('http://localhost:3000/api/v1/users')
    .then(response => response.json())
    .then(userData => {
      let targetNoteObj = userData[0].notes.find(noteObj => noteObj.id == noteId);
        document.getElementById(`noteDiv-${noteId}`).children[3].innerHTML = `<p>${targetNoteObj.body}</p>`
    })
  }
})

//step 3 (create)
const addNote = document.getElementById('newNoteForm')

addNote.addEventListener("submit", (event) => {
  event.preventDefault();
  const newNoteTitle = event.target.querySelector('#input-title').value;
  const newNoteBody = event.target.querySelector('#input-body').value;
  const currentUserId = document.getElementById('noteContainer').className;

  fetch('http://localhost:3000/api/v1/notes', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: newNoteTitle,
      body: newNoteBody,
      user_id: Number(currentUserId)
    })
  }).then(response => response.json())
  .then(note => {
    let div = document.createElement("div")
    div.innerHTML = `<div id=noteDiv-${note.id}> ${note.id} > ${note.title}
    <button type="button" id=notePreview-${note.id} name="preview" >Preview</button>
    <button type="button" id=noteDelete-${note.id} name="delete" >Delete</button>
    <div></div>
    </div>`
    allNotes.append(div);
  })
    event.target.reset()
  })



//step 3 (edit)
allNotes.addEventListener("click", (event) => {
  let noteId = event.target.id.split("-")[1];
  if (event.target.name === "edit"){
    document.getElementById(`noteDiv-${noteId}`).children[4].innerHTML =
      `<form id="editNoteForm" class=${noteId}>
        <label>Title</label>
        <br>
        <input type="text" name="title" id="edit-title">
        <br>
        <label>Body</label>
        <br>
        <textarea name="body" rows="10" cols="30" id="edit-body"></textarea>
        <br>
        <input type="submit" value="Edit">
      </form>`
  }
})

allNotes.addEventListener("submit", (event) => {
  if (event.target.id === "editNoteForm"){
    let noteId = Number(event.target.className);
    const editNoteTitle = event.target.querySelector('#edit-title').value;
    const editNoteBody = event.target.querySelector('#edit-body').value;

    fetch(`http://localhost:3000/api/v1/notes/${noteId}`, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: editNoteTitle,
        body: editNoteBody
      })
    })
  }
})

//step 3 (delete)
allNotes.addEventListener("click", (event) => {
  if (event.target.name === "delete"){
    let noteId = Number(event.target.id.split("-")[1]);
    fetch(`http://localhost:3000/api/v1/notes/${noteId}`, {
      method: "delete"
    })
    .then(response => response.json())
    .then((noteData) => {
      document.getElementById(`noteDiv-${noteData.noteId}`).remove();
    })
  }
})

})
