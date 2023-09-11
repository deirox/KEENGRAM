import React, { useEffect, useRef } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { usePostsStore } from "../../store/usePostsStore";
import UserBio from "../../components/UserBio";
import styles from "./ProfilePage.module.css";
import ErrorComponent from "../../components/ErrorComponent";
import LoaderComponent from "../../components/LoaderComponent";
import ProfilePagePost from "./ProfilePagePost";

const ProfilePage = () => {
  const navigate = useNavigate()
  const getUser = useUserStore((state) => state.getUser);
  const isUserLoading = useUserStore((state) => state.isUserLoading);
  const isUserError = useUserStore((state) => state.isUserError);
  const userData = useUserStore((state) => state.userData);
  const authorizedUserData = useUserStore((state) => state.authorizedUserData);
  const getUserPosts = usePostsStore((state) => state.getUserPosts);
  const userPosts = usePostsStore((state) => state.userPosts);
  const isUserPostsLoading = usePostsStore((state) => state.isUserPostsLoading);
  const isUserPostsError = usePostsStore((state) => state.isUserPostsError);

  const { userNickname } = useParams();

  const effectRun = useRef(false);

  useEffect(() => {
    if (!effectRun.current) {
      getUser(userNickname);
      if (userData.uid) {
        getUserPosts(userData.uid);
      }
      return () => {
        effectRun.current = true;
      };
    }
  }, []);
  return (
    <>
      {isUserLoading ? (
        isUserError ? (
          <ErrorComponent />
        ) : (
          <LoaderComponent />
        )
      ) : (
        <div className="container container__profile">
          <UserBio
            {...userData}
            authorizedUserData={authorizedUserData}
            postsLength={userPosts.length}
          />
          {isUserPostsLoading ? (
            isUserPostsError ? (
              <ErrorComponent />
            ) : (
              <LoaderComponent />
            )
          ) : userPosts.length === 0 ? (
            <p
              style={{
                display: "block",
                textAlign: "center",
                color: "rgb(var(--ig-secondary-text))",
              }}
            >
              У данного пользователя нет постов!
            </p>
          ) : (
            <div className={styles.profile_page__posts}>
              {userPosts.map((post, index) => (
                <ProfilePagePost key={index} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProfilePage;
