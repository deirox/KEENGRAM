import React, {useState} from "react";
import {useFirebaseStore} from "../../store/useFirebaseStore";
import {useModalStore} from "../../store/useModalStore";
import {IPostInitialState, usePostsStore} from "../../store/usePostsStore";
import {useUserStore} from "../../store/useUserStore";
import LoaderComponent from "../LoaderComponent";
import ModalBody from "../ModalBody";
import AddImages from "./AddImages";
import styles from "./CreatePostModal.module.css";
import GeneratePost from "./GeneratePost";

const CreatePostModal = () => {
    const isCreatePostModalOpen = useModalStore(
        (state) => state.isCreatePostModalOpen
    );
    const setIsCreatePostModalOpen = useModalStore(
        (state) => state.setIsCreatePostModalOpen
    );
    const addPost = usePostsStore((state) => state.addPost);
    const authorizedUserData = useUserStore((state) => state.authorizedUserData);

    const uploadImages = useFirebaseStore((state) => state.uploadImages);
    const uploadedImages = useFirebaseStore((state) => state.uploadedImages);
    const deleteImages = useFirebaseStore((state) => state.deleteImages);

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [postDesc, setPostDesc] = useState("");

    const stepArray = [
        {title: "Создание публикации", name: "addImages"},
        {title: "Создание публикации", name: "generatePost"},
        {title: "Публикация", name: "generatePost"},
        {title: "Вы поделились публикацией", name: "generatePost"},
    ];

    const inputOnChange = async (e: React.BaseSyntheticEvent) => {
        const files: File[] = Array.from(e.target.files);
        var readerArray = [];
        await uploadImages(files, files.length);
        files.forEach(async (file) => {
            if (!file.type.match("image")) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                readerArray.push({
                    original: ev.target.result,
                    thumbnail: ev.target.result,
                    event: ev,
                });
                setImages((images) => [
                    ...images,
                    {
                        original: ev.target.result,
                        thumbnail: ev.target.result,
                    },
                ]);
            };
            reader.readAsDataURL(file);
        });
        setCurrentStepIndex(currentStepIndex + 1);
    };
    // console.log("uploadedImages: ", uploadedImages);

    // console.log("images: ", images);
    const onClose = () => {
        setIsCreatePostModalOpen(false);
        setImages([]);
        setCurrentStepIndex(0);
    };
    return (
        <ModalBody
            isModalOpen={isCreatePostModalOpen}
            onClose={onClose}
            modalClassname={
                currentStepIndex > 0 && currentStepIndex < 2
                    ? styles.create_post_modal___big
                    : styles.create_post_modal
            }
            overlayClassName={styles.create_post_modal__overlay}
        >
            <div className={styles.create_post_modal__wrapper}>
                <div className={styles.create_post_modal__top}>
                    {currentStepIndex > 0 && currentStepIndex < 2 && (
                        <button
                            className={styles.create_post_modal__back}
                            onClick={() => {
                                switch (currentStepIndex) {
                                    case 1:
                                        deleteImages();
                                        setImages([]);
                                        setCurrentStepIndex(currentStepIndex - 1);
                                    case 0:
                                        return;
                                    default:
                                        setCurrentStepIndex(currentStepIndex - 1);
                                }
                            }}
                        >
                            <svg
                                aria-label="Назад"
                                // className="_ab6-"
                                color="rgb(245, 245, 245)"
                                fill="rgb(245, 245, 245)"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                            >
                                <line
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    x1="2.909"
                                    x2="22.001"
                                    y1="12.004"
                                    y2="12.004"
                                ></line>
                                <polyline
                                    fill="none"
                                    points="9.276 4.726 2.001 12.004 9.276 19.274"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                ></polyline>
                            </svg>
                        </button>
                    )}
                    <p className={styles.create_post_modal__title}>
                        {stepArray[currentStepIndex].title}
                    </p>
                    {currentStepIndex > 0 && currentStepIndex < 2 && (
                        <button
                            className={styles.create_post_modal__forward}
                            // {
                            //   "id": 1,
                            //   "post_weight": 2,
                            //   "imgUrl": "https://mobimg.b-cdn.net/v3/fetch/fc/fc97db329bd4482025eaa1e3961dc80e.jpeg?w=1470&r=0.5625",
                            //   "likes": [],
                            //   "created_date": "2023-03-02",
                            //   "comments": [
                            //     {
                            //       "nickname": "keenguy",
                            //       "text": "test1"
                            //     },
                            //     {
                            //       "nickname": "keenguy",
                            //       "text": "dsa"
                            //     }
                            //   ],
                            //   "author_id": 1,
                            //   "author_nickname": "keenguy",
                            //   "author_avatarUrl": "https://ru-static.z-dn.net/files/d38/45833edf494ba8dc483de2773abc1bf3.png",
                            //   "post_like": 2
                            // }
                            onClick={async () => {
                                const comments =
                                    postDesc.length > 0
                                        ? [
                                            {
                                                nickname: authorizedUserData.nickname,
                                                text: postDesc,
                                            },
                                        ]
                                        : [];
                                const post:IPostInitialState = {
                                    images: uploadedImages,
                                    likes: [],
                                    created_date: Date.now(),
                                    comments: comments,
                                    author: {
                                        uid: authorizedUserData.uid,
                                        nickname: authorizedUserData.nickname,
                                        avatarUrl: authorizedUserData.avatarUrl,
                                    },
                                    // author_nickname: authorizedUserData.nickname,
                                    // author_avatarUrl: authorizedUserData.avatarUrl,
                                };
                                setCurrentStepIndex(2);
                                await addPost(post);
                                setCurrentStepIndex(3);
                            }}
                        >
                            Поделиться
                        </button>
                    )}
                </div>
                <AddImages
                    active={stepArray[0] === stepArray[currentStepIndex]}
                    inputOnChange={inputOnChange}
                />
                <GeneratePost
                    active={stepArray[1] === stepArray[currentStepIndex]}
                    images={images}
                    authorizedUserData={authorizedUserData}
                    postDesc={postDesc}
                    setPostDesc={setPostDesc}
                />
                {stepArray[2] === stepArray[currentStepIndex] && (
                    <div>
                        <LoaderComponent text=""/>
                    </div>
                )}
                {stepArray[3] === stepArray[currentStepIndex] && (
                    <div>
                        <LoaderComponent text="Публикация размещена"/>
                    </div>
                )}
            </div>
        </ModalBody>
    );
};

export default CreatePostModal;
