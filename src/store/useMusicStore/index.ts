import {collection, getDocs} from "firebase/firestore";
import {create} from "zustand";
import {db} from "../../firebase";
import axios, {AxiosRequestConfig, Method} from "axios";
import utils from "../../utils";
import {useUserStore} from "../useUserStore";

interface IMusicStore {
    allAudios: any[],
    userAudios: any[],
    uploadedAudios: any[],
    isGetAudiosError: boolean,
    isGetAudiosLoading: boolean,
    isAudioUploading: boolean,
    isAudioUploadingError: any,
    getAudios: (userUid: string) => void,
    uploadAudio: (files: ArrayBuffer, fileData: {
        artist: string,
        title: string,
        img_url?: string
    }) => void
}


async function yandexResponse(method: Method, url: string, authorization = true, options?: AxiosRequestConfig<any>) {
    if (!authorization) {
        return await axios(url, {
            ...options,
            method: method,
        }).then(res => res.data)
    } else return await axios(url, {
        ...options,
        method: method,
        headers: {
            'Authorization': "OAuth " + "y0_AgAAAABweXJmAAputAAAAADrr0EU-NfNTVuJRNaRgnamV8vqSw4wT-4",
            'Content-Type': 'application/json'
        },

    }).then(res => res.data)

}


export const useMusicStore = create<IMusicStore>((set, get) => ({
    allAudios: [],
    userAudios: [],
    uploadedAudios: [],
    isGetAudiosLoading: true,
    isGetAudiosError: false,
    isAudioUploading: true,
    isAudioUploadingError: false,
    getAudios: async (userUid) => {
        const querySnapshot = await getDocs(collection(db, `audios`,));
        var cachedAudio: any[] = []

        try {
            querySnapshot.forEach(async (doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());

                    const {author, artist, title, path, order, img_url} = doc.data()
                    const audioFile: any = await yandexResponse("GET", "https://cloud-api.yandex.net/v1/disk/resources", true, {
                        params: {
                            path: `${path}`
                        }
                    })
                    const audio = {url: audioFile.file, uid: doc.id, author, artist, title, img_url, path, order}
                    // console.log(audio)
                    // console.log(doc.data())
                    cachedAudio = [{...doc.data(), uid: doc.id}]
                    // [...state.allAudios, doc.data()]

                    const allAudio = get().allAudios
                    const filteredUser = allAudio.filter((audio) => audio.uid === doc.id);
                    if (filteredUser.length === 0) {
                        set(state => ({
                            allAudios: [...state.allAudios, audio]
                        }))
                    } else return
                }
            )
            set(({
                isGetAudiosLoading: false,
            }))
        } catch
            (error) {
            console.error("Произошла ошибка серверов Яндекс Диск")
            console.error(error)
            set(({
                isGetAudiosLoading: false,
                isGetAudiosError: true
            }))
        }
    }
    ,
    uploadAudio: async (file, fileData) => {
        set(state => ({
            uploadedAudios: [],
            isAudioUploading: true,
            isAudioUploadingError: false
        }))

        const uid = utils.makeid(20)
        const path = `/KEENGRAM/Music/${uid}.mp3`
        const res = await yandexResponse("GET", "https://cloud-api.yandex.net/v1/disk/resources/upload", true, {params: {path: path}})

        const authorizedUserData = useUserStore.getState().authorizedUserData
        const allAudios = get().allAudios

        // console.log(res)
        if (res.href) {
            const data = {
                artist: fileData.artist,
                author: authorizedUserData.uid,
                img_url: fileData.img_url,
                order: 0,
                path,
                title: fileData.title
            }
            const audioFile: any = await yandexResponse("GET", "https://cloud-api.yandex.net/v1/disk/resources", true, {
                params: {
                    path: `${path}`
                }
            })
            set(state => ({
                isAudioUploading: false,
                allAudios: [...allAudios, {...data, url: audioFile.file}],
                uploadedAudios: [{...data, url: audioFile.file, uid}]
            }))
        }
        return uid
    }
}))