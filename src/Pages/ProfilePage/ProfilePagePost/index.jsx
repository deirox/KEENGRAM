import React, { useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { FaComment } from "react-icons/fa";
import PostCardModal from "../../../components/PostCard/PostCardModal";
import styles from "./ProfilePagePost.module.css";

const ProfilePagePost = ({ post }) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const onOpen = () => {
    setIsPostModalOpen(true);
  };
  const onClose = () => {
    setIsPostModalOpen(false);
  };
  return (
    <>
      <PostCardModal
        isOpen={isPostModalOpen}
        onClose={onClose}
        author={post.author}
        comments={post.comments}
        created_date={post.created_date}
        images={post.images}
        likes={post.likes}
        uid={post.uid}
        isUserPosts={true}
      />
      <div className={styles.profile_page__post} onClick={onOpen}>
        <img src={post.images[0].url} alt={post.images[0].url} />
        <div className={styles.profile_page__post_hover}>
          <div className={styles.profile_page__post_hover__container}>
            {post.likes.length > 0 && (
              <div className={styles.profile_page__post_hover__item}>
                <BsSuitHeartFill
                  className={styles.profile_page__post_hover__icon}
                />
                <span className={styles.profile_page__post_hover__item_text}>
                  {post.likes.length}
                </span>
              </div>
            )}
            <div className={styles.profile_page__post_hover__item}>
              <FaComment className={styles.profile_page__post_hover__icon} />
              <span className={styles.profile_page__post_hover__item_text}>
                {post.comments.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePagePost;
