import { useState } from 'react';
import {
  Modal,
  Typography,
  Button,
  Space,
  Divider,
  Input,
  Popconfirm,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { Note } from '../../types';
import { useUpdateNoteMutation, useDeleteNoteMutation } from '../../store';
import styles from './NoteDetailsModal.module.css';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

interface NoteDetailsModalProps {
  open: boolean;
  note: Note | null;
  onClose: () => void;
}

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
  if (isSameTime) {
    return createdStr;
  }
  return `Updated: ${updatedStr} · Created: ${createdStr}`;
};

export const NoteDetailsModal = ({ open, note, onClose }: NoteDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

  const handleStartEdit = () => {
    if (!note) return;
    setEditTitle(note.title);
    setEditDescription(note.description || '');
    setIsEditing(true);
  };

  if (!open || !note) return null;

  const handleSave = async () => {
    const title = editTitle.trim();
    if (!title) return;

    try {
      await updateNote({
        contactId: note.contactId,
        noteId: note.id,
        title,
        description: editDescription.trim(),
      }).unwrap();
      setIsEditing(false);
    } catch {
      // Error handled by baseApi
    }
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditDescription(note.description || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteNote({
        contactId: note.contactId,
        noteId: note.id,
      }).unwrap();
      onClose();
    } catch {
      // Error handled by baseApi
    }
  };

  return (
    <Modal
      open
      onCancel={onClose}
      footer={null}
      width={560}
      className={styles.modal}
      closable
    >
      <div className={styles.header}>
        <div className={styles.titleRow}>
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className={styles.titleInput}
              autoFocus
            />
          ) : (
            <Title level={4} className={styles.title}>
              {note.title}
            </Title>
          )}
        </div>
        <Space className={styles.actions}>
          {isEditing ? (
            <>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={handleSave} loading={isUpdating}>
                Save
              </Button>
            </>
          ) : (
            <Popconfirm
              title="Delete note?"
              description="This action cannot be undone."
              onConfirm={handleDelete}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
            >
              <Button type="primary" danger loading={isDeleting}>
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      <Text type="secondary" className={styles.meta}>
        {getMetaDisplay(note)}
      </Text>

      <Divider className={styles.divider} />

      <div className={styles.contentSection}>
        {isEditing ? (
          <TextArea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Content"
            className={styles.contentInput}
            rows={8}
            autoSize={{ minRows: 6, maxRows: 16 }}
          />
        ) : (
          <div className={styles.contentSectionWithEdit}>
            <Paragraph className={styles.content}>
              {note.description || ''}
            </Paragraph>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={handleStartEdit}
              className={styles.contentEditIcon}
              aria-label="Edit content"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
