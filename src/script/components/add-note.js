import Swal from 'sweetalert2'
import { createNote } from '../data/remote/notes-api.js'

class AddNote extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
            <button class="add-note-btn">
                <i class="uil uil-plus"></i> Add Note
            </button>
            <div class="add-note-popup">
                <div class="popup">
                    <div class="content">
                        <i class="uil uil-times close-btn"></i>
                        <form id="note-form">
                            <h2>Let's capture your ideas...</h2>
                            <label for="note-title">Title</label>
                            <input type="text" id="note-title" name="title" required>
                            <div class="error-message" id="title-error"></div>
                            <br>
                            <label for="note-content">Description</label>
                            <textarea id="note-content" required></textarea>
                            <div class="error-message" id="content-error"></div>
                            <br>
                            <button type="submit" class="save-note">
                                <i class="uil uil-save"></i> Save Note
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `

    const addButton = this.querySelector('.add-note-btn')
    const popup = this.querySelector('.add-note-popup')
    const closeBtn = this.querySelector('.close-btn')
    const form = this.querySelector('#note-form')

    addButton.addEventListener('click', () => {
      popup.classList.toggle('active')
    })

    closeBtn.addEventListener('click', () => {
      popup.classList.remove('active')
      form.reset()
      this.clearErrors()
    })

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      this.clearErrors()

      const title = this.querySelector('#note-title').value
      const body = this.querySelector('#note-content').value

      let hasError = false

      if (title.trim() === '' || title.length < 3) {
        this.showError(
          'title-error',
          'Judul harus terdiri dari minimal 3 karakter.'
        )
        hasError = true
      }

      if (body.trim() === '' || body.length < 5) {
        this.showError(
          'content-error',
          'Deskripsi harus terdiri dari minimal 5 karakter.'
        )
        hasError = true
      }

      if (hasError) return

      try {
        const newNote = await createNote(title, body)
        if (newNote) {
          this.dispatchEvent(
            new CustomEvent('noteAdded', {
              detail: newNote,
            })
          )
          popup.classList.remove('active')
          form.reset()

          // Tampilkan alert sukses
          Swal.fire({
            title: 'Note added!',
            text: 'Your note has been successfully added.',
            icon: 'success',
            width: 400,
            customClass: {
              confirmButton: 'my-confirm-button',
            },
            buttonsStyling: false,
          })
        }
      } catch (error) {
        console.error('Error saving note:', error)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          width: 400,
          customClass: {
            confirmButton: 'my-confirm-button',
          },
          buttonsStyling: false,
        })
      }
    })
  }

  showError(elementId, message) {
    const errorElement = this.querySelector(`#${elementId}`)
    errorElement.textContent = message
    errorElement.style.color = 'red'
  }

  clearErrors() {
    const errorElements = this.querySelectorAll('.error-message')
    errorElements.forEach((el) => {
      el.textContent = ''
    })
  }
}

customElements.define('add-note', AddNote)
