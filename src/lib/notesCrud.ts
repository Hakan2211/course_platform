// lib/notes.ts
export interface Note {
  id: string;
  user_id: string;
  module_slug: string;
  lesson_slug: string;
  selected_text: string;
  note_text: string;
  created_at: string;
  updated_at: string;
}

const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

export async function createNote(
  moduleSlug: string,
  lessonSlug: string,
  selectedText: string,
  noteText: string
): Promise<Note> {
  const response = await fetch(`${baseUrl}/api/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      moduleSlug,
      lessonSlug,
      selectedText,
      noteText,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create note');
  }

  const { note } = await response.json();
  return note;
}

export async function getNotes(): Promise<Note[]> {
  const response = await fetch(`${baseUrl}/api/notes`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch notes');
  }

  const { notes } = await response.json();
  return notes;
}

export async function updateNote(id: string, noteText: string): Promise<Note> {
  const response = await fetch('/api/notes', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      noteText,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update note');
  }

  const { note } = await response.json();
  return note;
}

export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`/api/notes?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete note');
  }
}
