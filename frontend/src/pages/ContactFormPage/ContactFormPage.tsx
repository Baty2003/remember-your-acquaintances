import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  message,
  Spin,
  Space,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  createContact,
  updateContact,
  fetchContactById,
  clearCurrentContact,
} from '../../store';
import type { CreateContactRequest } from '../../types';
import styles from './ContactFormPage.module.css';

const { TextArea } = Input;

const AGE_TYPE_OPTIONS = [
  { value: 'exact', label: 'Exact' },
  { value: 'approximate', label: 'Approximate' },
];

export const ContactFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { currentContact, isLoading } = useAppSelector((state) => state.contacts);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (id) {
      dispatch(fetchContactById(id));
    }
    return () => {
      dispatch(clearCurrentContact());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentContact && isEditMode) {
      form.setFieldsValue({
        name: currentContact.name,
        age: currentContact.age,
        ageType: currentContact.ageType || 'exact',
        height: currentContact.height,
        occupation: currentContact.occupation,
        occupationDetails: currentContact.occupationDetails,
        whereMet: currentContact.whereMet,
        howMet: currentContact.howMet,
      });
    }
  }, [currentContact, isEditMode, form]);

  const onFinish = async (values: CreateContactRequest) => {
    try {
      if (isEditMode && id) {
        await dispatch(updateContact({ id, data: values })).unwrap();
        message.success('Contact updated successfully');
      } else {
        await dispatch(createContact(values)).unwrap();
        message.success('Contact created successfully');
      }
      navigate('/contacts');
    } catch (error) {
      message.error(error as string);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isEditMode && isLoading && !currentContact) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        className={styles.backButton}
      >
        Back
      </Button>

      <Card
        title={isEditMode ? 'Edit Contact' : 'Add New Contact'}
        className={styles.card}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ ageType: 'exact' }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <div className={styles.row}>
            <Form.Item name="age" label="Age" className={styles.ageInput}>
              <InputNumber min={0} max={150} placeholder="Age" />
            </Form.Item>

            <Form.Item name="ageType" label="Age Type" className={styles.ageTypeInput}>
              <Select options={AGE_TYPE_OPTIONS} />
            </Form.Item>
          </div>

          <Form.Item name="height" label="Height (cm)">
            <Space.Compact className={styles.heightInput}>
              <InputNumber min={0} max={300} placeholder="e.g., 175" />
              <Button disabled>cm</Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item name="occupation" label="Occupation">
            <Input placeholder="Enter occupation" />
          </Form.Item>

          <Form.Item name="occupationDetails" label="Occupation Details">
            <TextArea rows={2} placeholder="Additional details about their work" />
          </Form.Item>

          <Form.Item name="whereMet" label="Where Met">
            <Input placeholder="Where did you meet this person?" />
          </Form.Item>

          <Form.Item name="howMet" label="How Met">
            <TextArea rows={3} placeholder="Describe how you met" />
          </Form.Item>

          <Form.Item className={styles.actions}>
            <Button onClick={handleBack} className={styles.cancelButton}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {isEditMode ? 'Update Contact' : 'Create Contact'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
