import { useEffect, useState, useMemo } from 'react';
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
  Radio,
  Checkbox,
  DatePicker,
  Divider,
} from 'antd';
import dayjs from 'dayjs';
import { ArrowLeftOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import {
  useGetContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
} from '../../store';
import { TagSelect, MeetingPlaceSelect, ContactLinksInput, CustomFieldsInput } from '../../components';
import type { CreateContactRequest } from '../../types';
import styles from './ContactFormPage.module.css';

const { TextArea } = Input;

const AGE_TYPE_OPTIONS = [
  { value: 'exact', label: 'Exact' },
  { value: 'approximate', label: 'Approximate' },
];

const HEIGHT_TYPE_OPTIONS = [
  { value: 'exact', label: 'Exact' },
  { value: 'approximate', label: 'Approximate' },
];


export const ContactFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const isEditMode = Boolean(id);

  const { data: currentContact, isLoading: isLoadingContact } = useGetContactQuery(id!, {
    skip: !id,
  });

  // Calculate initial isMetToday value based on currentContact
  const metAtValue = currentContact?.metAt;
  const initialIsMetToday = useMemo(() => {
    if (metAtValue) {
      return dayjs(metAtValue).isSame(dayjs(), 'day');
    }
    return true;
  }, [metAtValue]);

  const [isMetToday, setIsMetToday] = useState<boolean | null>(null);
  const [showResidenceDetailsToggled, setShowResidenceDetailsToggled] = useState<boolean | null>(null);
  const [showPersonDetailsToggled, setShowPersonDetailsToggled] = useState<boolean | null>(null);

  // Use the calculated value if state hasn't been set by user
  const effectiveIsMetToday = isMetToday ?? initialIsMetToday;
  const showResidenceDetails = showResidenceDetailsToggled ?? Boolean(currentContact?.residenceDetails);
  const showPersonDetails = showPersonDetailsToggled ?? Boolean(currentContact?.details);

  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (currentContact && isEditMode) {
      const metAtDate = currentContact.metAt ? dayjs(currentContact.metAt) : dayjs();

      // Reset toggles when switching to another contact
      // eslint-disable-next-line -- sync state when contact data loads for edit mode
      setShowResidenceDetailsToggled(null);
      setShowPersonDetailsToggled(null);
      form.setFieldsValue({
        name: currentContact.name,
        gender: currentContact.gender,
        age: currentContact.age,
        ageType: currentContact.ageType || 'exact',
        birthDate: currentContact.birthDate ? dayjs(currentContact.birthDate) : undefined,
        height: currentContact.height,
        heightType: currentContact.heightType || 'exact',
        occupation: currentContact.occupation,
        occupationDetails: currentContact.occupationDetails,
        residence: currentContact.residence,
        residenceDetails: currentContact.residenceDetails,
        customFields: currentContact.customFields
          ? Object.entries(currentContact.customFields).map(([name, value]) => ({ name, value }))
          : [{ name: '', value: '' }],
        meetingPlaceId: currentContact.meetingPlaceId || null,
        howMet: currentContact.howMet,
        details: currentContact.details,
        metAt: metAtDate,
        tagIds: currentContact.tags?.map((t) => t.id) || [],
        links: currentContact.links?.map((l) => ({
          type: l.type,
          label: l.label || undefined,
          value: l.value,
        })) || [],
      });
    }
  }, [currentContact, isEditMode, form]);

  const onFinish = async (
    values: CreateContactRequest & {
      metAt?: dayjs.Dayjs;
      birthDate?: dayjs.Dayjs;
      customFields?: { name: string; value: string }[];
    }
  ) => {
    try {
      const customFieldsArray = values.customFields ?? [];
      const customFieldsRecord = customFieldsArray
        .filter((f) => f.name?.trim())
        .reduce<Record<string, string>>(
          (acc, f) => ({ ...acc, [f.name.trim()]: f.value || '' }),
          {}
        );

      const data = {
        ...values,
        metAt: effectiveIsMetToday
          ? new Date().toISOString()
          : values.metAt?.toISOString() || new Date().toISOString(),
        birthDate: values.birthDate ? values.birthDate.toISOString() : undefined,
        details: showPersonDetails ? values.details : '',
        residenceDetails: showResidenceDetails ? values.residenceDetails : '',
        customFields: customFieldsRecord,
      };
      
      if (isEditMode && id) {
        await updateContact({ id, data }).unwrap();
        message.success('Contact updated successfully');
      } else {
        await createContact(data).unwrap();
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

  if (isEditMode && isLoadingContact && !currentContact) {
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
          initialValues={{
            ageType: 'exact',
            heightType: 'exact',
            customFields: [{ name: '', value: '' }],
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Divider />

          <Form.Item name="gender" label="Gender">
            <Radio.Group optionType="button">
              <Radio.Button value="male">
                <ManOutlined /> Male
              </Radio.Button>
              <Radio.Button value="female">
                <WomanOutlined /> Female
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Divider />

          <div className={styles.row}>
            <Form.Item name="age" label="Age" className={styles.ageInput}>
              <InputNumber min={0} max={150} placeholder="Age" />
            </Form.Item>

            <Form.Item name="ageType" label="Age Type" className={styles.ageTypeInput}>
              <Select options={AGE_TYPE_OPTIONS} />
            </Form.Item>
          </div>

          <Form.Item name="birthDate" label="Date of Birth">
            <DatePicker format="DD.MM.YYYY" placeholder="Select date" className={styles.datePicker} />
          </Form.Item>

          <div className={styles.row}>
            <Form.Item name="height" label="Height (cm)" className={styles.heightInput}>
              <InputNumber min={0} max={300} placeholder="e.g., 175" />
            </Form.Item>

            <Form.Item name="heightType" label="Height Type" className={styles.heightTypeInput}>
              <Select options={HEIGHT_TYPE_OPTIONS} />
            </Form.Item>
          </div>

          <Divider />

          <Form.Item name="occupation" label="Occupation">
            <Input placeholder="Enter occupation" />
          </Form.Item>

          <Form.Item name="occupationDetails" label="Occupation Details">
            <TextArea rows={2} placeholder="Additional details about their work" />
          </Form.Item>

          <Divider />

          <Form.Item name="residence" label="Place of Residence">
            <Input placeholder="City, address, or area" />
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={showResidenceDetails}
              onChange={(e) => setShowResidenceDetailsToggled(e.target.checked)}
            >
              Add residence details
            </Checkbox>
          </Form.Item>

          {showResidenceDetails && (
            <Form.Item name="residenceDetails" label="Residence Details">
              <TextArea rows={3} placeholder="Additional information about the place of residence" />
            </Form.Item>
          )}

          <Divider />

          <Form.Item name="meetingPlaceId" label="Where Met">
            <MeetingPlaceSelect placeholder="Select where you met" />
          </Form.Item>

          <Form.Item name="howMet" label="How Met">
            <TextArea rows={3} placeholder="Describe how you met" />
          </Form.Item>

          <Form.Item label="When Met">
            <div className={styles.metAtRow}>
              <Checkbox
                checked={effectiveIsMetToday}
                onChange={(e) => setIsMetToday(e.target.checked)}
              >
                Today
              </Checkbox>
              {!effectiveIsMetToday && (
                <Form.Item name="metAt" noStyle>
                  <DatePicker 
                    format="DD.MM.YYYY"
                    placeholder="Select date"
                    className={styles.datePicker}
                  />
                </Form.Item>
              )}
            </div>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Checkbox
              checked={showPersonDetails}
              onChange={(e) => setShowPersonDetailsToggled(e.target.checked)}
            >
              Add person details
            </Checkbox>
          </Form.Item>

          {showPersonDetails && (
            <Form.Item name="details" label="Person Details">
              <TextArea rows={3} placeholder="Additional information about this person" />
            </Form.Item>
          )}

          <Divider />

          <Form.Item name="tagIds" label="Tags">
            <TagSelect />
          </Form.Item>

          <Divider />

          <Form.Item name="links" label="Contact Links">
            <ContactLinksInput />
          </Form.Item>

          <Divider />

          <Form.Item name="customFields" label="Additional Information">
            <CustomFieldsInput />
          </Form.Item>

          <Divider />

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
