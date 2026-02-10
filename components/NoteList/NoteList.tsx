"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import { deleteNote } from "@/lib/api";
import { Note } from "@/types/note";

import styles from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.listItem}>
          <Link href={`/notes/${note.id}`}>
            <h3 className={styles.title}>{note.title}</h3>
            {note.content && <p className={styles.content}>{note.content}</p>}
            {note.tag && <span>{note.tag}</span>}
          </Link>

          <button onClick={() => mutation.mutate(note.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}