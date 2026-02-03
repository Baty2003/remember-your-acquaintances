import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Spin, Empty, Collapse } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetContactQuery, useDeleteContactMutation } from '../../store';
import { message } from 'antd';
import {
  HeaderBlock,
  KeyFactsBlock,
  MeetingBlock,
  DescriptionBlock,
  AdditionalInformationBlock,
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

  const collapseItems = useMemo(() => {
    if (!currentContact) return [];
    
    const {
      occupation,
      occupationDetails,
      residence,
      residenceDetails,
      customFields,
      meetingPlace,
      howMet,
      details,
      metAt,
      tags,
      links,
      notes,
    } = currentContact;

    const items = [];

    if (occupation || occupationDetails || residence || residenceDetails) {
      items.push({
        key: 'keyFacts',
        label: 'Key Facts',
        children: (
          <KeyFactsBlock
            occupation={occupation}
            occupationDetails={occupationDetails}
            residence={residence}
            residenceDetails={residenceDetails}
          />
        ),
      });
    }

    if (details) {
      items.push({
        key: 'personDetails',
        label: 'Person Details',
        children: <DescriptionBlock details={details} />,
      });
    }

    if (customFields && Object.keys(customFields).length > 0) {
      items.push({
        key: 'additionalInfo',
        label: 'Additional Information',
        children: <AdditionalInformationBlock customFields={customFields} />,
      });
    }

    if (meetingPlace || metAt || howMet) {
      items.push({
        key: 'meeting',
        label: 'Meeting',
        children: (
          <MeetingBlock
            meetingPlace={meetingPlace}
            metAt={metAt}
            howMet={howMet}
          />
        ),
      });
    }

    if (links && links.length > 0) {
      items.push({
        key: 'links',
        label: 'Contact Links',
        children: <ContactLinksBlock links={links} />,
      });
    }

    if (tags && tags.length > 0) {
      items.push({
        key: 'tags',
        label: 'Tags',
        children: <TagsBlock tags={tags} />,
      });
    }

    if (notes && notes.length > 0) {
      items.push({
        key: 'notes',
        label: 'Notes',
        children: <NotesBlock notes={notes} />,
      });
    }

    return items;
  }, [currentContact]);

  const defaultActiveKeys = useMemo(
    () => collapseItems.map((item) => item.key),
    [collapseItems]
  );

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
    birthDate,
    height,
    heightType,
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
          birthDate={birthDate}
          height={height}
          heightType={heightType}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        {collapseItems.length > 0 && (
          <Collapse
            defaultActiveKey={defaultActiveKeys}
            ghost
            className={styles.collapse}
            items={collapseItems}
          />
        )}

        <MetadataBlock createdAt={createdAt} updatedAt={updatedAt} />
      </Card>
    </div>
  );
};
