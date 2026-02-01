import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;

interface FileUploadTabProps {
  fileList: UploadFile[];
  onFileSelect: (file: File) => false;
  onRemove: () => void;
}

export const FileUploadTab = ({ fileList, onFileSelect, onRemove }: FileUploadTabProps) => {
  return (
    <Dragger
      accept=".json"
      fileList={fileList}
      beforeUpload={onFileSelect}
      onRemove={onRemove}
      maxCount={1}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Нажмите или перетащите JSON файл</p>
      <p className="ant-upload-hint">Загрузите файл с массивом контактов</p>
    </Dragger>
  );
};
