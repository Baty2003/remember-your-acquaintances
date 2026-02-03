import { Tag } from "antd";
import type { Tag as TagType } from "../../../../types";
import styles from "./TagsBlock.module.css";

interface TagsBlockProps {
  tags?: TagType[];
}

export const TagsBlock = ({ tags }: TagsBlockProps) => {
  return (
    <div className={styles.tags}>
      {tags?.map((tag) => (
        <Tag key={tag.id} color="blue">
          {tag.name}
        </Tag>
      ))}
    </div>
  );
};
