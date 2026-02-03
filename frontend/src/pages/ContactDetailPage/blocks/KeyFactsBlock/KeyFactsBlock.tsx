import { Typography } from "antd";
import { useLocale } from "../../../../contexts";
import sharedStyles from "../shared.module.css";
import styles from "./KeyFactsBlock.module.css";

const { Text } = Typography;

interface KeyFactsBlockProps {
  occupation?: string;
  occupationDetails?: string;
  residence?: string;
  residenceDetails?: string;
}

export const KeyFactsBlock = ({
  occupation,
  occupationDetails,
  residence,
  residenceDetails,
}: KeyFactsBlockProps) => {
  const { t } = useLocale();
  return (
    <div className={styles.factsGrid}>
      {residence && (
        <div className={styles.factItem}>
          <Text type="secondary" className={sharedStyles.factLabel}>
            {t("placeOfResidence")}
          </Text>
          <Text className={sharedStyles.factValue}>{residence}</Text>
        </div>
      )}
      {residenceDetails && (
        <div className={styles.factItem}>
          <Text type="secondary" className={sharedStyles.factLabel}>
            {t("residenceDetails")}
          </Text>
          <Text className={sharedStyles.factValue}>{residenceDetails}</Text>
        </div>
      )}
      {occupation && (
        <div className={styles.factItem}>
          <Text type="secondary" className={sharedStyles.factLabel}>
            {t("occupation")}
          </Text>
          <Text className={sharedStyles.factValue}>{occupation}</Text>
        </div>
      )}
      {occupationDetails && (
        <div className={styles.factItem}>
          <Text type="secondary" className={sharedStyles.factLabel}>
            {t("occupationDetails")}
          </Text>
          <Text className={sharedStyles.factValue}>{occupationDetails}</Text>
        </div>
      )}
    </div>
  );
};
