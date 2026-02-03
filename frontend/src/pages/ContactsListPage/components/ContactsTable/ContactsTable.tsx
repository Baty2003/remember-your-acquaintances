import { memo, useCallback, useMemo } from "react";
import { Spin, Avatar, Tag, Tooltip, Popover } from "antd";
import {
  UserOutlined,
  ManOutlined,
  WomanOutlined,
  PhoneOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { FaTelegram, FaInstagram, FaVk } from "react-icons/fa";
import VirtualList from "rc-virtual-list";
import dayjs from "dayjs";
import type { Contact, ContactFilters } from "../../../../types";
import { ContactDetailsPopover } from "../../../../components";
import styles from "./ContactsTable.module.css";

// Constants
const ROW_HEIGHT = 48;
const LIST_HEIGHT = 600;

type SortField =
  | "name"
  | "age"
  | "metAt"
  | "gender"
  | "height"
  | "occupation"
  | "meetingPlace";

// Memoized row component
interface TableRowProps {
  contact: Contact;
  onClick: (id: string) => void;
}

const TableRow = memo(({ contact, onClick }: TableRowProps) => {
  // Pre-calculate link types once
  const linkTypes = useMemo(() => {
    if (!contact.links?.length) return null;
    const types = new Set(contact.links.map((l) => l.type));
    return {
      phone: types.has("phone"),
      telegram: types.has("telegram"),
      instagram: types.has("instagram"),
      vk: types.has("vk"),
    };
  }, [contact.links]);

  // Memoize tags string for tooltip
  const tagsTooltip = useMemo(() => {
    return contact.tags?.map((t) => t.name).join(", ") || "";
  }, [contact.tags]);

  return (
    <div className={styles.row} onClick={() => onClick(contact.id)}>
      <div className={styles.cellName}>
        <Avatar
          size={28}
          icon={<UserOutlined />}
          src={contact.photo}
          className={styles.avatar}
        />
        <Tooltip title={contact.name} mouseEnterDelay={0.5}>
          <span className={styles.name}>{contact.name}</span>
        </Tooltip>
        <Popover
          content={<ContactDetailsPopover contact={contact} />}
          title={contact.name}
          trigger="hover"
          placement="right"
        >
          <InfoCircleOutlined
            className={styles.infoIcon}
            onClick={(e) => e.stopPropagation()}
          />
        </Popover>
      </div>
      <div className={styles.cellSmall}>
        {contact.gender === "male" ? (
          <ManOutlined className={styles.genderMale} />
        ) : contact.gender === "female" ? (
          <WomanOutlined className={styles.genderFemale} />
        ) : (
          "-"
        )}
      </div>
      <div className={styles.cellSmall}>
        {contact.age
          ? `${contact.ageType === "approximate" ? "~" : ""}${contact.age}`
          : "-"}
      </div>
      <div className={styles.cellSmall}>
        {contact.height
          ? `${contact.heightType === "approximate" ? "~" : ""}${contact.height}`
          : "-"}
      </div>
      <div className={styles.cellMedium}>
        {contact.occupation ? (
          <Tooltip title={contact.occupation} mouseEnterDelay={0.5}>
            <span className={styles.ellipsis}>{contact.occupation}</span>
          </Tooltip>
        ) : (
          "-"
        )}
      </div>
      <div className={styles.cellMedium}>
        {contact.meetingPlace?.name ? (
          <Tooltip title={contact.meetingPlace.name} mouseEnterDelay={0.5}>
            <span className={styles.ellipsis}>{contact.meetingPlace.name}</span>
          </Tooltip>
        ) : (
          "-"
        )}
      </div>
      <div className={styles.cellSmall}>
        {contact.metAt ? dayjs(contact.metAt).format("DD.MM.YY") : "-"}
      </div>
      <div className={styles.cellTags}>
        {contact.tags?.length ? (
          <Tooltip title={tagsTooltip} mouseEnterDelay={0.5}>
            <div className={styles.tagsWrapper}>
              {contact.tags.slice(0, 2).map((tag) => (
                <Tag key={tag.id} color="blue" className={styles.tag}>
                  {tag.name}
                </Tag>
              ))}
              {contact.tags.length > 2 && (
                <span className={styles.moreText}>
                  +{contact.tags.length - 2}
                </span>
              )}
            </div>
          </Tooltip>
        ) : (
          "-"
        )}
      </div>
      <div className={styles.cellLinks}>
        {linkTypes ? (
          <>
            {linkTypes.phone && <PhoneOutlined className={styles.linkIcon} />}
            {linkTypes.telegram && <FaTelegram className={styles.linkIcon} />}
            {linkTypes.instagram && <FaInstagram className={styles.linkIcon} />}
            {linkTypes.vk && <FaVk className={styles.linkIcon} />}
          </>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
});

// Props
interface ContactsTableProps {
  contacts: Contact[];
  filters: ContactFilters;
  onFiltersChange: (filters: ContactFilters) => void;
  onRowClick: (id: string) => void;
  loading?: boolean;
}

// Sort icon components (static, no re-render)
const SortIconEmpty = () => <span className={styles.sortIcon} />;
const SortIconAsc = () => <CaretUpOutlined className={styles.sortIconActive} />;
const SortIconDesc = () => (
  <CaretDownOutlined className={styles.sortIconActive} />
);

export const ContactsTable = memo(
  ({
    contacts,
    filters,
    onFiltersChange,
    onRowClick,
    loading,
  }: ContactsTableProps) => {
    const handleSort = useCallback(
      (field: SortField) => {
        const isSameField = filters.sortBy === field;
        const newOrder = isSameField
          ? filters.sortOrder === "asc"
            ? "desc"
            : filters.sortOrder === "desc"
              ? undefined
              : "asc"
          : "asc";

        onFiltersChange({
          ...filters,
          sortBy: newOrder ? field : undefined,
          sortOrder: newOrder,
        });
      },
      [filters, onFiltersChange],
    );

    // Helper to get sort icon for a field
    const getSortIcon = useCallback(
      (field: SortField) => {
        if (filters.sortBy !== field) return <SortIconEmpty />;
        return filters.sortOrder === "asc" ? <SortIconAsc /> : <SortIconDesc />;
      },
      [filters.sortBy, filters.sortOrder],
    );

    // Memoized sort icons
    const nameSortIcon = useMemo(() => getSortIcon("name"), [getSortIcon]);
    const genderSortIcon = useMemo(() => getSortIcon("gender"), [getSortIcon]);
    const ageSortIcon = useMemo(() => getSortIcon("age"), [getSortIcon]);
    const heightSortIcon = useMemo(() => getSortIcon("height"), [getSortIcon]);
    const occupationSortIcon = useMemo(
      () => getSortIcon("occupation"),
      [getSortIcon],
    );
    const meetingPlaceSortIcon = useMemo(
      () => getSortIcon("meetingPlace"),
      [getSortIcon],
    );
    const metAtSortIcon = useMemo(() => getSortIcon("metAt"), [getSortIcon]);

    // Memoized click handlers for headers
    const handleSortName = useCallback(() => handleSort("name"), [handleSort]);
    const handleSortGender = useCallback(
      () => handleSort("gender"),
      [handleSort],
    );
    const handleSortAge = useCallback(() => handleSort("age"), [handleSort]);
    const handleSortHeight = useCallback(
      () => handleSort("height"),
      [handleSort],
    );
    const handleSortOccupation = useCallback(
      () => handleSort("occupation"),
      [handleSort],
    );
    const handleSortMeetingPlace = useCallback(
      () => handleSort("meetingPlace"),
      [handleSort],
    );
    const handleSortMetAt = useCallback(
      () => handleSort("metAt"),
      [handleSort],
    );

    if (loading) {
      return (
        <div className={styles.loading}>
          <Spin />
        </div>
      );
    }

    return (
      <div className={styles.tableContainer}>
        {/* Header */}
        <div className={styles.headerRow}>
          <div
            className={`${styles.headerCell} ${styles.sortable}`}
            onClick={handleSortName}
          >
            Имя {nameSortIcon}
          </div>
          <div
            className={`${styles.headerCell} ${styles.sortable}`}
            onClick={handleSortGender}
          >
            Пол {genderSortIcon}
          </div>
          <div
            className={`${styles.headerCell} ${styles.sortable}`}
            onClick={handleSortAge}
          >
            Возраст {ageSortIcon}
          </div>
          <div
            className={`${styles.headerCell} ${styles.sortable}`}
            onClick={handleSortHeight}
          >
            Рост {heightSortIcon}
          </div>
          <div
            className={`${styles.headerCell} ${styles.sortable}`}
            onClick={handleSortOccupation}
          >
            Профессия {occupationSortIcon}
          </div>
          <div
            className={`${styles.headerCell} ${styles.sortable}`}
            onClick={handleSortMeetingPlace}
          >
            Место {meetingPlaceSortIcon}
          </div>
          <div
            className={`${styles.headerCell} ${styles.sortable}`}
            onClick={handleSortMetAt}
          >
            Дата {metAtSortIcon}
          </div>
          <div className={styles.headerCell}>Теги</div>
          <div className={styles.headerCell}>Контакты</div>
        </div>

        {/* Virtual rows */}
        <VirtualList
          data={contacts}
          height={LIST_HEIGHT}
          itemHeight={ROW_HEIGHT}
          itemKey="id"
        >
          {(contact: Contact) => (
            <TableRow key={contact.id} contact={contact} onClick={onRowClick} />
          )}
        </VirtualList>
      </div>
    );
  },
);
