import { Typography } from "antd";
import type { MeetingPlace } from "../../../../types";
import { useLocale } from "../../../../contexts";
import sharedStyles from "../shared.module.css";
import styles from "./MeetingBlock.module.css";

const { Text, Paragraph } = Typography;

interface MeetingBlockProps {
  meetingPlace?: MeetingPlace | null;
  metAt?: string;
  howMet?: string;
}

export const MeetingBlock = ({
  meetingPlace,
  metAt,
  howMet,
}: MeetingBlockProps) => {
  const { t, locale } = useLocale();
  const dateLocale = locale === "ru" ? "ru-RU" : "en-GB";
  return (
    <div className={styles.meetingInfo}>
      {(meetingPlace || metAt) && (
        <div className={styles.meetingRow}>
          {meetingPlace && (
            <div className={styles.meetingItem}>
              <Text type="secondary" className={sharedStyles.factLabel}>
                {t("where")}
              </Text>
              <Text className={sharedStyles.factValue}>
                {meetingPlace.name}
              </Text>
            </div>
          )}
          {metAt && (
            <div className={styles.meetingItem}>
              <Text type="secondary" className={sharedStyles.factLabel}>
                {t("when")}
              </Text>
              <Text className={sharedStyles.factValue}>
                {new Date(metAt).toLocaleDateString(dateLocale)}
              </Text>
            </div>
          )}
        </div>
      )}
      {howMet && (
        <div className={styles.howMet}>
          <Text type="secondary" className={sharedStyles.factLabel}>
            {t("howWeMet")}
          </Text>
          <Paragraph className={styles.howMetText}>{howMet}</Paragraph>
        </div>
      )}
    </div>
  );
};
