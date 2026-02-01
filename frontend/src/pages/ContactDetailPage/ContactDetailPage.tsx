import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Spin, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetContactQuery, useDeleteContactMutation } from '../../store';
import { message } from 'antd';
import {
  HeaderBlock,
  KeyFactsBlock,
  MeetingBlock,
  DescriptionBlock,
  ContactLinksBlock,
  TagsBlock,
  NotesBlock,
  MetadataBlock,
} from './blocks';
import styles from './ContactDetailPage.module.css';

export const ContactDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: currentContact, isLoading, error } = useGetContactQuery(id!, {
    skip: !id,
  });

  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const handleBack = () => {
    navigate('/contacts');
  };

  const handleEdit = () => {
    navigate(`/contacts/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteContact(id).unwrap();
      message.success('Contact deleted successfully');
      navigate('/contacts');
    } catch (err) {
      message.error(err as string);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !currentContact) {
    return (
      <div className={styles.container}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className={styles.backButton}
        >
          Back to Contacts
        </Button>
        <Empty description="Contact not found" />
      </div>
    );
  }

  const {
    name,
    gender,
    age,
    ageType,
    height,
    heightType,
    occupation,
    occupationDetails,
    meetingPlace,
    howMet,
    details,
    metAt,
    tags,
    links,
    notes,
    createdAt,
    updatedAt,
  } = currentContact;

  return (
    <div className={styles.container}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        className={styles.backButton}
      >
        Back to Contacts
      </Button>

      <Card className={styles.card}>
        <HeaderBlock
          name={name}
          gender={gender}
          age={age}
          ageType={ageType}
          height={height}
          heightType={heightType}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        <KeyFactsBlock
          occupation={occupation}
          occupationDetails={occupationDetails}
        />

        <MeetingBlock
          meetingPlace={meetingPlace}
          metAt={metAt}
          howMet={howMet}
        />

        <DescriptionBlock details={details} />

        <ContactLinksBlock links={links} />

        <TagsBlock tags={tags} />

        <NotesBlock notes={notes} />

        <MetadataBlock createdAt={createdAt} updatedAt={updatedAt} />
      </Card>
    </div>
  );
};
