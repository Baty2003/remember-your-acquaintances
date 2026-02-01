import { useState } from 'react';
import { Select, Input, Button, Space, Divider, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useGetMeetingPlacesQuery, useCreateMeetingPlaceMutation } from '../../store';
import styles from './MeetingPlaceSelect.module.css';

interface MeetingPlaceSelectProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
}

export const MeetingPlaceSelect = ({
  value,
  onChange,
  placeholder = 'Select meeting place',
}: MeetingPlaceSelectProps) => {
  const [newPlaceName, setNewPlaceName] = useState('');

  const { data, isLoading } = useGetMeetingPlacesQuery();
  const [createMeetingPlace] = useCreateMeetingPlaceMutation();

  const meetingPlaces = data?.meetingPlaces ?? [];

  const handleAddPlace = async () => {
    if (!newPlaceName.trim()) return;

    try {
      const newPlace = await createMeetingPlace({ name: newPlaceName.trim() }).unwrap();
      setNewPlaceName('');
      onChange?.(newPlace.id);
      message.success('Meeting place created');
    } catch {
      message.error('Failed to create meeting place');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPlace();
    }
  };

  return (
    <Select
      placeholder={placeholder}
      loading={isLoading}
      value={value || undefined}
      onChange={(val) => onChange?.(val || null)}
      allowClear
      options={meetingPlaces.map((place) => ({ value: place.id, label: place.name }))}
      popupRender={(menu) => (
        <>
          {menu}
          <Divider className={styles.divider} />
          <Space className={styles.addContainer}>
            <Input
              placeholder="New place name"
              value={newPlaceName}
              onChange={(e) => setNewPlaceName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={handleAddPlace}>
              Add
            </Button>
          </Space>
        </>
      )}
    />
  );
};
