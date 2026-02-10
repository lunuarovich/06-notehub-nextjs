"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/lib/api";
import { Note } from "@/types/note";

import styles from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

type CreateNotePayload = {
  title: string;
  content?: string;
  tag: Note["tag"];
};

interface NoteFormValues {
  title: string;
  content: string;
  tag: "" | Note["tag"];
}

const TAG_OPTIONS: Note["tag"][] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Min 3 chars")
    .max(50, "Max 50 chars")
    .required("Required"),

  content: Yup.string().max(500, "Max 500 chars").notRequired(),

  tag: Yup.mixed()
    .oneOf(TAG_OPTIONS, "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  return (
    <Formik<NoteFormValues>
      initialValues={{ title: "", content: "", tag: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const payload: CreateNotePayload = {
          title: values.title,
          tag: values.tag as Note["tag"],
          ...(values.content.trim()
            ? { content: values.content.trim() }
            : {}),
        };

        mutation.mutate(payload);
      }}
    >
      <Form className={styles.form}>
        <div className={styles.formGroup}>
          <label>Title</label>
          <Field name="title" className={styles.input} />
          <ErrorMessage name="title" component="p" className={styles.error} />
        </div>

        <div className={styles.formGroup}>
          <label>Content</label>
          <Field as="textarea" name="content" className={styles.textarea} />
          <ErrorMessage
            name="content"
            component="p"
            className={styles.error}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Tag</label>
          <Field as="select" name="tag" className={styles.select}>
            <option value="">Select tag</option>
            {TAG_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Field>
          <ErrorMessage name="tag" component="p" className={styles.error} />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create note"}
          </button>

          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}
