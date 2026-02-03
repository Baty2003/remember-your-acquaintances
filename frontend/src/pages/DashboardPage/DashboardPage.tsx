import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Button,
  Space,
} from "antd";
import {
  UserOutlined,
  TagOutlined,
  FileTextOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { useGetStatsQuery } from "../../store";
import { ContactImportModal } from "../../components";
import { useLocale } from "../../contexts";
import styles from "./DashboardPage.module.css";

const { Title } = Typography;

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { data: stats, isLoading } = useGetStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <Title level={2}>{t("dashboard")}</Title>
        <Space>
          <Button
            icon={<ImportOutlined />}
            onClick={() => setIsImportModalOpen(true)}
          >
            {t("import")}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/contacts/new")}
          >
            {t("addContact")}
          </Button>
        </Space>
      </div>

      <ContactImportModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t("totalContacts")}
              value={stats?.totalContacts ?? 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t("tags")}
              value={stats?.totalTags ?? 0}
              prefix={<TagOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t("notes")}
              value={stats?.totalNotes ?? 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t("recent30Days")}
              value={stats?.recentContacts ?? 0}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card className={styles.actionsCard}>
        <Title level={4}>{t("quickActions")}</Title>
        <div className={styles.actions}>
          <Button onClick={() => navigate("/contacts")}>
            {t("viewAllContacts")}
          </Button>
          <Button onClick={() => navigate("/contacts/new")}>
            {t("addNewContact")}
          </Button>
        </div>
      </Card>
    </div>
  );
};
