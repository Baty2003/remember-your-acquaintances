import { useState } from 'react';
import { Select, Input, Button, Space, Divider, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useGetTagsQuery, useCreateTagMutation } from '../../store';
import styles from './TagSelect.module.css';

interface TagSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
}

export const TagSelect = ({
  value,
  onChange,
  placeholder = 'Select tags',
}: TagSelectProps) => {
  const [newTagName, setNewTagName] = useState('');

  const { data, isLoading } = useGetTagsQuery();
  const [createTag] = useCreateTagMutation();

  const tags = data?.tags ?? [];

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      await createTag({ name: newTagName.trim() }).unwrap();
      setNewTagName('');
      message.success('Tag created');
    } catch {
      message.error('Failed to create tag');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Select
      mode="multiple"
      placeholder={placeholder}
      loading={isLoading}
      value={value}
      onChange={onChange}
      showSearch={{
        filterOption: (input, option) =>
          (option?.label as string)?.toLowerCase().includes(input.toLowerCase()),
      }}
      options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
      popupRender={(menu) => (
        <>
          {menu}
          <Divider className={styles.divider} />
          <Space className={styles.addContainer}>
            <Input
              placeholder="New tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={handleAddTag}>
              Add
            </Button>
          </Space>
        </>
      )}
    />
  );
};
