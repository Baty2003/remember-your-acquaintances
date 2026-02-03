import { Typography, Divider } from "antd";
import styles from "./MetadataBlock.module.css";

const { Text } = Typography;

interface MetadataBlockProps {
  createdAt: string;
  updatedAt: string;
}

export const MetadataBlock = ({ createdAt, updatedAt }: MetadataBlockProps) => {
  return (
    <>
      <Divider />
      <div className={styles.metadata}>
        <Text type="secondary" className={styles.metaText}>
          Created: {new Date(createdAt).toLocaleDateString("ru-RU")}
        </Text>
        <Text type="secondary" className={styles.metaText}>
          Updated: {new Date(updatedAt).toLocaleDateString("ru-RU")}
        </Text>
      </div>
    </>
  );
};
