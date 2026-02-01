import { Input, Button } from 'antd';
import styles from './TextInputTab.module.css';

const { TextArea } = Input;

interface TextInputTabProps {
  value: string;
  onChange: (value: string) => void;
  onParse: () => void;
}

export const TextInputTab = ({ value, onChange, onParse }: TextInputTabProps) => {
  return (
    <div className={styles.container}>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='[{"name": "Имя контакта", ...}]'
        rows={8}
        className={styles.textArea}
      />
      <Button
        type="primary"
        onClick={onParse}
        disabled={!value.trim()}
        className={styles.parseButton}
      >
        Разобрать JSON
      </Button>
    </div>
  );
};
