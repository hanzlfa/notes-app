import {
  fetchArchivedNotes,
  unarchiveNote,
  deleteNote,
} from '../data/remote/notes-api.js'

class ArchivedNotes extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    await this.updateArchivedNotes()
  }

  async updateArchivedNotes() {
    try {
      this.notes = await fetchArchivedNotes()
      console.log('Archived notes fetched:', this.notes) // Debugging log
      this.renderNotes(this.notes)
    } catch (error) {
      console.error('Failed to update archived notes:', error)
    }
  }

  async handleAction(event, action) {
    const noteElement = event.target.closest('.note')
    const noteId = noteElement ? noteElement.dataset.noteId : null

    if (!noteId) {
      console.error('Note ID not found!')
      return
    }

    try {
      if (action === 'delete') {
        await deleteNote(noteId)
      } else if (action === 'unarchive') {
        await unarchiveNote(noteId)
      }
      await this.updateArchivedNotes()
      document.querySelector('note-container').updateNotes()
    } catch (error) {
      console.error(`Failed to ${action} note:`, error)
    }
  }

  renderNotes(notes) {
    this.innerHTML = ''
    const pastelColors = [
      '#d6e6ff',
      '#d7f9f8',
      '#ffffea',
      '#fff0d4',
      '#fbe0e0',
      '#e5d4ef',
      '#ffe5ec',
      '#ffc2d1',
      '#ffb3c6',
      '#ffe4eb',
      '#aefeee',
    ]

    notes.forEach((note) => {
      const noteDiv = document.createElement('div')
      noteDiv.classList.add('note')
      noteDiv.dataset.noteId = note.id // Ensure the data-note-id is set correctly
      noteDiv.classList.add(note.archived ? 'archived' : 'active')

      const noteColor =
        pastelColors[Math.floor(Math.random() * pastelColors.length)]
      noteDiv.style.backgroundColor = note.archived ? '#ffe5ec' : noteColor

      const createdAtDate = new Date(note.createdAt)
      const formattedDate = `${createdAtDate.getDate()}/${createdAtDate.getMonth() + 1}/${createdAtDate.getFullYear()}`
      const formattedTime = `${createdAtDate.getHours()}:${String(createdAtDate.getMinutes()).padStart(2, '0')}`
      const displayDateTime = `${formattedDate} ${formattedTime}`

      noteDiv.innerHTML = `
                <p class="note-date">${displayDateTime}</p>
                <h3>${note.title}</h3>
                <p class="note-body">${note.body.replace(/\n/g, '<br>')}</p>
                <div class="note-footer">
                    <i class="uil uil-trash delete-note"></i>
                    <i class="uil uil-edit edit-note"></i>
                    <i class="uil uil-archive unarchive-note"></i>
                </div>
            `

      // Add event listeners to icons
      noteDiv
        .querySelector('.delete-note')
        .addEventListener('click', (event) => {
          this.handleAction(event, 'delete')
        })
      noteDiv
        .querySelector('.unarchive-note')
        .addEventListener('click', (event) => {
          this.handleAction(event, 'unarchive')
        })
      noteDiv.querySelector('.edit-note').addEventListener('click', () => {
        window.alert('Edit note functionality coming soon!')
      })

      this.appendChild(noteDiv)
    })
  }
}

customElements.define('archived-notes', ArchivedNotes)
