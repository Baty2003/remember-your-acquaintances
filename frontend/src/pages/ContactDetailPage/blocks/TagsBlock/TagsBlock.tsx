import { Typography, Divider, Tag } from 'antd';
import type { Tag as TagType } from '../../../../types';
import sharedStyles from '../shared.module.css';
import styles from './TagsBlock.module.css';

const { Title } = Typography;

interface TagsBlockProps {
  tags?: TagType[];
}

export const TagsBlock = ({ tags }: TagsBlockProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <>
      <Divider />
      <div className={sharedStyles.section}>
        <Title level={5} className={sharedStyles.sectionTitle}>Tags</Title>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <Tag key={tag.id} color="blue">
              {tag.name}
            </Tag>
          ))}
        </div>
      </div>
    </>
  );
};
