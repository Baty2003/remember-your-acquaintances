import { Button, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./CustomFieldsInput.module.css";

export interface CustomFieldItem {
  name: string;
  value: string;
}

export interface CustomFieldsInputProps {
  value?: CustomFieldItem[];
  onChange?: (value: CustomFieldItem[]) => void;
  fieldNamePlaceholder?: string;
  valuePlaceholder?: string;
  addFieldLabel?: string;
}

export const CustomFieldsInput = ({
  value,
  onChange,
  fieldNamePlaceholder = "Field name",
  valuePlaceholder = "Value",
  addFieldLabel = "Add field",
}: CustomFieldsInputProps) => {
  const fields = value && value.length > 0 ? value : [{ name: "", value: "" }];

  const updateFields = (newFields: CustomFieldItem[]) => {
    onChange?.(newFields);
  };

  const addField = () => {
    updateFields([...fields, { name: "", value: "" }]);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    updateFields(newFields.length > 0 ? newFields : [{ name: "", value: "" }]);
  };

  const updateField = (
    index: number,
    field: "name" | "value",
    fieldValue: string,
  ) => {
    const newFields = fields.map((item, i) =>
      i === index ? { ...item, [field]: fieldValue } : item,
    );
    updateFields(newFields);
  };

  return (
    <div className={styles.container}>
      {fields.map((field, index) => (
        <div key={index} className={styles.fieldRow}>
          <Input
            value={field.name}
            onChange={(e) => updateField(index, "name", e.target.value)}
            placeholder={fieldNamePlaceholder}
            className={styles.nameInput}
          />
          <Input
            value={field.value}
            onChange={(e) => updateField(index, "value", e.target.value)}
            placeholder={valuePlaceholder}
            className={styles.valueInput}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeField(index)}
            className={styles.deleteButton}
          />
        </div>
      ))}
      <Button
        type="dashed"
        onClick={addField}
        icon={<PlusOutlined />}
        className={styles.addButton}
      >
        {addFieldLabel}
      </Button>
    </div>
  );
};
