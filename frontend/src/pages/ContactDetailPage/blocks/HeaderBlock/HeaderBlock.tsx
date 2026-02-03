import { Button, Typography, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  UserOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import type { Gender, AgeType, HeightType } from "../../../../types";
import type { TranslationKey } from "../../../../i18n/translations";
import styles from "./HeaderBlock.module.css";

const { Title, Text } = Typography;

interface HeaderBlockProps {
  name: string;
  gender?: Gender;
  age?: number;
  ageType?: AgeType;
  birthDate?: string;
  height?: number;
  heightType?: HeightType;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  onViewNotes?: () => void;
  t: (key: TranslationKey) => string;
}

export const HeaderBlock = ({
  name,
  gender,
  age,
  ageType,
  birthDate,
  height,
  heightType,
  onEdit,
  onDelete,
  isDeleting,
  onViewNotes,
  t,
}: HeaderBlockProps) => {
  const subtitleParts: string[] = [];
  if (gender) {
    subtitleParts.push(gender === "male" ? t("male") : t("female"));
  }
  if (age) {
    subtitleParts.push(`${age}${ageType === "approximate" ? " (~)" : ""}`);
  }
  if (birthDate) {
    subtitleParts.push(new Date(birthDate).toLocaleDateString("ru-RU"));
  }
  if (height) {
    subtitleParts.push(
      `${height} cm${heightType === "approximate" ? " (~)" : ""}`,
    );
  }

  return (
    <div className={styles.header}>
      <div className={styles.mainBlock}>
        <div className={styles.avatar}>
          {gender === "male" ? (
            <ManOutlined />
          ) : gender === "female" ? (
            <WomanOutlined />
          ) : (
            <UserOutlined />
          )}
        </div>
        <div className={styles.headerInfo}>
          <Title level={2} className={styles.name}>
            {name}
          </Title>
          {subtitleParts.length > 0 && (
            <Text className={styles.subtitle}>{subtitleParts.join(" • ")}</Text>
          )}
        </div>
        {onViewNotes && (
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={onViewNotes}
          >
            {t("viewNotes")}
          </Button>
        )}
      </div>
      <div className={styles.actions}>
        <Button icon={<EditOutlined />} onClick={onEdit}>
          {t("edit")}
        </Button>
        <Popconfirm
          title={t("deleteContact")}
          description={t("deleteContactConfirm")}
          onConfirm={onDelete}
          okText={t("yes")}
          cancelText={t("no")}
          okButtonProps={{ danger: true, loading: isDeleting }}
        >
          <Button danger icon={<DeleteOutlined />}>
            {t("delete")}
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};
