import { Typography } from "antd";
import styles from "./DescriptionBlock.module.css";

const { Paragraph } = Typography;

interface DescriptionBlockProps {
  details?: string;
}

export const DescriptionBlock = ({ details }: DescriptionBlockProps) => {
  return <Paragraph className={styles.description}>{details}</Paragraph>;
};
