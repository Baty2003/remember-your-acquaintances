import { Typography, Divider } from 'antd';
import type { MeetingPlace } from '../../../../types';
import sharedStyles from '../shared.module.css';
import styles from './MeetingBlock.module.css';

const { Title, Text, Paragraph } = Typography;

interface MeetingBlockProps {
  meetingPlace?: MeetingPlace | null;
  metAt?: string;
  howMet?: string;
}

export const MeetingBlock = ({ meetingPlace, metAt, howMet }: MeetingBlockProps) => {
  if (!meetingPlace && !metAt && !howMet) return null;

  return (
    <>
      <Divider />
      <div className={sharedStyles.section}>
        <Title level={5} className={sharedStyles.sectionTitle}>Meeting</Title>
        <div className={styles.meetingInfo}>
          {(meetingPlace || metAt) && (
            <div className={styles.meetingRow}>
              {meetingPlace && (
                <div className={styles.meetingItem}>
                  <Text type="secondary" className={sharedStyles.factLabel}>Where</Text>
                  <Text className={sharedStyles.factValue}>{meetingPlace.name}</Text>
                </div>
              )}
              {metAt && (
                <div className={styles.meetingItem}>
                  <Text type="secondary" className={sharedStyles.factLabel}>When</Text>
                  <Text className={sharedStyles.factValue}>
                    {new Date(metAt).toLocaleDateString('ru-RU')}
                  </Text>
                </div>
              )}
            </div>
          )}
          {howMet && (
            <div className={styles.howMet}>
              <Text type="secondary" className={sharedStyles.factLabel}>How we met</Text>
              <Paragraph className={styles.howMetText}>{howMet}</Paragraph>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
