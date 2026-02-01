import { Typography, Divider } from 'antd';
import sharedStyles from '../shared.module.css';
import styles from './KeyFactsBlock.module.css';

const { Title, Text } = Typography;

interface KeyFactsBlockProps {
  occupation?: string;
  occupationDetails?: string;
}

export const KeyFactsBlock = ({ occupation, occupationDetails }: KeyFactsBlockProps) => {
  if (!occupation && !occupationDetails) return null;

  return (
    <>
      <Divider />
      <div className={sharedStyles.section}>
        <Title level={5} className={sharedStyles.sectionTitle}>Key Facts</Title>
        <div className={styles.factsGrid}>
          {occupation && (
            <div className={styles.factItem}>
              <Text type="secondary" className={sharedStyles.factLabel}>Occupation</Text>
              <Text className={sharedStyles.factValue}>{occupation}</Text>
            </div>
          )}
          {occupationDetails && (
            <div className={styles.factItem}>
              <Text type="secondary" className={sharedStyles.factLabel}>Details</Text>
              <Text className={sharedStyles.factValue}>{occupationDetails}</Text>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
