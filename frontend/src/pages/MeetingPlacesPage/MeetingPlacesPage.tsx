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
  useGetMeetingPlacesQuery,
  useCreateMeetingPlaceMutation,
  useUpdateMeetingPlaceMutation,
  useDeleteMeetingPlaceMutation,
} from '../../store';
import type { MeetingPlace } from '../../types';
import styles from './MeetingPlacesPage.module.css';

const { Title } = Typography;

export const MeetingPlacesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const { data, isLoading } = useGetMeetingPlacesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createMeetingPlace, { isLoading: isCreating }] = useCreateMeetingPlaceMutation();
  const [updateMeetingPlace, { isLoading: isUpdating }] = useUpdateMeetingPlaceMutation();
  const [deleteMeetingPlace] = useDeleteMeetingPlaceMutation();

  const meetingPlaces = data?.meetingPlaces ?? [];

  const handleOpenModal = () => {
    setNewPlaceName('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewPlaceName('');
  };

  const handleCreatePlace = async () => {
    if (!newPlaceName.trim()) {
      message.error('Please enter a place name');
      return;
    }

    try {
      await createMeetingPlace({ name: newPlaceName.trim() }).unwrap();
      message.success('Meeting place created');
      handleCloseModal();
    } catch (err) {
      const error = err as { data?: { error?: string } };
      message.error(error.data?.error || 'Failed to create meeting place');
    }
  };

  const handleStartEdit = (place: MeetingPlace) => {
    setEditingId(place.id);
    setEditingName(place.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim()) {
      message.error('Please enter a place name');
      return;
    }

    try {
      await updateMeetingPlace({ id: editingId, name: editingName.trim() }).unwrap();
      message.success('Meeting place updated');
      handleCancelEdit();
    } catch (err) {
      const error = err as { data?: { error?: string } };
      message.error(error.data?.error || 'Failed to update meeting place');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMeetingPlace(id).unwrap();
      message.success('Meeting place deleted');
    } catch (err) {
      const error = err as { data?: { error?: string } };
      message.error(error.data?.error || 'Failed to delete meeting place');
    }
  };

  const columns: ColumnsType<MeetingPlace> = [
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
              title="Delete meeting place"
              description="Are you sure you want to delete this meeting place?"
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
        <Title level={2}>Meeting Places</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
          Add Place
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={meetingPlaces}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        className={styles.table}
      />

      <Modal
        title="Add New Meeting Place"
        open={isModalOpen}
        onOk={handleCreatePlace}
        onCancel={handleCloseModal}
        confirmLoading={isCreating}
        okText="Create"
      >
        <Input
          placeholder="Enter place name"
          value={newPlaceName}
          onChange={(e) => setNewPlaceName(e.target.value)}
          onPressEnter={handleCreatePlace}
          autoFocus
        />
      </Modal>
    </div>
  );
};
