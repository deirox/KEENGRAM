import cn from "classnames";
import React, { useState } from "react";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import ReactImageGallery from "react-image-gallery";
import { Link } from "react-router-dom";
import { usePostsStore } from "../../../store/usePostsStore";
import { useUserStore } from "../../../store/useUserStore";
import MiniComment from "../../MiniComment";
import ModalBody from "../../ModalBody";
import styles from "./PostCardModal.module.css";

const PostCardModal = ({
  uid = "",
  images = [],
  created_date = 0,
  likes = [],
  comments = [],
  author = {},
  isOpen = false,
  onClose = () => {},
  isUserPosts = false,
}) => {
  const formatedImages = images.map((image) => {
    return { ...image, original: image.url, thumbnail: image.url };
  });
  const [commentValue, setCommentValue] = useState("");
  const mutateLike = usePostsStore((state) => state.mutateLike);
  const addComment = usePostsStore((state) => state.addComment);
  const isMutatePostsLoading = usePostsStore(
    (state) => state.isMutatePostsLoading
  );
  const authorizedUserData = useUserStore((state) => state.authorizedUserData);
  const onLike = () => {
    mutateLike(uid, authorizedUserData.uid, isUserPosts && true);
  };
  const onAddComment = async (e) => {
    e.preventDefault();
    if (commentValue.length > 0) {
      await addComment(
        uid,
        authorizedUserData.nickname,
        commentValue,
        isUserPosts && true
      );
      setCommentValue("");
    }
  };
  return (
    <ModalBody
      isModalOpen={isOpen}
      onClose={onClose}
      modalClassname={styles.post_card_modal}
    >
      <div className={styles.post_card_modal__box}>
        <div className={styles.post_card_modal__images}>
          <ReactImageGallery
            items={formatedImages}
            showBullets={formatedImages.length > 1}
            showThumbnails={false}
            showPlayButton={false}
            infinite={false}
            showFullscreenButton={false}
          />
        </div>
        <div className={styles.post_card_modal__actions}>
          <div className={styles.post_card_modal__top}>
            <img
              className={styles.post_card_modal__author_avatar}
              src={author.avatarUrl}
              alt={author.avatarUrl}
            />

            <Link
              className={styles.post_card_modal__author_nickname}
              to={`/${author.nickname}`}
            >
              {author.nickname}
            </Link>
          </div>
          <div className={styles.post_card_modal__comments}>
            {comments.length > 0 ? (
              comments.map(({ nickname, text }, index) => (
                <MiniComment
                  key={index}
                  classname={styles.post_card_modal__comment}
                  nickname={nickname}
                  text={text}
                />
              ))
            ) : (
              <div className={styles.post_card_modal__comments_is_null}>
                <h3>Нет комментариев.</h3>
                <p>Начните переписку.</p>
              </div>
            )}
          </div>
          <div className={styles.post_card_modal__inner_images}>
            <ReactImageGallery
              items={formatedImages}
              showBullets={formatedImages.length > 1}
              showThumbnails={false}
              showPlayButton={false}
              infinite={false}
              showFullscreenButton={false}
            />
          </div>
          <div className={styles.post_card_modal__bottom}>
            <div className={styles.post_card_modal__buttons}>
              <button
                className={cn(
                  styles.post_card_modal__button,
                  likes.includes(authorizedUserData.uid)
                    ? styles.post_card_modal__button_like
                    : ""
                )}
                onClick={onLike}
              >
                {likes.includes(authorizedUserData.uid) ? (
                  <BsSuitHeartFill color="rgb(255, 48, 64)" />
                ) : (
                  <BsSuitHeart color="#fff" />
                )}
              </button>
              <button className={styles.post_card_modal__button}>
                <FaRegComment color="#fff" />
              </button>
            </div>

            <p className={styles.post_card_modal__like_string}>
              {likes.length > 0
                ? likes.length > 1
                  ? `${likes.length} отметок "Нравиться"`
                  : `${likes.length} отметка "Нравиться"`
                : `Поставьте первую отметку "Нравиться"!`}
            </p>
            <form
              className={styles.post_card_modal__form}
              onSubmit={(e) => {
                onAddComment(e);
              }}
              aria-disabled={isMutatePostsLoading}
            >
              <textarea
                className={styles.post_card_modal__form_textarea}
                type="text"
                placeholder="Добавьте комментарий..."
                maxLength={200}
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                resize="none"
              />
              <button className={styles.post_card_modal__form_button}>
                Опубликовать
              </button>
            </form>
          </div>
        </div>
      </div>
    </ModalBody>
  );
};

export default PostCardModal;
