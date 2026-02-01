import { Typography, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TagOutlined, FileTextOutlined } from '@ant-design/icons';
import styles from './DashboardPage.module.css';

const { Title } = Typography;

export const DashboardPage = () => {
  return (
    <div>
      <Title level={2}>Dashboard</Title>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Contacts" value={0} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Tags" value={0} prefix={<TagOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Notes" value={0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card className={styles.recentContactsCard}>
        <Title level={4}>Recent Contacts</Title>
        <p>No contacts yet. Create your first contact to get started.</p>
      </Card>
    </div>
  );
};
