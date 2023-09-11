import dayjs from "dayjs";
import React, { useState } from "react";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { FaRegComment} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { usePostsStore } from "../../store/usePostsStore";
import MiniComment from "../MiniComment";
import styles from "./PostCard.module.css";
import cn from "classnames";
import ReactImageGallery from "react-image-gallery";
import PostCardModal from "./PostCardModal";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const PostCard = ({
  uid = "",
  images = [],
  created_date = 0,
  likes = [],
  comments = [],
  author = {},
}) => {
  const authorizedUserData = useUserStore((state) => state.authorizedUserData);
  const mutateLike = usePostsStore((state) => state.mutateLike);
  const isMutatePostsLoading = usePostsStore(
    (state) => state.isMutatePostsLoading
  );
  const addComment = usePostsStore((state) => state.addComment);
  const [comment, setComment] = useState("");
  const [isPostCardModalOpen, setIsPostCardModalOpen] = useState(false);

  const formatedImages = images.map((image) => {
    return { ...image, original: image.url, thumbnail: image.url };
  });
  const onLike = () => {
    mutateLike(uid, authorizedUserData.uid);
  };
  const onAddComment = (e) => {
    e.preventDefault();
    if (comment.length > 0) {
      addComment(uid, authorizedUserData.nickname, comment);
      setComment("");
    }
  };
  const onModalOpen = () => {
    setIsPostCardModalOpen(true);
  };
  const onModalClose = () => {
    setIsPostCardModalOpen(false);
  };
  return (
    <article className={styles.post_card}>
      <PostCardModal
        uid={uid}
        images={images}
        created_date={created_date}
        likes={likes}
        comments={comments}
        author={author}
        isOpen={isPostCardModalOpen}
        onClose={onModalClose}
      />
      <div className={styles.post_card__header}>
        <div className={styles.post_card__post_card__author_avatar}>
          <img
            src={author?.avatarUrl}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "img/EmptyAvatar.jpg";
            }}
            alt={author?.avatarUrl}
          />
        </div>
        <div className={styles.post_card__author_bio}>
          <div className={styles.post_card__author_bio__top}>
            <Link
              className={styles.post_card__author_nickname}
              to={author.nickname}
            >
              {author.nickname}
            </Link>
            <span className="_ac6e _ac6g _ac6h">•</span>

            <time
              className={`_ac6g ${styles.post_card__created_date}`}
              dateTime={created_date}
              title={dayjs(created_date).format("MMM D, YYYY")}
            >
              {dayjs(created_date).fromNow()}
            </time>
          </div>
          <div className={styles.post_card__author_bio__bottom}></div>
        </div>
      </div>
      <div className={styles.post_card__picture}>
        <ReactImageGallery
          items={formatedImages}
          showBullets={formatedImages.length > 1}
          showThumbnails={false}
          showPlayButton={false}
          infinite={false}
          showFullscreenButton={false}
        />
      </div>
      <div className={styles.post_card__bottom}>
        <div className={styles.post_card__buttons}>
          <button
            className={cn(
              styles.post_card__button,
              likes.includes(authorizedUserData.uid)
                ? styles.post_card__button_like
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
          <button className={styles.post_card__button}>
            <FaRegComment color="#fff" onClick={onModalOpen} />
          </button>
        </div>

        <p className={styles.post_card__like_string}>
          {likes.length > 0
            ? likes.length > 1
              ? `${likes.length} отметок "Нравиться"`
              : `${likes.length} отметка "Нравиться"`
            : `Поставьте первую отметку "Нравиться"!`}
        </p>
        {comments.length > 0 && (
          <MiniComment
            nickname={comments[0]?.nickname}
            text={comments[0]?.text}
          />
        )}
        {comments.length > 1 && (
          <button
            className={styles.post_card__show_comment_btn}
            onClick={onModalOpen}
          >
            Показать все комментарии ({comments.length})
          </button>
        )}
        <form
          className={styles.post_card__form}
          onSubmit={(e) => {
            onAddComment(e);
          }}
          aria-disabled={isMutatePostsLoading}
        >
          <textarea
            className={styles.post_card__form__textarea}
            type="text"
            placeholder="Добавьте комментарий..."
            maxLength={200}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            resize="none"
          />
          {comment.length > 0 && (
            <button className={styles.post_card__form__button}>
              Опубликовать
            </button>
          )}
        </form>
      </div>
    </article>
  );
};

export default PostCard;
