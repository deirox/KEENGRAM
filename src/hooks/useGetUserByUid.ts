import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";
import {useAppStore} from "../store/useAppStore";

export default async (authorUid: string) => {
    //Local state with uploaded users
    const uploadedUsers = useAppStore.getState().uploadedUsers;

    //Check state of availability of current user data
    const filteredUser = uploadedUsers.filter((user) => user.uid === authorUid);

    if (filteredUser.length === 0) {
        //If state not available of current user data
        const userRef = await doc(db, "users", authorUid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const user = await userSnap.data();
            const authorData = {
                uid: authorUid,
                nickname: user.nickname,
                avatarUrl: user.avatarUrl,
            };

            //Save User Data to useAppStore
            useAppStore.setState({
                uploadedUsers: [...uploadedUsers, authorData],
            });
        } else {
            console.log("Произошла ошибка при обработке поста!");
        }
        return false;
    } else {
        //If state is available of current user data
        return filteredUser[0];
    }
};
