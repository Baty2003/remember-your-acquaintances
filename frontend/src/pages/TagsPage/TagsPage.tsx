import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Input,
  Space,
  Typography,
  Popconfirm,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from '../../store';
import type { Tag } from '../../types';
import styles from './TagsPage.module.css';

const { Title } = Typography;

export const TagsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const { data, isLoading } = useGetTagsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createTag, { isLoading: isCreating }] = useCreateTagMutation();
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const tags = data?.tags ?? [];

  const handleOpenModal = () => {
    setNewTagName('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTagName('');
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      message.error('Please enter a tag name');
      return;
    }

    try {
      await createTag({ name: newTagName.trim() }).unwrap();
      message.success('Tag created');
      handleCloseModal();
    } catch (err) {
      const error = err as { data?: { error?: string } };
      message.error(error.data?.error || 'Failed to create tag');
    }
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim()) {
      message.error('Please enter a tag name');
      return;
    }

    try {
      await updateTag({ id: editingId, name: editingName.trim() }).unwrap();
      message.success('Tag updated');
      handleCancelEdit();
    } catch (err) {
      const error = err as { data?: { error?: string } };
      message.error(error.data?.error || 'Failed to update tag');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTag(id).unwrap();
      message.success('Tag deleted');
    } catch (err) {
      const error = err as { data?: { error?: string } };
      message.error(error.data?.error || 'Failed to delete tag');
    }
  };

  const columns: ColumnsType<Tag> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        if (editingId === record.id) {
          return (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onPressEnter={handleSaveEdit}
              autoFocus
              className={styles.editInput}
            />
          );
        }
        return record.name;
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => {
        if (editingId === record.id) {
          return (
            <Space>
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={handleSaveEdit}
                loading={isUpdating}
                className={styles.saveButton}
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={handleCancelEdit}
                className={styles.cancelButton}
              />
            </Space>
          );
        }
        return (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleStartEdit(record)}
            />
            <Popconfirm
              title="Delete tag"
              description="Are you sure you want to delete this tag?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2}>Tags</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
          Add Tag
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        className={styles.table}
      />

      <Modal
        title="Add New Tag"
        open={isModalOpen}
        onOk={handleCreateTag}
        onCancel={handleCloseModal}
        confirmLoading={isCreating}
        okText="Create"
      >
        <Input
          placeholder="Enter tag name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onPressEnter={handleCreateTag}
          autoFocus
        />
      </Modal>
    </div>
  );
};
