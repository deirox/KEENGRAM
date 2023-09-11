// import axios from "axios";
import {create} from "zustand";
// import { API_ENDPOINT } from "../../api/Api";

// const uploadedUsers = useUserStore.getState().uploadedUsers;

interface IAppStore {
    posts: any[],
    uploadedUsers: any[],
}

export const useAppStore = create<IAppStore>((set, get) => ({
    posts: [],
    uploadedUsers: [],
}));
