import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Spin,
  Tag,
  Typography,
  Popconfirm,
  message,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchContactById, deleteContact, clearCurrentContact } from '../../store';
import styles from './ContactDetailPage.module.css';

const { Title, Text } = Typography;

export const ContactDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentContact, isLoading, error } = useAppSelector(
    (state) => state.contacts
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchContactById(id));
    }
    return () => {
      dispatch(clearCurrentContact());
    };
  }, [dispatch, id]);

  const handleBack = () => {
    navigate('/contacts');
  };

  const handleEdit = () => {
    navigate(`/contacts/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await dispatch(deleteContact(id)).unwrap();
      message.success('Contact deleted successfully');
      navigate('/contacts');
    } catch (err) {
      message.error(err as string);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !currentContact) {
    return (
      <div className={styles.container}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className={styles.backButton}
        >
          Back to Contacts
        </Button>
        <Empty description={error || 'Contact not found'} />
      </div>
    );
  }

  const {
    name,
    age,
    ageType,
    height,
    occupation,
    occupationDetails,
    whereMet,
    howMet,
    tags,
    notes,
    createdAt,
    updatedAt,
  } = currentContact;

  return (
    <div className={styles.container}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        className={styles.backButton}
      >
        Back to Contacts
      </Button>

      <Card className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            <UserOutlined />
          </div>
          <div className={styles.headerInfo}>
            <Title level={2} className={styles.name}>
              {name}
            </Title>
            {occupation && <Text type="secondary">{occupation}</Text>}
          </div>
          <div className={styles.actions}>
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              Edit
            </Button>
            <Popconfirm
              title="Delete contact"
              description="Are you sure you want to delete this contact?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </div>
        </div>

        <Descriptions column={1} className={styles.descriptions}>
          {age && (
            <Descriptions.Item label="Age">
              {age} {ageType === 'approximate' && '(approximate)'}
            </Descriptions.Item>
          )}
          {height && (
            <Descriptions.Item label="Height">{height} cm</Descriptions.Item>
          )}
          {occupation && (
            <Descriptions.Item label="Occupation">{occupation}</Descriptions.Item>
          )}
          {occupationDetails && (
            <Descriptions.Item label="Occupation Details">
              {occupationDetails}
            </Descriptions.Item>
          )}
          {whereMet && (
            <Descriptions.Item label="Where Met">{whereMet}</Descriptions.Item>
          )}
          {howMet && <Descriptions.Item label="How Met">{howMet}</Descriptions.Item>}
        </Descriptions>

        {tags && tags.length > 0 && (
          <div className={styles.tagsSection}>
            <Text strong>Tags:</Text>
            <div className={styles.tags}>
              {tags.map((tag) => (
                <Tag key={tag.id} color="blue">
                  {tag.name}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {notes && notes.length > 0 && (
          <div className={styles.notesSection}>
            <Title level={4}>Notes</Title>
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
        )}

        <div className={styles.metadata}>
          <Text type="secondary">
            Created: {new Date(createdAt).toLocaleDateString()}
          </Text>
          <Text type="secondary">
            Updated: {new Date(updatedAt).toLocaleDateString()}
          </Text>
        </div>
      </Card>
    </div>
  );
};
