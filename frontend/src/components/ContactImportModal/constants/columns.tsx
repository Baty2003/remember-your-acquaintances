import { Popover, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ContactImportItem } from '../../../types';
import { ContactDetails } from '../components';

export const getImportColumns = (): ColumnsType<ContactImportItem> => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    render: (name: string, record: ContactImportItem) => (
      <Space>
        <span>{name}</span>
        <Popover
          content={<ContactDetails contact={record} />}
          title={name}
          trigger="hover"
          placement="right"
        >
          <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
        </Popover>
      </Space>
    ),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 60,
    render: (age: number | undefined, record: ContactImportItem) =>
      age ? `${age}${record.ageType === 'approximate' ? ' ~' : ''}` : '-',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    render: (gender: string | undefined) => gender || '-',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    key: 'tags',
    ellipsis: true,
    render: (tags: string[] | undefined) => (tags?.length ? tags.join(', ') : '-'),
  },
  {
    title: 'Meeting Place',
    dataIndex: 'meetingPlace',
    key: 'meetingPlace',
    ellipsis: true,
    render: (place: string | undefined) => place || '-',
  },
];
