import { useState, useCallback } from "react";
import { Modal, Button, Alert, Tabs, message } from "antd";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useImportContactsMutation } from "../../store";
import { useJsonParser } from "./hooks";
import {
  FileUploadTab,
  TextInputTab,
  ImportPreview,
  FormatHint,
} from "./components";
import styles from "./ContactImportModal.module.css";

type InputMode = "file" | "text";

interface ContactImportModalProps {
  open: boolean;
  onClose: () => void;
}

export const ContactImportModal = ({
  open,
  onClose,
}: ContactImportModalProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [jsonText, setJsonText] = useState("");

  const {
    parsedContacts,
    parseError,
    parseJson,
    parseFile,
    reset: resetParser,
  } = useJsonParser();
  const [importContacts, { isLoading }] = useImportContactsMutation();

  const resetState = useCallback(() => {
    resetParser();
    setFileList([]);
    setJsonText("");
  }, [resetParser]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = (file: File) => {
    setFileList([file as unknown as UploadFile]);
    return parseFile(file);
  };

  const handleImport = async () => {
    if (parsedContacts.length === 0) return;

    try {
      const result = await importContacts(parsedContacts).unwrap();

      if (result.success > 0) {
        message.success(`Успешно импортировано ${result.success} контакт(ов)`);
      }

      if (result.failed > 0) {
        message.warning(
          `Не удалось импортировать ${result.failed} контакт(ов)`,
        );
        console.error("Import errors:", result.errors);
      }

      handleClose();
    } catch (error) {
      message.error("Не удалось импортировать контакты");
      console.error("Import error:", error);
    }
  };

  const tabItems = [
    {
      key: "file",
      label: (
        <span>
          <UploadOutlined /> Загрузить файл
        </span>
      ),
      children: (
        <FileUploadTab
          fileList={fileList}
          onFileSelect={handleFileSelect}
          onRemove={resetState}
        />
      ),
    },
    {
      key: "text",
      label: (
        <span>
          <EditOutlined /> Вставить текст
        </span>
      ),
      children: (
        <TextInputTab
          value={jsonText}
          onChange={setJsonText}
          onParse={() => parseJson(jsonText)}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Импорт контактов"
      open={open}
      onCancel={handleClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Отмена
        </Button>,
        <Button
          key="import"
          type="primary"
          onClick={handleImport}
          loading={isLoading}
          disabled={parsedContacts.length === 0}
        >
          Импортировать{" "}
          {parsedContacts.length > 0 ? `(${parsedContacts.length})` : ""}
        </Button>,
      ]}
    >
      <div className={styles.container}>
        {parsedContacts.length === 0 ? (
          <>
            <Tabs
              activeKey={inputMode}
              onChange={(key) => {
                setInputMode(key as InputMode);
                resetParser();
              }}
              items={tabItems}
            />

            {parseError && (
              <Alert
                type="error"
                title="Ошибка парсинга"
                description={parseError}
                showIcon
                className={styles.alert}
              />
            )}

            <FormatHint />
          </>
        ) : (
          <ImportPreview contacts={parsedContacts} onReset={resetState} />
        )}
      </div>
    </Modal>
  );
};
