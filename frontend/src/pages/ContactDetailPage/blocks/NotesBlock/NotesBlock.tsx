import { Typography, Card } from 'antd';
import type { Note } from '../../../../types';
import styles from './NotesBlock.module.css';

const { Text } = Typography;

interface NotesBlockProps {
  notes?: Note[];
}

export const NotesBlock = ({ notes }: NotesBlockProps) => {
  return (
    <div className={styles.notesContainer}>
      {notes?.map((note) => (
        <Card key={note.id} size="small" className={styles.noteCard}>
          <Text strong>{note.title}</Text>
          <p>{note.description}</p>
          <Text type="secondary" className={styles.noteDate}>
            {new Date(note.createdAt).toLocaleDateString()}
          </Text>
        </Card>
      ))}
    </div>
  );
};
