'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { LoaderCircle, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { API_PATHS, createNotePath, type ApiErrorResponse, type Note, type NoteResponse, type NotesListResponse } from '@cf-template/shared';
import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { apiUrl, REQUEST_TIMEOUT_MS } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface StarterNotesPageProps {
  locale: Locale;
}

const NOTES_QUERY_KEY = ['starter-notes'];

function extractErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorResponse | undefined;
    return payload?.message ?? error.message;
  }

  return error instanceof Error ? error.message : fallback;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function StarterNotesPage({ locale }: StarterNotesPageProps) {
  const messages = getMessages(locale).notes;
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const notesQuery = useQuery({
    queryKey: NOTES_QUERY_KEY,
    queryFn: async () => {
      const response = await axios.get<NotesListResponse>(apiUrl(API_PATHS.notes), {
        timeout: REQUEST_TIMEOUT_MS,
      });
      return response.data.data.notes;
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async (nextTitle: string) => {
      const response = await axios.post<NoteResponse>(
        apiUrl(API_PATHS.notes),
        { title: nextTitle },
        {
          timeout: REQUEST_TIMEOUT_MS,
          headers: {
            'content-type': 'application/json',
          },
        },
      );
      return response.data.data.note;
    },
    onSuccess: async () => {
      setTitle('');
      setFeedback(null);
      await queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY });
    },
    onError: (error) => {
      setFeedback(extractErrorMessage(error, messages.errorCreate));
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      await axios.delete<NoteResponse>(apiUrl(createNotePath(noteId)), {
        timeout: REQUEST_TIMEOUT_MS,
      });
    },
    onSuccess: async () => {
      setFeedback(null);
      await queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY });
    },
    onError: (error) => {
      setFeedback(extractErrorMessage(error, messages.errorDelete));
    },
  });

  async function handleRefresh() {
    setFeedback(null);
    try {
      await notesQuery.refetch();
    } catch (error) {
      setFeedback(extractErrorMessage(error, messages.errorList));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFeedback(messages.emptyValidation);
      return;
    }

    setFeedback(null);
    await createNoteMutation.mutateAsync(trimmedTitle);
  }

  const notes = notesQuery.data ?? [];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">{messages.title}</h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">{messages.description}</p>
      </section>

      {feedback ? (
        <Alert variant="destructive">
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{feedback}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>{messages.formTitle}</CardTitle>
            <CardDescription>{messages.formDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="note-title">
                  {messages.formLabel}
                </label>
                <Input
                  id="note-title"
                  value={title}
                  placeholder={messages.formPlaceholder}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={160}
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={createNoteMutation.isPending}>
                {createNoteMutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
                {createNoteMutation.isPending ? messages.submitting : messages.submit}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle>{messages.listTitle}</CardTitle>
              <CardDescription>{messages.listDescription}</CardDescription>
            </div>
            <Button type="button" variant="outline" className="gap-2" onClick={() => void handleRefresh()} disabled={notesQuery.isFetching}>
              <RefreshCw className={`size-4 ${notesQuery.isFetching ? 'animate-spin' : ''}`} />
              {messages.refresh}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {notesQuery.isLoading ? (
              <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-sm text-muted-foreground">
                {messages.loading}
              </div>
            ) : null}

            {!notesQuery.isLoading && notes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-sm text-muted-foreground">
                {messages.emptyState}
              </div>
            ) : null}

            {notes.map((note: Note) => (
              <div key={note.id} className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="font-medium text-foreground">{note.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {messages.createdAtLabel}: {formatDateTime(note.createdAt)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {messages.updatedAtLabel}: {formatDateTime(note.updatedAt)}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 self-start"
                  disabled={deleteNoteMutation.isPending}
                  onClick={() => deleteNoteMutation.mutate(note.id)}
                >
                  <Trash2 className="size-4" />
                  {deleteNoteMutation.isPending ? messages.deleting : messages.delete}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
