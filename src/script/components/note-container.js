import {
  fetchNotes,
  deleteNote,
  archiveNote,
  unarchiveNote,
} from '../data/remote/notes-api.js'
import gsap from 'gsap'

class NoteContainer extends HTMLElement {
  constructor() {
    super()
    this.loadingIndicator = document.querySelector('loading-indicator')
  }

  async connectedCallback() {
    this.loadingIndicator.show()
    await this.updateNotes()
    this.loadingIndicator.hide()

    document
      .querySelector('add-note')
      .addEventListener('noteAdded', async () => {
        await this.updateNotes()
      })
  }

  async updateNotes() {
    try {
      this.notes = await fetchNotes()
      this.renderNotes(this.notes)
    } catch (error) {
      console.error('Failed to update notes:', error)
    }
  }

  async handleAction(event, action) {
    const noteId = event.target.closest('.note').dataset.noteId
    this.loadingIndicator.show()

    try {
      if (action === 'delete') {
        await deleteNote(noteId)
      } else if (action === 'archive') {
        await archiveNote(noteId)
      } else if (action === 'unarchive') {
        await unarchiveNote(noteId)
      }
      await this.updateNotes()
      document.querySelector('archived-notes').updateArchivedNotes()
    } catch (error) {
      console.error(`Failed to ${action} note:`, error)
    } finally {
      this.loadingIndicator.hide()
    }
  }

  renderNotes(notes) {
    console.log('Notes to render:', notes)
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
      noteDiv.dataset.noteId = note.id

      const noteColor =
        pastelColors[Math.floor(Math.random() * pastelColors.length)]
      noteDiv.style.backgroundColor = noteColor

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
                    <i class="uil uil-archive archive-note"></i>
                </div>
            `

      // Add event listeners to icons
      noteDiv
        .querySelector('.delete-note')
        .addEventListener('click', (event) => {
          gsap.to(event.target, {
            scale: 1.2,
            duration: 5,
            yoyo: true,
            repeat: 1,
          })
          this.handleAction(event, 'delete')
        })
      noteDiv
        .querySelector('.archive-note')
        .addEventListener('click', (event) => {
          gsap.to(event.target, {
            scale: 2,
            duration: 5,
            yoyo: true,
            repeat: 1,
          })
          this.handleAction(event, 'archive')
        })

      noteDiv.querySelector('.edit-note').addEventListener('click', () => {
        window.alert('Edit note functionality coming soon!')
      })

      this.appendChild(noteDiv)

      gsap.from(noteDiv, { opacity: 0, x: 20, duration: 0.5 })
    })
  }
}

customElements.define('note-container', NoteContainer)
