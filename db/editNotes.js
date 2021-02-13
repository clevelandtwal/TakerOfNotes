const util = require("util");
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class editNotes {
  read() {
    return readFileAsync("db/db.json", "utf8");
  }

  write(note) {
    return writeFileAsync("db/db.json", JSON.stringify(note));
  }

  getNotes() {
    return this.read().then((notes) => {

      let cleanedNotes;


      try {
        cleanedNotes = [].concat(JSON.parse(notes));
      } catch (err) {
        cleanedNotes = [];
      }

      return cleanedNotes;
    })

  }

  addNote(note) {

    const { title, text } = note


    if (!title || !text) {
      throw new Error("You need a title and text value.");
    }

    var newId = uuidv4("string");
    console.log(newId)

    const nextNote = { title, text, id: newId }

    return this.getNotes()
      .then(notes => [...notes, nextNote])
      .then(newNoteList => this.write(newNoteList))
      .then(() => nextNote);

  }
  removeNote(id) {
    return this.getNotes()
      .then(notes => notes.filter(note => note.id !== id))
      .then(update => this.write(update))
      .then(console.log("selected note has been removed"))
  }
}

module.exports = new editNotes();