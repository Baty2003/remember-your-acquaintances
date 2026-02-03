import { Typography } from 'antd';
import sharedStyles from '../shared.module.css';
import styles from './KeyFactsBlock.module.css';

const { Text } = Typography;

interface KeyFactsBlockProps {
  occupation?: string;
  occupationDetails?: string;
  residence?: string;
  residenceDetails?: string;
}

export const KeyFactsBlock = ({ occupation, occupationDetails, residence, residenceDetails }: KeyFactsBlockProps) => {
  return (
    <div className={styles.factsGrid}>
      {residence && (
        <div className={styles.factItem}>
          <Text type="secondary" className={sharedStyles.factLabel}>Place of Residence</Text>
          <Text className={sharedStyles.factValue}>{residence}</Text>
        </div>
      )}
      {residenceDetails && (
        <div className={styles.factItem}>
          <Text type="secondary" className={sharedStyles.factLabel}>Residence Details</Text>
          <Text className={sharedStyles.factValue}>{residenceDetails}</Text>
        </div>
      )}
      {occupation && (
        <div className={styles.factItem}>
          <Text type="secondary" className={sharedStyles.factLabel}>Occupation</Text>
          <Text className={sharedStyles.factValue}>{occupation}</Text>
        </div>
      )}
      {occupationDetails && (
        <div className={styles.factItem}>
          <Text type="secondary" className={sharedStyles.factLabel}>Occupation Details</Text>
          <Text className={sharedStyles.factValue}>{occupationDetails}</Text>
        </div>
      )}
    </div>
  );
};
