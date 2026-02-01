import { useEffect, useState } from 'react';
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
} from 'antd';
import { PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchContacts } from '../../store';
import type { Contact } from '../../types';
import styles from './ContactsListPage.module.css';

const { Text } = Typography;
const { Search } = Input;

export const ContactsListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const { contacts, isLoading, total } = useAppSelector((state) => state.contacts);

  useEffect(() => {
    dispatch(fetchContacts(undefined));
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    dispatch(fetchContacts({ search: value || undefined }));
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddContact}>
          Add Contact
        </Button>
      </div>

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
                    title={contact.name}
                    description={
                      <div className={styles.contactInfo}>
                        {contact.occupation && (
                          <Text type="secondary">{contact.occupation}</Text>
                        )}
                        {contact.whereMet && (
                          <Text type="secondary" className={styles.whereMet}>
                            Met at: {contact.whereMet}
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
