import {
  PhoneOutlined,
  InstagramOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { FaTelegram, FaVk } from "react-icons/fa";
import type { ContactLink, ContactLinkType } from "../../../../types";
import styles from "./ContactLinksBlock.module.css";

const LINK_TYPE_CONFIG: Record<
  ContactLinkType,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    getUrl?: (value: string) => string;
  }
> = {
  phone: {
    label: "Phone",
    icon: <PhoneOutlined />,
    color: "#52c41a",
    getUrl: (value) => `tel:${value.replace(/[^\d+]/g, "")}`,
  },
  telegram: {
    label: "Telegram",
    icon: <FaTelegram />,
    color: "#0088cc",
    getUrl: (value) => `https://t.me/${value.replace("@", "")}`,
  },
  instagram: {
    label: "Instagram",
    icon: <InstagramOutlined />,
    color: "#E4405F",
    getUrl: (value) => `https://instagram.com/${value.replace("@", "")}`,
  },
  vk: {
    label: "VK",
    icon: <FaVk />,
    color: "#4680C2",
    getUrl: (value) =>
      value.includes("vk.com")
        ? `https://${value.replace("https://", "")}`
        : `https://vk.com/${value}`,
  },
  other: {
    label: "Other",
    icon: <LinkOutlined />,
    color: "#666",
  },
};

interface ContactLinksBlockProps {
  links?: ContactLink[];
}

export const ContactLinksBlock = ({ links }: ContactLinksBlockProps) => {
  return (
    <div className={styles.linksGrid}>
      {links?.map((link) => {
        const config = LINK_TYPE_CONFIG[link.type] || LINK_TYPE_CONFIG.other;
        const url = config.getUrl?.(link.value);
        const displayLabel =
          link.type === "other" && link.label ? link.label : config.label;

        return (
          <a
            key={link.id}
            href={url}
            target={link.type !== "phone" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={styles.linkItem}
            style={{ "--link-color": config.color } as React.CSSProperties}
          >
            <span className={styles.linkIcon}>{config.icon}</span>
            <span className={styles.linkContent}>
              <span className={styles.linkLabel}>{displayLabel}</span>
              <span className={styles.linkValue}>{link.value}</span>
            </span>
          </a>
        );
      })}
    </div>
  );
};
