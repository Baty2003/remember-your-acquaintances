import { Button, Typography, Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import type { Gender, AgeType, HeightType } from '../../../../types';
import styles from './HeaderBlock.module.css';

const { Title, Text } = Typography;

interface HeaderBlockProps {
  name: string;
  gender?: Gender;
  age?: number;
  ageType?: AgeType;
  height?: number;
  heightType?: HeightType;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const HeaderBlock = ({
  name,
  gender,
  age,
  ageType,
  height,
  heightType,
  onEdit,
  onDelete,
  isDeleting,
}: HeaderBlockProps) => {
  const subtitleParts: string[] = [];
  if (gender) {
    subtitleParts.push(gender === 'male' ? 'Male' : 'Female');
  }
  if (age) {
    subtitleParts.push(`${age}${ageType === 'approximate' ? ' (~)' : ''}`);
  }
  if (height) {
    subtitleParts.push(`${height} cm${heightType === 'approximate' ? ' (~)' : ''}`);
  }

  return (
    <div className={styles.header}>
      <div className={styles.avatar}>
        {gender === 'male' ? <ManOutlined /> : gender === 'female' ? <WomanOutlined /> : <UserOutlined />}
      </div>
      <div className={styles.headerInfo}>
        <Title level={2} className={styles.name}>
          {name}
        </Title>
        {subtitleParts.length > 0 && (
          <Text className={styles.subtitle}>
            {subtitleParts.join(' • ')}
          </Text>
        )}
      </div>
      <div className={styles.actions}>
        <Button icon={<EditOutlined />} onClick={onEdit}>
          Edit
        </Button>
        <Popconfirm
          title="Delete contact"
          description="Are you sure you want to delete this contact?"
          onConfirm={onDelete}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true, loading: isDeleting }}
        >
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};
