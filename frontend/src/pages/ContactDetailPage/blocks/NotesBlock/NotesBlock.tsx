import { useState } from 'react';
import { Typography, Card, Divider } from 'antd';
import type { Note } from '../../../../types';
import { NoteDetailsModal } from '../../../../components';
import styles from './NotesBlock.module.css';

const { Text } = Typography;

const CONTENT_PREVIEW_LENGTH = 150;

interface NotesBlockProps {
  notes?: Note[];
}

const truncateContent = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const formatMetaTime = (dateStr: string) => {
  const d = new Date(dateStr);
  const datePart = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timePart = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${datePart} · ${timePart}`;
};

const getMetaDisplay = (note: Note) => {
  if (!note.updatedAt) {
    return formatMetaTime(note.createdAt);
  }
  const isSameTime =
    new Date(note.createdAt).getTime() === new Date(note.updatedAt).getTime();
  return isSameTime
    ? formatMetaTime(note.createdAt)
    : `Updated: ${formatMetaTime(note.updatedAt)}`;
};

export const NotesBlock = ({ notes }: NotesBlockProps) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <>
      <div className={styles.notesContainer}>
        {notes?.map((note) => (
          <Card
            key={note.id}
            size="small"
            className={styles.noteCard}
            onClick={() => setSelectedNote(note)}
          >
            <Text strong className={styles.noteTitle}>
              {note.title}
            </Text>
            {note.description ? (
              <Text className={styles.noteContent}>
                {truncateContent(note.description, CONTENT_PREVIEW_LENGTH)}
              </Text>
            ) : null}
            <Divider className={styles.noteDivider} />
            <Text type="secondary" className={styles.noteMeta}>
              {getMetaDisplay(note)}
            </Text>
          </Card>
        ))}
      </div>

      <NoteDetailsModal
        key={selectedNote?.id}
        open={Boolean(selectedNote)}
        note={
          selectedNote
            ? notes?.find((n) => n.id === selectedNote.id) || selectedNote
            : null
        }
        onClose={() => setSelectedNote(null)}
      />
    </>
  );
};
