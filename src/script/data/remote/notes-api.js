const BASE_URL = 'https://notes-api.dicoding.dev/v2'

async function fetchNotes() {
  try {
    const response = await fetch(`${BASE_URL}/notes`)
    const result = await response.json()
    if (result.status === 'success') {
      return result.data
    }
    throw new Error(result.message)
  } catch (error) {
    console.error('Kesalahan mengambil catatan:', error)
    return []
  }
}

async function createNote(title, body) {
  try {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    })
    const result = await response.json()
    if (result.status === 'success') {
      return result.data
    }
    throw new Error(result.message)
  } catch (error) {
    console.error('Kesalahan membuat catatan:', error)
  }
}

async function deleteNote(noteId) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
    })
    const result = await response.json()
    if (result.status === 'success') {
      return result.message
    }
    throw new Error(result.message)
  } catch (error) {
    console.error('Kesalahan menghapus catatan:', error)
  }
}

async function archiveNote(noteId) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${noteId}/archive`, {
      method: 'POST',
    })
    const result = await response.json()
    if (result.status === 'success') {
      return result.message
    }
    throw new Error(result.message)
  } catch (error) {
    console.error('Kesalahan mengarsipkan catatan:', error)
  }
}

async function fetchArchivedNotes() {
  try {
    const response = await fetch(`${BASE_URL}/notes/archived`)
    const result = await response.json()
    if (result.status === 'success') {
      return result.data
    }
    throw new Error(result.message)
  } catch (error) {
    console.error('Kesalahan mengambil catatan yang diarsipkan:', error)
    return []
  }
}

async function unarchiveNote(noteId) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${noteId}/unarchive`, {
      method: 'POST',
    })
    const result = await response.json()
    if (result.status === 'success') {
      return result.message
    }
    throw new Error(result.message)
  } catch (error) {
    console.error('Kesalahan membatalkan arsip catatan:', error)
  }
}

export {
  fetchNotes,
  fetchArchivedNotes,
  createNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
}
