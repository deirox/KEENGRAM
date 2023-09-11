import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import StyleziedButton from "../StyleziedButton";
import ChangeAvatarModal from "./ChangeAvatarModal";
import styles from "./UserBio.module.css";

const UserBio = ({
  // avatarUrl = "/img/EmptyAvatar.jpg",
  alt,
  username = "",
  nickname = "",
  authorizedUserData,
  subscribed = [],
  subscribers = [],
  category = "",
  description = "",
  postsLength = 0,
}) => {
  const { avatarUrl } = useUserStore((state) => state.userData);
  const [isChangeAvatarModalOpen, setIsChangeAvatarModalOpen] = useState(false);
  const onClose = () => {
    setIsChangeAvatarModalOpen(false);
  };
  const navigate = useNavigate();
  const handleSubscribe = () => {};
  return (
    <div className={styles.userBio}>
      <ChangeAvatarModal
        isModalOpen={isChangeAvatarModalOpen}
        onClose={onClose}
      />
      <div className={styles.userBio__wrapper}>
        <div
          className={`${styles.avatar} ${
            nickname === authorizedUserData.nickname ? "cursorPointer" : ""
          }`}
          onClick={() =>
            nickname === authorizedUserData.nickname &&
            setIsChangeAvatarModalOpen(true)
          }
        >
          <img
            src={avatarUrl}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "/img/EmptyAvatar.jpg";
            }}
            alt={alt}
          />
        </div>
        <div className={styles.userBio__lines}>
          <div className={styles.userBio__line}>
            <p className={styles.userBio__nickname}>{nickname}</p>
            <StyleziedButton
              classname={styles.userBio__button}
              children={
                nickname === authorizedUserData.nickname
                  ? "Редактировать профиль"
                  : "Подписаться"
              }
              onClick={() => {
                nickname === authorizedUserData.nickname
                  ? navigate("/accounts/edit")
                  : handleSubscribe();
              }}
              primary={nickname !== authorizedUserData.nickname}
            />
            {/* <StyleziedButton
              classname={styles.userBio__button}
              children={"Рекламные инструменты"}
              onClick={() => console.log(1)}
            /> */}
          </div>
          <div className={styles.userBio__line}>
            <div className={styles.userBio__string}>
              <span className={styles.userBio__string_value}>
                {postsLength}
              </span>{" "}
              публикаций
            </div>
            <div className={styles.userBio__string}>
              <span className={styles.userBio__string_value}>
                {subscribers.length}
              </span>{" "}
              подписчиков
            </div>
            <div className={styles.userBio__string}>
              <span className={styles.userBio__string_value}>
                {subscribed.length}
              </span>{" "}
              подписок
            </div>
          </div>
          <div className={`${styles.userBio__line} ${styles.userBio__about}`}>
            <div className={`${styles.userBio__about_string} fw500`}>
              {username}
            </div>
            <div
              className={`${styles.userBio__about_string} secondary-text--color`}
            >
              {category}
            </div>
            <div className={styles.userBio__about_string}>{description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBio;
