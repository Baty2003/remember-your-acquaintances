import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  List,
  Input,
  Button,
  Empty,
  Spin,
  Avatar,
  Typography,
  Space,
} from 'antd';
import { PlusOutlined, SearchOutlined, UserOutlined, ImportOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { useGetContactsQuery } from '../../store';
import { ContactImportModal } from '../../components';
import type { Contact } from '../../types';
import styles from './ContactsListPage.module.css';

const { Text } = Typography;
const { Search } = Input;

const getBasicInfo = (contact: Contact): string => {
  const parts: string[] = [];
  
  if (contact.age) {
    const ageStr = contact.ageType === 'approximate' ? `~${contact.age}` : `${contact.age}`;
    parts.push(ageStr);
  }
  
  if (contact.height) {
    const heightStr = contact.heightType === 'approximate' ? `~${contact.height} см` : `${contact.height} см`;
    parts.push(heightStr);
  }
  
  return parts.join(' • ');
};

const getDescriptionText = (contact: Contact): string | null => {
  if (contact.occupation) {
    return contact.occupation;
  }
  if (contact.howMet) {
    return contact.howMet.length > 100 ? `${contact.howMet.slice(0, 100)}...` : contact.howMet;
  }
  if (contact.details) {
    return contact.details.length > 100 ? `${contact.details.slice(0, 100)}...` : contact.details;
  }
  return null;
};

export const ContactsListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { data, isLoading } = useGetContactsQuery(
    searchQuery ? { search: searchQuery } : undefined,
    { refetchOnMountOrArgChange: true }
  );

  const contacts = data?.contacts ?? [];
  const total = data?.total ?? 0;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleAddContact = () => {
    navigate('/contacts/new');
  };

  const handleViewContact = (contact: Contact) => {
    navigate(`/contacts/${contact.id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contacts</h1>
        <Space>
          <Button icon={<ImportOutlined />} onClick={() => setIsImportModalOpen(true)}>
            Import
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddContact}>
            Add Contact
          </Button>
        </Space>
      </div>

      <ContactImportModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <div className={styles.searchBar}>
        <Search
          placeholder="Search contacts..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          allowClear
          enterButton
        />
      </div>

      <Card className={styles.listCard}>
        {isLoading ? (
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        ) : contacts.length === 0 ? (
          <Empty
            description={
              searchQuery
                ? 'No contacts found matching your search'
                : 'No contacts yet. Add your first contact!'
            }
          >
            {!searchQuery && (
              <Button type="primary" onClick={handleAddContact}>
                Add Contact
              </Button>
            )}
          </Empty>
        ) : (
          <>
            <Text type="secondary" className={styles.count}>
              {total} contact{total !== 1 ? 's' : ''}
            </Text>
            <List
              dataSource={contacts}
              renderItem={(contact) => (
                <List.Item
                  className={styles.listItem}
                  onClick={() => handleViewContact(contact)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={48}
                        icon={<UserOutlined />}
                        src={contact.photo}
                        className={styles.avatar}
                      />
                    }
                    title={
                      <span className={styles.nameRow}>
                        <span>{contact.name}</span>
                        {contact.gender && (
                          <span className={styles.genderIcon}>
                            {contact.gender === 'male' ? (
                              <ManOutlined style={{ color: '#1890ff' }} />
                            ) : (
                              <WomanOutlined style={{ color: '#eb2f96' }} />
                            )}
                          </span>
                        )}
                        {getBasicInfo(contact) && (
                          <Text type="secondary" className={styles.basicInfo}>
                            {getBasicInfo(contact)}
                          </Text>
                        )}
                      </span>
                    }
                    description={
                      <div className={styles.contactInfo}>
                        {getDescriptionText(contact) && (
                          <Text type="secondary" className={styles.descriptionText}>
                            {getDescriptionText(contact)}
                          </Text>
                        )}
                        {contact.meetingPlace && (
                          <Text type="secondary" className={styles.whereMet}>
                            📍 {contact.meetingPlace.name}
                          </Text>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Card>
    </div>
  );
};
