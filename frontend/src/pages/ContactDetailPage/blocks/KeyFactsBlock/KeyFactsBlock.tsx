import { Typography } from 'antd';
import sharedStyles from '../shared.module.css';
import styles from './KeyFactsBlock.module.css';

const { Text } = Typography;

interface KeyFactsBlockProps {
  occupation?: string;
  occupationDetails?: string;
}

export const KeyFactsBlock = ({ occupation, occupationDetails }: KeyFactsBlockProps) => {
  return (
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
  );
};
