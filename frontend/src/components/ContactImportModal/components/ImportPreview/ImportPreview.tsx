import { Alert, Button, Table } from "antd";
import type { ContactImportItem } from "../../../../types";
import { getImportColumns } from "../../constants";
import styles from "./ImportPreview.module.css";

interface ImportPreviewProps {
  contacts: ContactImportItem[];
  onReset: () => void;
}

export const ImportPreview = ({ contacts, onReset }: ImportPreviewProps) => {
  const columns = getImportColumns();

  return (
    <>
      <Alert
        type="success"
        title={`Найдено ${contacts.length} контакт(ов) для импорта`}
        showIcon
        className={styles.alert}
        action={
          <Button size="small" onClick={onReset}>
            Выбрать другой источник
          </Button>
        }
      />

      <Table
        dataSource={contacts}
        columns={columns}
        rowKey={(record, index) => `${record.name}-${index}`}
        size="small"
        pagination={contacts.length > 10 ? { pageSize: 10 } : false}
        scroll={{ y: 300 }}
        className={styles.table}
      />
    </>
  );
};
