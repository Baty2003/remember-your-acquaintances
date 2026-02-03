import { Typography } from 'antd';
import sharedStyles from '../shared.module.css';
import styles from './AdditionalInformationBlock.module.css';

const { Text } = Typography;

interface AdditionalInformationBlockProps {
  customFields?: Record<string, string>;
}

export const AdditionalInformationBlock = ({ customFields }: AdditionalInformationBlockProps) => {
  if (!customFields || Object.keys(customFields).length === 0) {
    return null;
  }

  return (
    <div className={styles.grid}>
      {Object.entries(customFields).map(([name, value]) =>
        name.trim() && value.trim() ? (
          <div key={name} className={styles.item}>
            <Text type="secondary" className={sharedStyles.factLabel}>
              {name}
            </Text>
            <Text className={sharedStyles.factValue}>{value}</Text>
          </div>
        ) : null
      )}
    </div>
  );
};
