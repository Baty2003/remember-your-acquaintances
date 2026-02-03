import { Layout, Menu, Button, Typography, Switch, Space } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  TagOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useLocale } from "../../../contexts";
import { logout } from "../../../store/authSlice";
import { Logo } from "../../Logo";
import styles from "./AppLayout.module.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { locale, setLocale, t } = useLocale();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <HomeOutlined />,
      label: t("dashboard"),
    },
    {
      key: "/contacts",
      icon: <UserOutlined />,
      label: t("contacts"),
    },
    {
      key: "/tags",
      icon: <TagOutlined />,
      label: t("tags"),
    },
    {
      key: "/meeting-places",
      icon: <EnvironmentOutlined />,
      label: t("meetingPlaces"),
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider theme="light" width={220}>
        <div className={styles.siderHeader}>
          <Logo size={28} />
          <Title level={4} className={styles.siderTitle}>
            {t("appTitle")}
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
          <span className={styles.userInfo}>
            {t("welcome")}, {user?.username}
          </span>
          <Space className={styles.headerActions}>
            <Space size={8} className={styles.localeToggle}>
              <Text type="secondary" className={styles.localeLabel}>
                EN
              </Text>
              <Switch
                checked={locale === "ru"}
                onChange={(checked) => setLocale(checked ? "ru" : "en")}
                size="small"
              />
              <Text type="secondary" className={styles.localeLabel}>
                RU
              </Text>
            </Space>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              {t("logout")}
            </Button>
          </Space>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
