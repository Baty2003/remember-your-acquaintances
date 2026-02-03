import { useState, memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Button,
  Empty,
  Spin,
  Avatar,
  Typography,
  Space,
  Segmented,
  Modal,
  notification,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  ImportOutlined,
  ManOutlined,
  WomanOutlined,
  UnorderedListOutlined,
  TableOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import VirtualList from "rc-virtual-list";
import dayjs from "dayjs";
import {
  useGetContactsQuery,
  useGetTagsQuery,
  useGetMeetingPlacesQuery,
  useDeleteAllContactsMutation,
} from "../../store";
import { useDebounce } from "../../hooks";
import { ContactImportModal } from "../../components";
import { ContactsFilters, ContactsTable } from "./components";
import type { Contact, ContactFilters } from "../../types";
import styles from "./ContactsListPage.module.css";

const ITEM_HEIGHT = 88;
const LIST_HEIGHT = 600;

const { Text } = Typography;
const { Search } = Input;

type ViewMode = "list" | "table";

const getBasicInfo = (contact: Contact): string => {
  const parts: string[] = [];

  if (contact.age) {
    const ageStr =
      contact.ageType === "approximate" ? `~${contact.age}` : `${contact.age}`;
    parts.push(ageStr);
  }

  if (contact.height) {
    const heightStr =
      contact.heightType === "approximate"
        ? `~${contact.height} см`
        : `${contact.height} см`;
    parts.push(heightStr);
  }

  return parts.join(" • ");
};

const getDescriptionText = (contact: Contact): string | null => {
  if (contact.occupation) {
    return contact.occupation;
  }
  if (contact.howMet) {
    return contact.howMet.length > 100
      ? `${contact.howMet.slice(0, 100)}...`
      : contact.howMet;
  }
  if (contact.details) {
    return contact.details.length > 100
      ? `${contact.details.slice(0, 100)}...`
      : contact.details;
  }
  return null;
};

interface ContactItemProps {
  contact: Contact;
  onClick: (id: string) => void;
}

const ContactItem = memo(({ contact, onClick }: ContactItemProps) => {
  const basicInfo = getBasicInfo(contact);
  const descriptionText = getDescriptionText(contact);

  return (
    <div className={styles.listItem} onClick={() => onClick(contact.id)}>
      <div className={styles.listItemContent}>
        <Avatar
          size={48}
          icon={<UserOutlined />}
          src={contact.photo}
          className={styles.avatar}
        />
        <div className={styles.listItemMeta}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{contact.name}</span>
            {contact.gender && (
              <span
                className={
                  contact.gender === "male"
                    ? styles.genderMale
                    : styles.genderFemale
                }
              >
                {contact.gender === "male" ? (
                  <ManOutlined />
                ) : (
                  <WomanOutlined />
                )}
              </span>
            )}
            {basicInfo && (
              <Text type="secondary" className={styles.basicInfo}>
                {basicInfo}
              </Text>
            )}
            {contact.metAt && (
              <Text type="secondary" className={styles.metAt}>
                📅 {dayjs(contact.metAt).format("DD.MM.YY")}
              </Text>
            )}
          </div>
          <div className={styles.contactInfo}>
            {descriptionText && (
              <Text type="secondary" className={styles.descriptionText}>
                {descriptionText}
              </Text>
            )}
            {contact.meetingPlace && (
              <Text type="secondary" className={styles.whereMet}>
                📍 {contact.meetingPlace.name}
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

const STORAGE_KEY_VIEW_MODE = "contacts-view-mode";

export const ContactsListPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VIEW_MODE);
    return saved === "table" ? "table" : "list";
  });
  const [filters, setFilters] = useState<ContactFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  const [deleteAllContacts, { isLoading: isDeleting }] =
    useDeleteAllContactsMutation();

  const queryFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedQuery || undefined,
    }),
    [filters, debouncedQuery],
  );

  const { data, isLoading } = useGetContactsQuery(
    Object.keys(queryFilters).some(
      (k) => queryFilters[k as keyof ContactFilters] !== undefined,
    )
      ? queryFilters
      : undefined,
    { refetchOnMountOrArgChange: true },
  );

  const { data: tagsData } = useGetTagsQuery();
  const { data: meetingPlacesData } = useGetMeetingPlacesQuery();

  const contacts = data?.contacts ?? [];
  const total = data?.total ?? 0;
  const tags = tagsData?.tags ?? [];
  const meetingPlaces = meetingPlacesData?.meetingPlaces ?? [];

  const handleAddContact = useCallback(() => {
    navigate("/contacts/new");
  }, [navigate]);

  const handleViewContact = useCallback(
    (id: string) => {
      navigate(`/contacts/${id}`);
    },
    [navigate],
  );

  const handleFiltersChange = useCallback((newFilters: ContactFilters) => {
    setFilters(newFilters);
  }, []);

  const handleDeleteAll = useCallback(async () => {
    try {
      const result = await deleteAllContacts().unwrap();
      setIsDeleteAllModalOpen(false);
      notification.success({
        message: "Удалено",
        description: `Удалено ${result.deleted} контактов`,
      });
    } catch {
      // Error handled by middleware
    }
  }, [deleteAllContacts]);

  const viewModeOptions = [
    { value: "list", icon: <UnorderedListOutlined /> },
    { value: "table", icon: <TableOutlined /> },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Контакты</h1>
        <Space>
          <Segmented
            options={viewModeOptions}
            value={viewMode}
            onChange={(value) => {
              const mode = value as ViewMode;
              setViewMode(mode);
              localStorage.setItem(STORAGE_KEY_VIEW_MODE, mode);
            }}
          />
          {total > 0 && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setIsDeleteAllModalOpen(true)}
            >
              Удалить все
            </Button>
          )}
          <Button
            icon={<ImportOutlined />}
            onClick={() => setIsImportModalOpen(true)}
          >
            Импорт
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddContact}
          >
            Добавить
          </Button>
        </Space>
      </div>

      <ContactImportModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <Modal
        title="Удалить все контакты?"
        open={isDeleteAllModalOpen}
        onOk={handleDeleteAll}
        onCancel={() => setIsDeleteAllModalOpen(false)}
        okText="Удалить все"
        cancelText="Отмена"
        okButtonProps={{ danger: true, loading: isDeleting }}
      >
        <p>Вы уверены, что хотите удалить все {total} контактов?</p>
        <p>Это действие нельзя отменить.</p>
      </Modal>

      <div className={styles.searchBar}>
        <Search
          placeholder="Поиск по имени, профессии, месту встречи..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />
      </div>

      <ContactsFilters
        filters={filters}
        onChange={handleFiltersChange}
        tags={tags}
        meetingPlaces={meetingPlaces}
      />

      <Card className={styles.listCard}>
        {isLoading ? (
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        ) : contacts.length === 0 ? (
          <Empty
            description={
              debouncedQuery || Object.keys(filters).length > 0
                ? "Контакты не найдены"
                : "Контактов пока нет. Добавьте первый!"
            }
          >
            {!debouncedQuery && Object.keys(filters).length === 0 && (
              <Button type="primary" onClick={handleAddContact}>
                Добавить контакт
              </Button>
            )}
          </Empty>
        ) : (
          <>
            <Text type="secondary" className={styles.count}>
              {total} контакт{total === 1 ? "" : total < 5 ? "а" : "ов"}
            </Text>

            {viewMode === "list" ? (
              <Spin spinning={isLoading}>
                <VirtualList
                  data={contacts}
                  height={LIST_HEIGHT}
                  itemHeight={ITEM_HEIGHT}
                  itemKey="id"
                >
                  {(contact: Contact) => (
                    <ContactItem
                      key={contact.id}
                      contact={contact}
                      onClick={handleViewContact}
                    />
                  )}
                </VirtualList>
              </Spin>
            ) : (
              <ContactsTable
                contacts={contacts}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onRowClick={handleViewContact}
                loading={isLoading}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};
