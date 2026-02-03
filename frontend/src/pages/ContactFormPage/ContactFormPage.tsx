import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "antd";
import dayjs from "dayjs";
import {
  ArrowLeftOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import {
  useGetContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
} from "../../store";
import {
  TagSelect,
  MeetingPlaceSelect,
  ContactLinksInput,
  CustomFieldsInput,
} from "../../components";
import { useLocale } from "../../contexts";
import type { CreateContactRequest } from "../../types";
import styles from "./ContactFormPage.module.css";

const { TextArea } = Input;

export const ContactFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useLocale();

  const isEditMode = Boolean(id);

  const ageTypeOptions = [
    { value: "exact", label: t("exact") },
    { value: "approximate", label: t("approximate") },
  ];

  const heightTypeOptions = [
    { value: "exact", label: t("exact") },
    { value: "approximate", label: t("approximate") },
  ];

  const { data: currentContact, isLoading: isLoadingContact } =
    useGetContactQuery(id!, {
      skip: !id,
    });

  // Calculate initial isMetToday value based on currentContact
  const metAtValue = currentContact?.metAt;
  const initialIsMetToday = useMemo(() => {
    if (metAtValue) {
      return dayjs(metAtValue).isSame(dayjs(), "day");
    }
    return true;
  }, [metAtValue]);

  const [isMetToday, setIsMetToday] = useState<boolean | null>(null);
  const [showResidenceDetailsToggled, setShowResidenceDetailsToggled] =
    useState<boolean | null>(null);
  const [showPersonDetailsToggled, setShowPersonDetailsToggled] = useState<
    boolean | null
  >(null);

  // Use the calculated value if state hasn't been set by user
  const effectiveIsMetToday = isMetToday ?? initialIsMetToday;
  const showResidenceDetails =
    showResidenceDetailsToggled ?? Boolean(currentContact?.residenceDetails);
  const showPersonDetails =
    showPersonDetailsToggled ?? Boolean(currentContact?.details);

  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (currentContact && isEditMode) {
      const metAtDate = currentContact.metAt
        ? dayjs(currentContact.metAt)
        : dayjs();

      // Reset toggles when switching to another contact
      // eslint-disable-next-line -- sync state when contact data loads for edit mode
      setShowResidenceDetailsToggled(null);
      setShowPersonDetailsToggled(null);
      form.setFieldsValue({
        name: currentContact.name,
        gender: currentContact.gender,
        age: currentContact.age,
        ageType: currentContact.ageType || "exact",
        birthDate: currentContact.birthDate
          ? dayjs(currentContact.birthDate)
          : undefined,
        height: currentContact.height,
        heightType: currentContact.heightType || "exact",
        occupation: currentContact.occupation,
        occupationDetails: currentContact.occupationDetails,
        residence: currentContact.residence,
        residenceDetails: currentContact.residenceDetails,
        customFields: currentContact.customFields
          ? Object.entries(currentContact.customFields).map(
              ([name, value]) => ({ name, value }),
            )
          : [{ name: "", value: "" }],
        meetingPlaceId: currentContact.meetingPlaceId || null,
        howMet: currentContact.howMet,
        details: currentContact.details,
        metAt: metAtDate,
        tagIds: currentContact.tags?.map((t) => t.id) || [],
        links:
          currentContact.links?.map((l) => ({
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
    },
  ) => {
    try {
      const customFieldsArray = values.customFields ?? [];
      const customFieldsRecord = customFieldsArray
        .filter((f) => f.name?.trim())
        .reduce<
          Record<string, string>
        >((acc, f) => ({ ...acc, [f.name.trim()]: f.value || "" }), {});

      const data = {
        ...values,
        metAt: effectiveIsMetToday
          ? new Date().toISOString()
          : values.metAt?.toISOString() || new Date().toISOString(),
        birthDate: values.birthDate
          ? values.birthDate.toISOString()
          : undefined,
        details: showPersonDetails ? values.details : "",
        residenceDetails: showResidenceDetails ? values.residenceDetails : "",
        customFields: customFieldsRecord,
      };

      if (isEditMode && id) {
        await updateContact({ id, data }).unwrap();
        message.success(t("contactUpdatedSuccess"));
      } else {
        await createContact(data).unwrap();
        message.success(t("contactCreatedSuccess"));
      }
      navigate("/contacts");
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
        {t("back")}
      </Button>

      <Card
        title={isEditMode ? t("editContact") : t("addNewContact")}
        className={styles.card}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            ageType: "exact",
            heightType: "exact",
            customFields: [{ name: "", value: "" }],
          }}
        >
          <Form.Item
            name="name"
            label={t("name")}
            rules={[{ required: true, message: t("pleaseEnterName") }]}
          >
            <Input placeholder={t("enterName")} />
          </Form.Item>

          <Divider />

          <Form.Item name="gender" label={t("gender")}>
            <Radio.Group optionType="button">
              <Radio.Button value="male">
                <ManOutlined /> {t("male")}
              </Radio.Button>
              <Radio.Button value="female">
                <WomanOutlined /> {t("female")}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Divider />

          <div className={styles.row}>
            <Form.Item name="age" label={t("age")} className={styles.ageInput}>
              <InputNumber min={0} max={150} placeholder={t("age")} />
            </Form.Item>

            <Form.Item
              name="ageType"
              label={t("ageType")}
              className={styles.ageTypeInput}
            >
              <Select options={ageTypeOptions} />
            </Form.Item>
          </div>

          <Form.Item name="birthDate" label={t("birthDate")}>
            <DatePicker
              format="DD.MM.YYYY"
              placeholder={t("selectDate")}
              className={styles.datePicker}
            />
          </Form.Item>

          <div className={styles.row}>
            <Form.Item
              name="height"
              label={t("heightCm")}
              className={styles.heightInput}
            >
              <InputNumber
                min={0}
                max={300}
                placeholder={t("heightPlaceholder")}
              />
            </Form.Item>

            <Form.Item
              name="heightType"
              label={t("heightType")}
              className={styles.heightTypeInput}
            >
              <Select options={heightTypeOptions} />
            </Form.Item>
          </div>

          <Divider />

          <Form.Item name="occupation" label={t("occupation")}>
            <Input placeholder={t("enterOccupation")} />
          </Form.Item>

          <Form.Item name="occupationDetails" label={t("occupationDetails")}>
            <TextArea
              rows={2}
              placeholder={t("occupationDetailsPlaceholder")}
            />
          </Form.Item>

          <Divider />

          <Form.Item name="residence" label={t("placeOfResidence")}>
            <Input placeholder={t("cityAddressArea")} />
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={showResidenceDetails}
              onChange={(e) => setShowResidenceDetailsToggled(e.target.checked)}
            >
              {t("addResidenceDetails")}
            </Checkbox>
          </Form.Item>

          {showResidenceDetails && (
            <Form.Item name="residenceDetails" label={t("residenceDetails")}>
              <TextArea
                rows={3}
                placeholder={t("residenceDetailsPlaceholder")}
              />
            </Form.Item>
          )}

          <Divider />

          <Form.Item name="meetingPlaceId" label={t("whereMet")}>
            <MeetingPlaceSelect placeholder={t("selectWhereMet")} />
          </Form.Item>

          <Form.Item name="howMet" label={t("howMet")}>
            <TextArea rows={3} placeholder={t("describeHowMet")} />
          </Form.Item>

          <Form.Item label={t("whenMet")}>
            <div className={styles.metAtRow}>
              <Checkbox
                checked={effectiveIsMetToday}
                onChange={(e) => setIsMetToday(e.target.checked)}
              >
                {t("today")}
              </Checkbox>
              {!effectiveIsMetToday && (
                <Form.Item name="metAt" noStyle>
                  <DatePicker
                    format="DD.MM.YYYY"
                    placeholder={t("selectDate")}
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
              {t("addPersonDetails")}
            </Checkbox>
          </Form.Item>

          {showPersonDetails && (
            <Form.Item name="details" label={t("personDetails")}>
              <TextArea rows={3} placeholder={t("personDetailsPlaceholder")} />
            </Form.Item>
          )}

          <Divider />

          <Form.Item name="tagIds" label={t("tags")}>
            <TagSelect />
          </Form.Item>

          <Divider />

          <Form.Item name="links" label={t("contactLinks")}>
            <ContactLinksInput />
          </Form.Item>

          <Divider />

          <Form.Item name="customFields" label={t("additionalInformation")}>
            <CustomFieldsInput
              fieldNamePlaceholder={t("fieldName")}
              valuePlaceholder={t("value")}
              addFieldLabel={t("addField")}
            />
          </Form.Item>

          <Divider />

          <Form.Item className={styles.actions}>
            <Button onClick={handleBack} className={styles.cancelButton}>
              {t("cancel")}
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {isEditMode ? t("updateContact") : t("createContact")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
