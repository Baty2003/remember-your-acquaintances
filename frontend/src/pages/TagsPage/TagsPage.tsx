import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Space,
  Typography,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from "../../store";
import { useLocale } from "../../contexts";
import type { Tag } from "../../types";
import styles from "./TagsPage.module.css";

const { Title } = Typography;

export const TagsPage = () => {
  const { t } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const { data, isLoading } = useGetTagsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createTag, { isLoading: isCreating }] = useCreateTagMutation();
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const tags = data?.tags ?? [];

  const handleOpenModal = () => {
    setNewTagName("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTagName("");
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      message.error(t("pleaseEnterTagName"));
      return;
    }

    try {
      await createTag({ name: newTagName.trim() }).unwrap();
      message.success(t("tagCreated"));
      handleCloseModal();
    } catch (err) {
      const error = err as { data?: { error?: string } };
      message.error(error.data?.error || t("failedToCreateTag"));
    }
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim()) {
      message.error(t("pleaseEnterTagName"));
      return;
    }

    try {
      await updateTag({ id: editingId, name: editingName.trim() }).unwrap();
      message.success(t("tagUpdated"));
      handleCancelEdit();
    } catch (err) {
      const error = err as { data?: { error?: string } };
      message.error(error.data?.error || t("failedToUpdateTag"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTag(id).unwrap();
      message.success(t("tagDeleted"));
    } catch (err) {
      const error = err as { data?: { error?: string } };
      message.error(error.data?.error || t("failedToDeleteTag"));
    }
  };

  const columns: ColumnsType<Tag> = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        if (editingId === record.id) {
          return (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onPressEnter={handleSaveEdit}
              autoFocus
              className={styles.editInput}
            />
          );
        }
        return record.name;
      },
    },
    {
      title: t("createdLabel"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: t("actions"),
      key: "actions",
      width: 120,
      render: (_, record) => {
        if (editingId === record.id) {
          return (
            <Space>
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={handleSaveEdit}
                loading={isUpdating}
                className={styles.saveButton}
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={handleCancelEdit}
                className={styles.cancelButton}
              />
            </Space>
          );
        }
        return (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleStartEdit(record)}
            />
            <Popconfirm
              title={t("deleteTag")}
              description={t("deleteTagConfirm")}
              onConfirm={() => handleDelete(record.id)}
              okText={t("yes")}
              cancelText={t("no")}
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2}>{t("tags")}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
        >
          {t("addTag")}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        className={styles.table}
      />

      <Modal
        title={t("addNewTag")}
        open={isModalOpen}
        onOk={handleCreateTag}
        onCancel={handleCloseModal}
        confirmLoading={isCreating}
        okText={t("create")}
      >
        <Input
          placeholder={t("enterTagName")}
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onPressEnter={handleCreateTag}
          autoFocus
        />
      </Modal>
    </div>
  );
};
