import { Typography, Tag, Flex } from "antd";
import type { ContactImportItem } from "../../../../types";
import styles from "./ContactDetails.module.css";

const { Text } = Typography;

interface ContactDetailsProps {
  contact: ContactImportItem;
}

export const ContactDetails = ({ contact }: ContactDetailsProps) => {
  const fields: { label: string; value: string | undefined }[] = [
    {
      label: "Пол",
      value:
        contact.gender === "male"
          ? "Мужской"
          : contact.gender === "female"
            ? "Женский"
            : undefined,
    },
    {
      label: "Возраст",
      value: contact.age
        ? `${contact.age}${contact.ageType === "approximate" ? " (~)" : ""}`
        : undefined,
    },
    {
      label: "Рост",
      value: contact.height
        ? `${contact.height} см${contact.heightType === "approximate" ? " (~)" : ""}`
        : undefined,
    },
    { label: "Профессия", value: contact.occupation },
    { label: "Детали профессии", value: contact.occupationDetails },
    { label: "Как познакомились", value: contact.howMet },
    { label: "Подробности", value: contact.details },
    { label: "Дата встречи", value: contact.metAt },
    { label: "Место встречи", value: contact.meetingPlace },
  ];

  const filledFields = fields.filter((f) => f.value);

  return (
    <div className={styles.container}>
      {filledFields.length > 0 ? (
        <Flex vertical gap={4} style={{ width: "100%" }}>
          {filledFields.map((field) => (
            <div key={field.label}>
              <Text type="secondary" className={styles.label}>
                {field.label}:
              </Text>{" "}
              <Text className={styles.value}>{field.value}</Text>
            </div>
          ))}
        </Flex>
      ) : null}

      {contact.tags && contact.tags.length > 0 && (
        <div className={styles.section}>
          <Text type="secondary" className={styles.label}>
            Теги:
          </Text>
          <div className={styles.tagsContainer}>
            {contact.tags.map((tag) => (
              <Tag key={tag} color="blue" className={styles.tag}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {contact.links && contact.links.length > 0 && (
        <div className={styles.section}>
          <Text type="secondary" className={styles.label}>
            Ссылки:
          </Text>
          <Flex vertical gap={2} style={{ width: "100%", marginTop: 4 }}>
            {contact.links.map((link, idx) => (
              <Text key={idx} className={styles.value}>
                {link.type}: {link.value}
              </Text>
            ))}
          </Flex>
        </div>
      )}

      {filledFields.length === 0 &&
        !contact.tags?.length &&
        !contact.links?.length && <Text type="secondary">Только имя</Text>}
    </div>
  );
};
