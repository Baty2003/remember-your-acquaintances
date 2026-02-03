import { memo } from 'react';
import { Select, DatePicker, Radio, Checkbox, Space, Button, Collapse } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ContactFilters, Gender, Tag, MeetingPlace } from '../../../../types';
import styles from './ContactsFilters.module.css';

const { RangePicker } = DatePicker;

interface ContactsFiltersProps {
  filters: ContactFilters;
  onChange: (filters: ContactFilters) => void;
  tags: Tag[];
  meetingPlaces: MeetingPlace[];
}

export const ContactsFiltersComponent = memo(({ filters, onChange, tags, meetingPlaces }: ContactsFiltersProps) => {
  const handleGenderChange = (gender: Gender | undefined) => {
    onChange({ ...filters, gender });
  };

  const handleTagsChange = (tagIds: string[]) => {
    onChange({ ...filters, tagIds: tagIds.length ? tagIds : undefined });
  };

  const handleMeetingPlacesChange = (meetingPlaceIds: string[]) => {
    onChange({ ...filters, meetingPlaceIds: meetingPlaceIds.length ? meetingPlaceIds : undefined });
  };

  const handleHasContactChange = (checked: boolean) => {
    onChange({ ...filters, hasContact: checked || undefined });
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    onChange({
      ...filters,
      metAtFrom: dates?.[0]?.format('YYYY-MM-DD') || undefined,
      metAtTo: dates?.[1]?.format('YYYY-MM-DD') || undefined,
    });
  };

  const handleClearFilters = () => {
    onChange({ search: filters.search, sortBy: filters.sortBy, sortOrder: filters.sortOrder });
  };

  const hasActiveFilters = !!(
    filters.gender ||
    filters.tagIds?.length ||
    filters.meetingPlaceIds?.length ||
    filters.hasContact ||
    filters.metAtFrom ||
    filters.metAtTo
  );

  const dateValue: [Dayjs | null, Dayjs | null] | null =
    filters.metAtFrom || filters.metAtTo
      ? [
          filters.metAtFrom ? dayjs(filters.metAtFrom) : null,
          filters.metAtTo ? dayjs(filters.metAtTo) : null,
        ]
      : null;

  const filterContent = (
    <div className={styles.filtersContent}>
      <div className={styles.filterGroup}>
        <label className={styles.label}>Пол</label>
        <Radio.Group
          value={filters.gender}
          onChange={(e) => handleGenderChange(e.target.value || undefined)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value={undefined}>Все</Radio.Button>
          <Radio.Button value="male">М</Radio.Button>
          <Radio.Button value="female">Ж</Radio.Button>
        </Radio.Group>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Место встречи</label>
        <Select
          mode="multiple"
          placeholder="Выберите места"
          value={filters.meetingPlaceIds || []}
          onChange={handleMeetingPlacesChange}
          options={meetingPlaces.map((p) => ({ label: p.name, value: p.id }))}
          className={styles.select}
          allowClear
          maxTagCount={2}
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Теги</label>
        <Select
          mode="multiple"
          placeholder="Выберите теги"
          value={filters.tagIds || []}
          onChange={handleTagsChange}
          options={tags.map((t) => ({ label: t.name, value: t.id }))}
          className={styles.select}
          allowClear
          maxTagCount={2}
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Дата знакомства</label>
        <RangePicker
          value={dateValue}
          onChange={handleDateRangeChange}
          className={styles.datePicker}
          placeholder={['От', 'До']}
          allowEmpty={[true, true]}
        />
      </div>

      <div className={styles.filterGroup}>
        <Checkbox
          checked={filters.hasContact || false}
          onChange={(e) => handleHasContactChange(e.target.checked)}
        >
          Есть контакт (телефон/telegram/instagram)
        </Checkbox>
      </div>

      {hasActiveFilters && (
        <Button
          icon={<ClearOutlined />}
          onClick={handleClearFilters}
          size="small"
          className={styles.clearButton}
        >
          Сбросить фильтры
        </Button>
      )}
    </div>
  );

  return (
    <Collapse
      ghost
      className={styles.collapse}
      items={[
        {
          key: 'filters',
          label: (
            <Space>
              <FilterOutlined />
              Фильтры
              {hasActiveFilters && <span className={styles.badge}>●</span>}
            </Space>
          ),
          children: filterContent,
        },
      ]}
    />
  );
});
