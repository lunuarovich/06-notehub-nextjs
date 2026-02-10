"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import styles from "./NoteForm.module.css";
import { Note } from "@/types/note";

interface NoteFormProps {
  onClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Min 3 chars")
    .max(50, "Max 50 chars")
    .required("Required"),

  content: Yup.string().max(500, "Max 500 chars").notRequired(),

  tag: Yup.mixed()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .notRequired(),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
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
        mutation.mutate({
          title: values.title,
          content: values.content || undefined,
          tag: values.tag ? (values.tag as Note["tag"]) : undefined,
        });
      }}
    >
      <Form className={styles.form}>
        <div className={styles.formGroup}>
          <label>Title </label>
          <Field name="title" className={styles.input} />
          <ErrorMessage name="title" component="p" className={styles.error} />
        </div>

        <div className={styles.formGroup}>
          <label>Content </label>
          <Field as="textarea" name="content" className={styles.textarea} />
          <ErrorMessage name="content" component="p" className={styles.error} />
        </div>

        <div className={styles.formGroup}>
          <label>Tag </label>
          <Field as="select" name="tag" className={styles.input}>
            <option value="">Select tag</option>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton}>
            Create note
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
