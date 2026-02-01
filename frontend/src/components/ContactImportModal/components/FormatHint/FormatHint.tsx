import { Typography } from 'antd';
import { JSON_EXAMPLE } from '../../constants';
import styles from './FormatHint.module.css';

const { Text, Paragraph } = Typography;

export const FormatHint = () => {
  return (
    <div className={styles.container}>
      <Text strong>Ожидаемый формат JSON:</Text>
      <Paragraph code className={styles.code}>
        {JSON_EXAMPLE}
      </Paragraph>
      <Text type="secondary" className={styles.hint}>
        Обязательное поле: name. Остальные поля опциональны.
      </Text>
    </div>
  );
};
