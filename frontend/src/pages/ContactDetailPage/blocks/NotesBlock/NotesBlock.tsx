import { Typography, Divider, Card } from 'antd';
import type { Note } from '../../../../types';
import sharedStyles from '../shared.module.css';
import styles from './NotesBlock.module.css';

const { Title, Text } = Typography;

interface NotesBlockProps {
  notes?: Note[];
}

export const NotesBlock = ({ notes }: NotesBlockProps) => {
  if (!notes || notes.length === 0) return null;

  return (
    <>
      <Divider />
      <div className={sharedStyles.section}>
        <Title level={5} className={sharedStyles.sectionTitle}>Notes</Title>
        {notes.map((note) => (
          <Card key={note.id} size="small" className={styles.noteCard}>
            <Text strong>{note.title}</Text>
            <p>{note.description}</p>
            <Text type="secondary" className={styles.noteDate}>
              {new Date(note.createdAt).toLocaleDateString()}
            </Text>
          </Card>
        ))}
      </div>
    </>
  );
};
