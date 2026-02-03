import { useState } from "react";
import { Button, Input, Select } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  PhoneOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import { FaTelegram, FaVk } from "react-icons/fa";
import type { ContactLinkInput, ContactLinkType } from "../../types";
import styles from "./ContactLinksInput.module.css";

const LINK_TYPE_CONFIG: Record<
  ContactLinkType,
  {
    label: string;
    icon: React.ReactNode;
    placeholder: string;
    color: string;
  }
> = {
  phone: {
    label: "Phone",
    icon: <PhoneOutlined />,
    placeholder: "+7 (999) 123-45-67",
    color: "#52c41a",
  },
  telegram: {
    label: "Telegram",
    icon: <FaTelegram />,
    placeholder: "@username",
    color: "#0088cc",
  },
  instagram: {
    label: "Instagram",
    icon: <InstagramOutlined />,
    placeholder: "@username",
    color: "#E4405F",
  },
  vk: {
    label: "VK",
    icon: <FaVk />,
    placeholder: "vk.com/username или ID",
    color: "#4680C2",
  },
  other: {
    label: "Other",
    icon: null,
    placeholder: "Enter value",
    color: "#666",
  },
};

interface ContactLinksInputProps {
  value?: ContactLinkInput[];
  onChange?: (value: ContactLinkInput[]) => void;
}

export const ContactLinksInput = ({
  value = [],
  onChange,
}: ContactLinksInputProps) => {
  const [links, setLinks] = useState<ContactLinkInput[]>(value);

  const updateLinks = (newLinks: ContactLinkInput[]) => {
    setLinks(newLinks);
    onChange?.(newLinks);
  };

  const addLink = () => {
    updateLinks([...links, { type: "phone", value: "" }]);
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    updateLinks(newLinks);
  };

  const updateLink = (
    index: number,
    field: keyof ContactLinkInput,
    fieldValue: string,
  ) => {
    const newLinks = links.map((link, i) => {
      if (i === index) {
        return { ...link, [field]: fieldValue };
      }
      return link;
    });
    updateLinks(newLinks);
  };

  // Sync external value changes
  if (
    JSON.stringify(value) !== JSON.stringify(links) &&
    value.length > 0 &&
    links.length === 0
  ) {
    setLinks(value);
  }

  return (
    <div className={styles.container}>
      {links.map((link, index) => {
        const config = LINK_TYPE_CONFIG[link.type];
        return (
          <div key={index} className={styles.linkRow}>
            <Select
              value={link.type}
              onChange={(newType) => updateLink(index, "type", newType)}
              className={styles.typeSelect}
              popupMatchSelectWidth={false}
              options={Object.entries(LINK_TYPE_CONFIG).map(([type, cfg]) => ({
                value: type,
                label: (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      className={styles.selectIcon}
                      style={{ color: cfg.color }}
                    >
                      {cfg.icon}
                    </span>
                    {cfg.label}
                  </span>
                ),
              }))}
            />

            {link.type === "other" && (
              <Input
                value={link.label || ""}
                onChange={(e) => updateLink(index, "label", e.target.value)}
                placeholder="Label"
                className={styles.labelInput}
              />
            )}

            <Input
              value={link.value}
              onChange={(e) => updateLink(index, "value", e.target.value)}
              placeholder={config.placeholder}
              className={styles.valueInput}
              prefix={
                <span
                  className={styles.prefixIcon}
                  style={{ color: config.color }}
                >
                  {config.icon}
                </span>
              }
            />

            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeLink(index)}
              className={styles.deleteButton}
            />
          </div>
        );
      })}

      <Button
        type="dashed"
        onClick={addLink}
        icon={<PlusOutlined />}
        className={styles.addButton}
      >
        Add Contact Link
      </Button>
    </div>
  );
};
