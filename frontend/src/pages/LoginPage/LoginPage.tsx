import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch, Typography } from "antd";
import { AuthForm } from "../../components";
import { useAppSelector } from "../../hooks";
import { useLocale } from "../../contexts";
import styles from "./LoginPage.module.css";

const { Text } = Typography;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.localeToggle}>
        <Text type="secondary">EN</Text>
        <Switch
          checked={locale === "ru"}
          onChange={(checked) => setLocale(checked ? "ru" : "en")}
          size="small"
        />
        <Text type="secondary">RU</Text>
      </div>
      <AuthForm />
    </div>
  );
};
