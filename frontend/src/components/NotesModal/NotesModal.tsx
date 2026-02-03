import { useState } from 'react';
import {
  Modal,
  List,
  Button,
  Form,
  Input,
  Typography,
  Empty,
  Divider,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Note } from '../../types';
import { useCreateNoteMutation } from '../../store';
import { NoteDetailsModal } from './NoteDetailsModal';
import styles from './NotesModal.module.css';

const { TextArea } = Input;
const { Text } = Typography;

const CONTENT_PREVIEW_LENGTH = 50;

interface NotesModalProps {
  open: boolean;
  onClose: () => void;
  contactId: string;
  notes: Note[];
}

const truncateContent = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const NotesModal = ({ open, onClose, contactId, notes }: NotesModalProps) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form] = Form.useForm();

  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();

  const handleCreateNote = async (values: { title: string; description: string }) => {
    try {
      await createNote({
        contactId,
        title: values.title,
        description: values.description || '',
      }).unwrap();
      form.resetFields();
      setShowCreateForm(false);
    } catch {
      // Error handled by baseApi
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateForm(false);
    form.resetFields();
  };

  const handleClose = () => {
    setSelectedNote(null);
    setShowCreateForm(false);
    form.resetFields();
    onClose();
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
    const createdStr = formatMetaTime(note.createdAt);
    const updatedStr = formatMetaTime(note.updatedAt);
    const isSameTime =
      new Date(note.createdAt).getTime() === new Date(note.updatedAt).getTime();
    return isSameTime ? createdStr : `Updated: ${updatedStr}`;
  };

  const handleOpenCreate = () => {
    setShowCreateForm(true);
    setSelectedNote(null);
  };

  return (
    <Modal
      title={
        <div className={styles.header}>
          <span className={styles.headerTitle}>Notes</span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Create note
          </Button>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={640}
      className={styles.modal}
    >
      <Divider className={styles.headerDivider} />

      <Modal
        title="Create note"
        open={showCreateForm}
        onCancel={handleCloseCreateModal}
        footer={null}
        width={480}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateNote}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Enter title' }]}
          >
            <Input placeholder="Note title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={5} placeholder="Note content" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isCreating}>
              Save
            </Button>
            <Button onClick={handleCloseCreateModal} className={styles.cancelButton}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className={styles.content}>
        <div className={styles.listSection}>
          {notes.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className={styles.emptyContent}>
                  <div className={styles.emptyTitle}>No notes yet</div>
                  <div className={styles.emptyDescription}>
                    Add the first note to remember important details
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleOpenCreate}
                    className={styles.emptyButton}
                  >
                    Create note
                  </Button>
                </div>
              }
              className={styles.empty}
            />
          ) : (
            <List
              dataSource={notes}
              className={styles.notesList}
              renderItem={(note) => (
                <List.Item className={styles.listItemWrapper}>
                  <div
                    className={`${styles.noteCard} ${selectedNote?.id === note.id ? styles.selected : ''}`}
                    onClick={() => {
                      setSelectedNote(note);
                      setShowCreateForm(false);
                    }}
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
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>

      <NoteDetailsModal
        key={selectedNote?.id}
        open={Boolean(selectedNote)}
        note={
          selectedNote
            ? notes.find((n) => n.id === selectedNote.id) || selectedNote
            : null
        }
        onClose={() => setSelectedNote(null)}
      />
    </Modal>
  );
};
