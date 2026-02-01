import { Layout, Menu, Button, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  TagOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { logout } from '../../../store/authSlice';
import { Logo } from '../../Logo';
import styles from './AppLayout.module.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/contacts',
      icon: <UserOutlined />,
      label: 'Contacts',
    },
    {
      key: '/tags',
      icon: <TagOutlined />,
      label: 'Tags',
    },
    {
      key: '/meeting-places',
      icon: <EnvironmentOutlined />,
      label: 'Meeting Places',
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider theme="light" width={220}>
        <div className={styles.siderHeader}>
          <Logo size={28} />
          <Title level={4} className={styles.siderTitle}>
            Acquaintances
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <span className={styles.userInfo}>Welcome, {user?.username}</span>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
