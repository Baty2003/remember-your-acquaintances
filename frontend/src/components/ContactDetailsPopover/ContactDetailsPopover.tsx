import { Typography, Tag, Flex } from "antd";
import dayjs from "dayjs";
import type { Contact } from "../../types";
import styles from "./ContactDetailsPopover.module.css";

const { Text } = Typography;

interface ContactDetailsPopoverProps {
  contact: Contact;
}

export const ContactDetailsPopover = ({
  contact,
}: ContactDetailsPopoverProps) => {
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
    { label: "Как познакомились", value: contact.howMet },
    { label: "Подробности", value: contact.details },
    {
      label: "Дата встречи",
      value: contact.metAt
        ? dayjs(contact.metAt).format("DD.MM.YYYY")
        : undefined,
    },
    { label: "Место встречи", value: contact.meetingPlace?.name },
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
              <Tag key={tag.id} color="blue" className={styles.tag}>
                {tag.name}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {contact.links && contact.links.length > 0 && (
        <div className={styles.section}>
          <Text type="secondary" className={styles.label}>
            Контакты:
          </Text>
          <Flex vertical gap={2} style={{ width: "100%", marginTop: 4 }}>
            {contact.links.map((link) => (
              <Text key={link.id} className={styles.value}>
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
