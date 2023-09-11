import axios from "axios";
import {create} from "zustand";
import utils from "../../utils";
import {API_ENDPOINT} from "../../api/Api";
import {db} from "../../firebase";
import {addDoc, collection, doc, getDoc, getDocs, orderBy, query, runTransaction, where,} from "firebase/firestore";
import useGetUserByUid from "../../hooks/useGetUserByUid";

export interface IPostInitialState {
    images: any[],
    likes: any[] | undefined[],
    created_date: string | number,
    comments: any[],
    author: { uid: string, avatarUrl: string, nickname: string } | string,
}

// const postInitialState: IPostInitialState = {
//     images: [],
//     likes: [],
//     created_date: "",
//     comments: [],
//     author: {uid: "", avatarUrl: "", nickname: ""},
// };

const URL = "/posts";

interface IPostStore {
    posts: any[],
    userPosts: any[],
    isUserPostsLoading: boolean,
    isUserPostsError: any,
    isPostsLoading: boolean,
    isPostsError: any,
    totalCount: any,
    isMutatePostsLoading: boolean,
    isMutatePostsError: any,
    mutateLike: ({postUid, userUid, isUserPosts}: { postUid: string, userUid: string, isUserPosts: boolean }) => void,
    addComment: (postUid: string, nickname: string, text: string, isUserPosts: boolean) => void,
    getPosts: (page?: number, limitCount?: number) => void,
    getMorePosts: (page?: number, limitCount?: number) => void,
    getUserPosts: (userUid: string, limitCount: number) => void,
    sortPosts: (posts: any[]) => void,
    addPost: (post: any) => void
}

