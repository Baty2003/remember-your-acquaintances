import { Typography, Divider } from 'antd';
import sharedStyles from '../shared.module.css';
import styles from './DescriptionBlock.module.css';

const { Title, Paragraph } = Typography;

interface DescriptionBlockProps {
  details?: string;
}

export const DescriptionBlock = ({ details }: DescriptionBlockProps) => {
  if (!details) return null;

  return (
    <>
      <Divider />
      <div className={sharedStyles.section}>
        <Title level={5} className={sharedStyles.sectionTitle}>Description</Title>
        <Paragraph className={styles.description}>{details}</Paragraph>
      </div>
    </>
  );
};
