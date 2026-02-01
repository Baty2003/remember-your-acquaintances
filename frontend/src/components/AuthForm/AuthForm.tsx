import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useLoginMutation, useRegisterMutation } from '../../store';
import { setCredentials, clearError, setError } from '../../store/authSlice';
import { Logo } from '../Logo';
import {
  AUTH_FORM_CONSTANTS,
  USERNAME_RULES,
  PASSWORD_RULES,
  CONFIRM_PASSWORD_RULES,
} from '../../consts';
import styles from './AuthForm.module.css';

const { Title, Link } = Typography;

type AuthMode = 'login' | 'register';

interface LoginFormValues {
  username: string;
  password: string;
}

interface RegisterFormValues extends LoginFormValues {
  confirmPassword: string;
}

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const isLogin = mode === 'login';
  const isLoading = isLoggingIn || isRegistering;

  const onFinish = async (values: LoginFormValues | RegisterFormValues) => {
    try {
      let result;
      if (isLogin) {
        result = await login(values as LoginFormValues).unwrap();
      } else {
        const { username, password } = values as RegisterFormValues;
        result = await register({ username, password }).unwrap();
      }
      dispatch(setCredentials({ user: result.user, token: result.token }));
      navigate('/');
    } catch (err) {
      const error = err as { data?: { error?: string } };
      dispatch(setError(error.data?.error || 'Authentication failed'));
    }
  };

  const toggleMode = () => {
    dispatch(clearError());
    form.resetFields();
    setMode(isLogin ? 'register' : 'login');
  };

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const {
    TITLE,
    LOGIN_FORM_NAME,
    REGISTER_FORM_NAME,
    LOGIN_BUTTON_TEXT,
    REGISTER_BUTTON_TEXT,
    USERNAME_PLACEHOLDER,
    PASSWORD_PLACEHOLDER,
    CONFIRM_PASSWORD_PLACEHOLDER,
    LOGO_SIZE,
    SWITCH_TO_REGISTER,
    SWITCH_TO_LOGIN,
  } = AUTH_FORM_CONSTANTS;

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Logo size={LOGO_SIZE} />
      </div>
      <Title level={2} className={styles.title}>
        {TITLE}
      </Title>

      {error && (
        <Alert
          description={error}
          type="error"
          showIcon
          closable={{ onClose: () => dispatch(clearError()) }}
          className={styles.alert}
        />
      )}

      <Form
        form={form}
        name={isLogin ? LOGIN_FORM_NAME : REGISTER_FORM_NAME}
        onFinish={onFinish}
        size="large"
      >
        <Form.Item name="username" rules={USERNAME_RULES}>
          <Input prefix={<UserOutlined />} placeholder={USERNAME_PLACEHOLDER} />
        </Form.Item>

        <Form.Item name="password" rules={PASSWORD_RULES}>
          <Input.Password prefix={<LockOutlined />} placeholder={PASSWORD_PLACEHOLDER} />
        </Form.Item>

        {!isLogin && (
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              ...CONFIRM_PASSWORD_RULES,
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            {isLogin ? LOGIN_BUTTON_TEXT : REGISTER_BUTTON_TEXT}
          </Button>
        </Form.Item>
      </Form>

      <div className={styles.switchMode}>
        <Link onClick={toggleMode}>
          {isLogin ? SWITCH_TO_REGISTER : SWITCH_TO_LOGIN}
        </Link>
      </div>
    </div>
  );
};