export const usePostsStore = create<IPostStore>((set, get) => ({
    posts: [],
    userPosts: [],
    isUserPostsLoading: true,
    isUserPostsError: false,
    isPostsLoading: true,
    isPostsError: false,
    totalCount: false,
    isMutatePostsLoading: false,
    isMutatePostsError: false,
    mutateLike: async ({postUid, userUid, isUserPosts = false}) => {
        // console.log(postUid, userUid);
        try {
            set({
                isMutatePostsLoading: true,
            });
            var posts = [];
            switch (isUserPosts) {
                case true:
                    posts = get().userPosts;
                    break;
                default:
                    posts = get().posts;
            }
            const oldPost = posts.find((post) => post.uid === postUid);
            var newPost = {};
            // console.log("likes", likes);

            if (oldPost.likes.includes(userUid)) {
                newPost = {
                    ...oldPost,
                    likes: [
                        ...oldPost.likes.filter((like: any) => String(like) !== String(userUid)),
                    ],
                };
            } else {
                newPost = {
                    ...oldPost,
                    likes: [...oldPost.likes, userUid],
                };
            }
            const newPostWeighted: any = {
                ...newPost,
                post_weight: utils.calculatePostWeight(newPost),
            };
            const newPosts = posts.map((post) => {
                if (post.uid === postUid) {
                    return newPostWeighted;
                } else return post;
            });
            const userRef = doc(db, "posts", postUid);
            await runTransaction(db, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists()) {
                    console.warn("Произошла неизвестная ошибка!");
                    return;
                }
                transaction.update(userRef, {
                    likes: newPostWeighted.likes,
                    post_weight: await utils.calculatePostWeight(newPostWeighted),
                });
                switch (isUserPosts) {
                    case true:
                        set({
                            isMutatePostsLoading: false,
                            userPosts: [...newPosts],
                        });
                        break;
                    default:
                        set({
                            isMutatePostsLoading: false,
                            posts: [...newPosts],
                        });
                }
            });
        } catch (error) {
            set({
                isMutatePostsError: error,
            });
        }
    },
    addComment: async (postUid, nickname, text, isUserPosts = false) => {
        set({
            isMutatePostsLoading: true,
        });
        try {
            set({
                isMutatePostsLoading: true,
            });
            var posts = [];
            switch (isUserPosts) {
                case true:
                    posts = get().userPosts;
                    break;
                default:
                    posts = get().posts;
            }
            const oldPost = posts.find((post) => post.uid === postUid);
            const newComments = [
                ...oldPost.comments,
                {
                    nickname: nickname,
                    text: text,
                },
            ];
            const newPost = {...oldPost, comments: newComments};
            const newPostWeighted = {
                ...newPost,
                post_weight: utils.calculatePostWeight(newPost),
            };
            const newPosts = posts.map((post) => {
                if (post.uid === postUid) {
                    return newPostWeighted;
                } else return post;
            });

            const userRef = doc(db, "posts", postUid);
            await runTransaction(db, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists()) {
                    console.warn("Произошла неизвестная ошибка!");
                    return;
                }
                transaction.update(userRef, {
                    comments: newPostWeighted.comments,
                    post_like: utils.calculatePostWeight(newPostWeighted),
                });

                switch (isUserPosts) {
                    case true:
                        set({
                            isMutatePostsLoading: false,
                            userPosts: [...newPosts],
                        });
                        break;
                    default:
                        set({
                            isMutatePostsLoading: false,
                            posts: [...newPosts],
                        });
                }
            });
        } catch (error) {
            set({
                isMutatePostsError: error,
            });
        }
    },
    getPosts: async (page, limitCount) => {
        set({
            posts: [],
            isPostsLoading: true,
            isPostsError: false,
        });

        // const sortPosts = get().sortPosts;
        // const authorizedUserData = get().authorizedUserData;
        const postsRef = collection(db, "posts");
        const q = query(
            postsRef,
            orderBy("post_weight", "desc")
            // limit(limitCount)
        );
        // console.log(q);
        const querySnapshot = await getDocs(q);

        try {
            // console.log("u", uploadedUsers);
            querySnapshot.forEach(async (document) => {
                // doc.data() is never undefined for query doc snapshots
                const post = document.data();
                const authorUid = post.author;

                const user = await useGetUserByUid(authorUid);

                if (user) {
                    const newPost = {
                        ...post,
                        uid: document.id,
                        author: user,
                    };
                    set((state) => ({
                        posts: [...state.posts, newPost],
                        isPostsLoading: false,
                    }));
                }
            });
        } catch (error) {
            console.warn("Произошла ошибка при получении постов!");
            set({posts: [], isPostsLoading: true, isPostsError: error});
        }
    },
    getMorePosts: async (page, limitCount) => {
        await axios
            .get(`${API_ENDPOINT}${URL}?_page=${page}&_limit=${limitCount}`)
            .then((response) => {
                let responseData = [...response.data];
                set((state) => ({
                    posts: [...state.posts, ...responseData],
                    totalCount: response.headers["x-total-count"],
                    isPostsLoading: false,
                }));
            })
            .catch((error) => {
                console.warn("Произошла ошибка при получении постов!");
                set({isPostsError: error});
            });
    },
    getUserPosts: async (userUid, limitCount = 5) => {
        set({
            userPosts: [],
            isUserPostsLoading: true,
            isUserPostsError: false,
        });

        try {
            // const posts = get().posts;
            // const sortPosts = get().sortPosts;
            // const authorizedUserData = get().authorizedUserData;
            const postsRef = collection(db, "posts");
            // console.log("userUid: ", userUid);
            const q = query(
                postsRef,
                where("author", "==", userUid),
                orderBy("created_date", "desc")
                // limit(limitCount)
            );
            // console.log(q);

            const querySnapshot = await getDocs(q);
            if (
                querySnapshot.forEach((doc) => {
                    return doc;
                }) === undefined
            ) {
                set({
                    userPosts: [],
                    isUserPostsLoading: false,
                    isUserPostsError: false,
                });
            }
            querySnapshot.forEach(async (document) => {
                // doc.data() is never undefined for query doc snapshots
                const post = document.data();
                const authorUid = document.data().author;
                const userRef = doc(db, "users", authorUid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    // console.log("Document data:", docSnap.data());
                    const user = userSnap.data();
                    const authorData = {
                        uid: authorUid,
                        nickname: user.nickname,
                        avatarUrl: user.avatarUrl,
                    };
                    set((state) => ({
                        userPosts: [
                            ...state.userPosts,
                            {...post, uid: document.id, author: authorData},
                        ],
                        isUserPostsLoading: false,
                        isUserPostsError: false,
                    }));
                } else {
                    console.log("Такого пользователя не существует!");
                }
            });
        } catch (error) {
            set({isUserPostsLoading: true, isUserPostsError: error});
        }
    },
    sortPosts: (posts) => {
        const newPosts = posts.sort((a, b) => {
            return b.post_weight - a.post_weight;
        });
        set({posts: [...newPosts]});
    },
    addPost: async (post) => {
        const weightedPost = {
            ...post,
            author: post.author.uid,
            post_weight: utils.calculatePostWeight(post),
        };
        const weightedPostLocal = {
            ...post,
            post_weight: utils.calculatePostWeight(post),
        };

        console.log(weightedPost);
        await addDoc(collection(db, "posts"), weightedPost);
        set((state) => ({
            posts: [...state.posts, weightedPostLocal],
            userPosts: [...state.posts, weightedPostLocal],
        }));
        return {...weightedPost};
    },
}));
