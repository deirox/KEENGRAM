import React from "react";
import {create} from "zustand";

interface IModalStore {
    isCreatePostModalOpen: boolean,
    setIsCreatePostModalOpen: (bool: boolean) => void,
    children: any,
}

export const useModalStore = create<IModalStore>((set, get) => ({
    isCreatePostModalOpen: false,
    setIsCreatePostModalOpen: (bool: boolean) => set({isCreatePostModalOpen: bool}),
    children: React.Component,
    // <Component/>
}));
