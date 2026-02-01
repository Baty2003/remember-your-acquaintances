import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Card, Row, Col, Statistic, Spin, Button } from 'antd';
import {
  UserOutlined,
  TagOutlined,
  FileTextOutlined,
  PlusOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { statsService } from '../../services';
import type { UserStats } from '../../types';
import styles from './DashboardPage.module.css';

const { Title } = Typography;

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await statsService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

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
        <Title level={2}>Dashboard</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/contacts/new')}
        >
          Add Contact
        </Button>
      </div>

      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Total Contacts"
              value={stats?.totalContacts ?? 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Tags"
              value={stats?.totalTags ?? 0}
              prefix={<TagOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Notes"
              value={stats?.totalNotes ?? 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Recent (30 days)"
              value={stats?.recentContacts ?? 0}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card className={styles.actionsCard}>
        <Title level={4}>Quick Actions</Title>
        <div className={styles.actions}>
          <Button onClick={() => navigate('/contacts')}>View All Contacts</Button>
          <Button onClick={() => navigate('/contacts/new')}>Add New Contact</Button>
        </div>
      </Card>
    </div>
  );
};
