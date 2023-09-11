import {collection, doc, getDoc, getDocs, query, runTransaction, where,} from "firebase/firestore";
import {create} from "zustand";
// import { API_ENDPOINT } from "../../api/Api";
import {db} from "../../firebase";
import {useAppStore} from "../useAppStore";

// const URL = "/users";
const uploadedUsers = useAppStore.getState().uploadedUsers;

export interface IInitialState {
    id: number,
    username: string,
    nickname: string,
    avatarUrl: string
    description: string,
    url: string,
    subscribers: any[],
    subscribed: any[],
    uid?: string
}

export interface IAuthorizedUserState extends IInitialState{
    uid: string,
    accessToken: string,
    email: string,
    isAuth: boolean,
}

interface IUserStore {
    userData: any,
    authorizedUserData: any,
    isUserLoading: boolean,
    isAuthorizedUserLoading: boolean,
    isUserError: boolean,
    isAuthorizedUserError: boolean,
    isMutateUserLoading: boolean,
    isMutateUserError: boolean,
    isSignedOut: boolean,
    setIsSignedOut: (bool: boolean) => void,
    mutateUserData: ({userUid, username, nickname, description}: { userUid: string, username: string, nickname: string, description: string }) => void,
    setAuthorizedUser: ({uid, accessToken, email}: { uid: string, accessToken: string, email: string }) => void,
    getUser: (nickname: string) => void,
    getAuthorizedUser: (user: any) => void,
    setAvatar: (userUid: string, newAvatarUrl: string) => void,
}

const initialState: IInitialState = {
    id: 1,
    username: "",
    nickname: "",
    avatarUrl: "/img/EmptyAvatar.jpg",
    description: "",
    url: "",
    subscribers: [],
    subscribed: [],
};
const authorizedUserState: IAuthorizedUserState = {
    ...initialState,
    uid: "",
    accessToken: "",
    email: "",
    isAuth: false,
};

export const useUserStore = create<IUserStore>((set, get) => ({
    userData: initialState,
    authorizedUserData: {
        ...initialState,
        ...authorizedUserState,
    },
    isUserLoading: true,
    isAuthorizedUserLoading: true,
    isUserError: false,
    isAuthorizedUserError: false,
    isMutateUserLoading: false,
    isMutateUserError: false,
    isSignedOut: false,
    setIsSignedOut: (bool) => {
        set({isSignedOut: bool});
    },
    mutateUserData: async ({userUid, username, nickname, description}) => {
        set({
            isMutateUserLoading: true,
            isMutateUserError: false,
        });

        try {
            const userRef = doc(db, "users", userUid);
            await runTransaction(db, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists()) {
                    throw "Document does not exist!";
                }
                transaction.update(userRef, {
                    username: username,
                    nickname: nickname,
                    description: description,
                });
            });
            set((state) => ({
                isMutateUserLoading: false,
                authorizedUserData: {
                    ...state.authorizedUserData,
                    username: username,
                    nickname: nickname,
                    description: description,
                },
            }));
        } catch (e: any) {
            // This will be a "population is too big" error.
            console.error(e);
            set({
                isMutateUserLoading: false,
                isMutateUserError: e,
            });
        }
    },
    setAuthorizedUser: ({uid = "", accessToken = "", email = ""}) => {
        const authorizedUserData = get().authorizedUserData;
        set({
            authorizedUserData: {
                ...authorizedUserData,
                uid,
                accessToken,
                email,
                isAuth: !!email,
            },
        });
    },
    getUser: async (nickname) => {
        set({isUserLoading: true});
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("nickname", "==", nickname));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs)
        if (querySnapshot.docs.length > 0) {
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                // @ts-ignore
                // @ts-ignore


                set({
                    userData: {...doc.data(), uid: doc.id},
                    isUserLoading: false,
                });

            });
        } else {
            set({
                userData: initialState,
                isUserError: true,
            });

        }

    },
    getAuthorizedUser: async (user) => {
        set({
            isAuthorizedUserLoading: true,
        });
        const authorizedUserData = get().authorizedUserData;
        const uid = user.uid

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // console.log("Document:", docSnap);
            // console.log("Document data:", docSnap.data());

            const user = docSnap.data();

            //Save Authorized User Data to useAppStore
            useAppStore.setState({
                uploadedUsers: [
                    ...uploadedUsers,
                    {
                        avatarUrl: user.avatarUrl,
                        nickname: user.nickname,
                        uid: uid,
                    },
                ],
            });

            //Save Authorized Data to special variable
            set({
                isAuthorizedUserLoading: false,
                authorizedUserData: {...authorizedUserData, ...user},
            });
        } else {
            console.log("No such document!");
        }
    },
    setAvatar: async (userUid, newAvatarUrl) => {
        try {
            const userRef = doc(db, "users", userUid);
            await runTransaction(db, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists()) {
                    throw "Document does not exist!";
                }
                // const newAvatar = userDoc.data().population + 1;
                transaction.update(userRef, {avatarUrl: newAvatarUrl});
            });
            set((state) => ({
                authorizedUserData: {
                    ...state.authorizedUserData,
                    avatarUrl: newAvatarUrl,
                },
            }));
        } catch (e) {
            // This will be a "population is too big" error.
            console.error(e);
        }
    },
}));
