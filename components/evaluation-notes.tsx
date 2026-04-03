'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  Send,
  Trash2,
  Edit2,
  X,
  Check,
  User,
  Clock,
  Loader2,
  StickyNote,
} from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/language-context';

interface Author {
  id: string;
  name: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  jobTitle: string | null;
}

interface Note {
  id: string;
  content: string;
  evaluationType: string;
  evaluationId: string;
  recipientEmail: string;
  recipientName: string | null;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

interface EvaluationNotesProps {
  evaluationType: 'DISC' | 'DRIVING_FORCES' | 'EQ' | 'DNA' | 'ACUMEN' | 'VALUES' | 'STRESS' | 'TECHNICAL';
  evaluationId: string;
  recipientEmail: string;
  recipientName?: string;
  compact?: boolean;
  className?: string;
}

export function EvaluationNotes({
  evaluationType,
  evaluationId,
  recipientEmail,
  recipientName,
  compact = false,
  className = '',
}: EvaluationNotesProps) {
  const { data: session } = useSession() || {};
  const { language, t } = useLanguage();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(!compact);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/notes?evaluationType=${evaluationType}&evaluationId=${evaluationId}&recipientEmail=${encodeURIComponent(recipientEmail)}`
      );
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, [evaluationType, evaluationId, recipientEmail]);

  useEffect(() => {
    if (session?.user) {
      fetchNotes();
    } else {
      setLoading(false);
    }
  }, [session, fetchNotes]);

  const handleSubmitNote = async () => {
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluationType,
          evaluationId,
          content: newNote.trim(),
          recipientEmail,
          recipientName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes([data.note, ...notes]);
        setNewNote('');
        toast.success(t('notes.addedSuccess'));
      } else {
        const error = await response.json();
        toast.error(error.error || t('notes.addError'));
      }
    } catch (error) {
      console.error('Error submitting note:', error);
      toast.error(t('notes.addError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      const response = await fetch(`/api/notes/${noteToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(notes.filter((n) => n.id !== noteToDelete));
        toast.success(t('notes.deletedSuccess'));
      } else {
        toast.error(t('notes.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(t('notes.deleteError'));
    } finally {
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(notes.map((n) => (n.id === noteId ? data.note : n)));
        setEditingNote(null);
        setEditContent('');
        toast.success(t('notes.updatedSuccess'));
      } else {
        toast.error(t('notes.updateError'));
      }
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(t('notes.updateError'));
    }
  };

  const getAuthorName = (author: Author) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    }
    return author.name || author.email.split('@')[0];
  };

  const getEvaluationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      DISC: t('notes.type.disc'),
      DRIVING_FORCES: t('notes.type.drivingForces'),
      EQ: t('notes.type.eq'),
      DNA: t('notes.type.dna'),
      ACUMEN: t('notes.type.acumen'),
      VALUES: t('notes.type.values'),
      STRESS: t('notes.type.stress'),
    };
    return labels[type] || type;
  };

  if (!session?.user) {
    return (
      <Card className={`${className} border-dashed border-2 border-slate-200`}>
        <CardContent className="py-6 text-center">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm text-muted-foreground">
            {t('notes.signInRequired')}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (compact && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className={`flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors ${className}`}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{t('notes.count')} ({notes.length})</span>
      </button>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            {t('notes.title')}
            {notes.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {notes.length}
              </Badge>
            )}
          </CardTitle>
          {compact && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {t('notes.evaluation')}: {getEvaluationTypeLabel(evaluationType)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form to add new note */}
        <div className="space-y-2">
          <Textarea
            placeholder={t('notes.placeholder')}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitNote}
              disabled={!newNote.trim() || submitting}
              size="sm"
              className="gap-2"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {t('notes.addNote')}
            </Button>
          </div>
        </div>

        {/* Notes list */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('notes.noNotes')}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-slate-50 rounded-lg p-4 space-y-2 border border-slate-100"
              >
                {/* Author info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {getAuthorName(note.author)}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {note.author.jobTitle && (
                          <span>{note.author.jobTitle}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(note.createdAt), "d MMM yyyy, HH:mm", {
                            locale: language === 'es' ? es : enUS,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions - only for author */}
                  {session.user.id === note.author.id && (
                    <div className="flex items-center gap-1">
                      {editingNote === note.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateNote(note.id)}
                            className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingNote(null);
                              setEditContent('');
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingNote(note.id);
                              setEditContent(note.content);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setNoteToDelete(note.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                {editingNote === note.id ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={2}
                    className="resize-none text-sm"
                  />
                ) : (
                  <p className="text-sm text-slate-700 whitespace-pre-wrap pl-10">
                    {note.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('notes.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('notes.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('notes.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('notes.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

// Component to show all notes for a person (used in analytics)
interface PersonNotesProps {
  recipientEmail: string;
  recipientName?: string;
  className?: string;
}

export function PersonNotes({
  recipientEmail,
  recipientName,
  className = '',
}: PersonNotesProps) {
  const { data: session } = useSession() || {};
  const { language, t } = useLanguage();
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesByType, setNotesByType] = useState<Record<string, Note[]>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/notes/by-person?email=${encodeURIComponent(recipientEmail)}`
        );
        if (response.ok) {
          const data = await response.json();
          setNotes(data.notes || []);
          setNotesByType(data.notesByType || {});
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [recipientEmail, session]);

  const getAuthorName = (author: Author) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    }
    return author.name || author.email.split('@')[0];
  };

  const getEvaluationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      DISC: t('notes.type.disc'),
      DRIVING_FORCES: t('notes.type.drivingForces'),
      EQ: t('notes.type.eq'),
      DNA: t('notes.type.dna'),
      ACUMEN: t('notes.type.acumen'),
      VALUES: t('notes.type.values'),
      STRESS: t('notes.type.stress'),
    };
    return labels[type] || type;
  };

  const getEvaluationTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      DISC: 'bg-red-100 text-red-700',
      DRIVING_FORCES: 'bg-purple-100 text-purple-700',
      EQ: 'bg-pink-100 text-pink-700',
      DNA: 'bg-teal-100 text-teal-700',
      ACUMEN: 'bg-amber-100 text-amber-700',
      VALUES: 'bg-violet-100 text-violet-700',
      STRESS: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (!session?.user) {
    return null;
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        {t('notes.loading')}
      </div>
    );
  }

  if (notes.length === 0) {
    return null;
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className={`flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors ${className}`}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{t('notes.viewCount')} {notes.length} {notes.length === 1 ? t('notes.note') : t('notes.notesPlural')}</span>
      </button>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            {t('notes.history')}
            <Badge variant="secondary">{notes.length}</Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {recipientName && (
          <p className="text-sm text-muted-foreground">
            {t('notes.about')}: {recipientName} ({recipientEmail})
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.entries(notesByType).map(([type, typeNotes]) => (
            <div key={type} className="space-y-2">
              <Badge className={getEvaluationTypeColor(type)}>
                {getEvaluationTypeLabel(type)} ({typeNotes.length})
              </Badge>
              <div className="space-y-2 pl-2 border-l-2 border-slate-200">
                {typeNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-slate-50 rounded-lg p-3 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="font-medium">
                        {getAuthorName(note.author)}
                      </span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(new Date(note.createdAt), "d MMM yyyy, HH:mm", {
                          locale: language === 'es' ? es : enUS,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Componente de botón de notas para el listado
// ============================================

interface EvaluationNotesButtonProps {
  evaluationType: 'DISC' | 'DRIVING_FORCES' | 'EQ' | 'DNA' | 'ACUMEN' | 'VALUES' | 'STRESS' | 'TECHNICAL';
  evaluationId: string;
  recipientEmail: string;
  recipientName?: string;
  initialNotesCount?: number;
}

export function EvaluationNotesButton({
  evaluationType,
  evaluationId,
  recipientEmail,
  recipientName,
  initialNotesCount = 0,
}: EvaluationNotesButtonProps) {
  const { data: session } = useSession() || {};
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesCount, setNotesCount] = useState(initialNotesCount);
  const [loading, setLoading] = useState(false);
  const [countLoading, setCountLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Fetch notes count on mount
  const fetchNotesCount = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/notes/count?evaluationType=${evaluationType}&evaluationId=${evaluationId}&recipientEmail=${encodeURIComponent(recipientEmail)}`
      );
      if (response.ok) {
        const data = await response.json();
        setNotesCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching notes count:', error);
    } finally {
      setCountLoading(false);
    }
  }, [evaluationType, evaluationId, recipientEmail]);

  // Load count on mount
  useEffect(() => {
    if (session?.user) {
      fetchNotesCount();
    } else {
      setCountLoading(false);
    }
  }, [session, fetchNotesCount]);

  const fetchNotes = useCallback(async () => {
    if (!open) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/notes?evaluationType=${evaluationType}&evaluationId=${evaluationId}&recipientEmail=${encodeURIComponent(recipientEmail)}`
      );
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
        setNotesCount(data.notes?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, [evaluationType, evaluationId, recipientEmail, open]);

  useEffect(() => {
    if (open && session?.user) {
      fetchNotes();
    }
  }, [open, session, fetchNotes]);

  const handleSubmitNote = async () => {
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluationType,
          evaluationId,
          content: newNote.trim(),
          recipientEmail,
          recipientName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes([data.note, ...notes]);
        setNotesCount(notesCount + 1);
        setNewNote('');
        toast.success(t('notes.addedSuccess'));
      } else {
        const error = await response.json();
        toast.error(error.error || t('notes.addError'));
      }
    } catch (error) {
      console.error('Error submitting note:', error);
      toast.error(t('notes.addError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      const response = await fetch(`/api/notes/${noteToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(notes.filter((n) => n.id !== noteToDelete));
        setNotesCount(Math.max(0, notesCount - 1));
        toast.success(t('notes.deletedSuccess'));
      } else {
        toast.error(t('notes.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(t('notes.deleteError'));
    } finally {
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(notes.map((n) => (n.id === noteId ? data.note : n)));
        setEditingNote(null);
        setEditContent('');
        toast.success(t('notes.updatedSuccess'));
      } else {
        toast.error(t('notes.updateError'));
      }
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(t('notes.updateError'));
    }
  };

  const getAuthorName = (author: Author) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    }
    return author.name || author.email.split('@')[0];
  };

  const getEvaluationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      DISC: t('notes.type.disc'),
      DRIVING_FORCES: t('notes.type.drivingForces'),
      EQ: t('notes.type.eq'),
      DNA: t('notes.type.dna'),
      ACUMEN: t('notes.type.acumen'),
      VALUES: t('notes.type.values'),
      STRESS: t('notes.type.stress'),
    };
    return labels[type] || type;
  };

  const getAuthorInitials = (author: Author) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName[0]}${author.lastName[0]}`.toUpperCase();
    }
    if (author.name) {
      const parts = author.name.split(' ');
      return parts.length > 1 
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : author.name.substring(0, 2).toUpperCase();
    }
    return author.email.substring(0, 2).toUpperCase();
  };

  const isOwnNote = (note: Note) => session?.user?.email === note.author.email;

  if (!session?.user) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="bg-white border-amber-200 hover:bg-amber-50 hover:border-amber-300 flex items-center gap-1.5 transition-all duration-200"
          >
            <StickyNote className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700">{t('notes.button')}</span>
            {notesCount > 0 && (
              <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700 text-xs px-1.5">
                {notesCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-xl sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] p-0 overflow-hidden flex flex-col gap-0 rounded-2xl">
          {/* Hidden accessible title and description */}
          <DialogHeader className="sr-only">
            <DialogTitle>{t('notes.title')} - {recipientName || recipientEmail}</DialogTitle>
            <DialogDescription>{t('notes.evaluation')}: {getEvaluationTypeLabel(evaluationType)}</DialogDescription>
          </DialogHeader>
          
          {/* Visual header con gradiente */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <StickyNote className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg sm:text-xl font-bold text-white truncate" aria-hidden="true">
                  {recipientName || recipientEmail}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                    {getEvaluationTypeLabel(evaluationType)}
                  </span>
                  {notesCount > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/30 text-white">
                      {notesCount} {notesCount === 1 ? t('notes.note') : t('notes.notesPlural')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Formulario para agregar nota */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-amber-50/50 to-white border-b">
            <div className="relative">
              <Textarea
                placeholder={t('notes.writeNote')}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={2}
                className="resize-none pr-24 sm:pr-28 border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl bg-white text-sm sm:text-base"
              />
              <Button
                onClick={handleSubmitNote}
                disabled={!newNote.trim() || submitting}
                size="sm"
                className="absolute right-2 bottom-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg shadow-lg shadow-amber-500/25 transition-all duration-200 px-3 sm:px-4"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">{t('notes.send')}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Lista de notas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/50">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
                </div>
                <p className="text-sm text-slate-500">{t('notes.loading')}</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
                  <StickyNote className="h-8 w-8 sm:h-10 sm:w-10 text-amber-500" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-1">{t('notes.noNotesYet')}</h3>
                <p className="text-sm text-slate-500 text-center max-w-xs">
                  {t('notes.addFirstNote')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <div
                    key={note.id}
                    className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-md ${
                      isOwnNote(note) 
                        ? 'border-amber-200 shadow-sm shadow-amber-500/5' 
                        : 'border-slate-200'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Header de la nota */}
                    <div className="flex items-center gap-3 p-3 sm:p-4 border-b border-slate-100">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
                        isOwnNote(note)
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                          : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600'
                      }`}>
                        {getAuthorInitials(note.author)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-slate-800 truncate">
                            {getAuthorName(note.author)}
                          </span>
                          {isOwnNote(note) && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                              {t('notes.you')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(note.createdAt), "d MMM yyyy, HH:mm", { locale: language === 'es' ? es : enUS })}</span>
                        </div>
                      </div>
                      {isOwnNote(note) && editingNote !== note.id && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingNote(note.id);
                              setEditContent(note.content);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setNoteToDelete(note.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Contenido de la nota */}
                    <div className="p-3 sm:p-4">
                      {editingNote === note.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                            className="resize-none border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl text-sm"
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingNote(null);
                                setEditContent('');
                              }}
                              className="text-slate-600 hover:text-slate-800 rounded-lg"
                            >
                              <X className="h-4 w-4 mr-1" />
                              {t('notes.cancel')}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateNote(note.id)}
                              disabled={!editContent.trim()}
                              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              {t('notes.save')}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm sm:text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {note.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="w-[90vw] max-w-md rounded-2xl">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center">{t('notes.deleteThisNote')}</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {t('notes.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto rounded-xl">{t('notes.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 rounded-xl"
            >
              {t('notes.yesDelete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
