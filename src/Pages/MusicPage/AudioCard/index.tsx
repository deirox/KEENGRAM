import React, {useRef, useState} from "react";
import styles from "./AudioCard.module.css";
import {HiPlay, HiStop} from "react-icons/hi";

interface IAudioCard {
    uid: string,
    artist: string,
    title: string,
    url: string,
    img_url: string
}

const AudioCard = ({
                       uid,
                       artist,
                       title,
                       url,
                       img_url
                   }: IAudioCard
    ) => {
        const audioRef: React.MutableRefObject<any> = useRef(null)
        const tumblerRef: React.MutableRefObject<any> = useRef(null)
        const audioCardInfoRef: React.MutableRefObject<any> = useRef(null)

        const [isAudioPlaying, setIsAudioPlaying] = useState(false)
        const [duration, setDuration] = useState(0)
        const [currentTime, setCurrentTime] = useState(0)
        const [volume, setVolume] = useState(0.5)
        const [mouseMoveData, setMouseMoveData] = useState({start: 0, stop: 0})
        const [isMouseClicked, setIsMouseClicked] = useState(false)

        const maxDurationLineSize: number = audioCardInfoRef?.current?.clientWidth

        const durationLineUnit: number = maxDurationLineSize / duration
        const curDurationLineSize: number = currentTime * durationLineUnit

        const maxVolumeLineSize: number = 48

        const volumeLineUnit: number = maxVolumeLineSize / 100
        const curVolumeLineSize: number = volume * 100 * volumeLineUnit

        React.useEffect(() => {
            audioRef.current.volume = volume
        }, [volume])

        const minutes = Math.floor(currentTime / 60)
        const seconds = currentTime - (Math.floor(currentTime / 60) * 60)
        const secondsFormated = seconds < 10 ? `0${seconds}` : seconds

        // React.useEffect(() => {
        //     if (audioRef) {
        //         let audioRefDuration = audioRef.current.duration
        //         console.log(audioRefDuration)
        //         setDuration(Math.trunc((audioRefDuration)))
        //     }
        // }, [audioRef])
        const onAudioPlayButton = () => {
            setIsAudioPlaying(true)
            if (audioRef) {
                // let duration = audioRef.current.duration
                // setDuration(Math.trunc((duration)))
                setInterval(() => {
                    let curTime = Math.trunc(audioRef.current.currentTime)
                    setCurrentTime(curTime)
                }, 500)
                audioRef.current.play()
            }

        }
        const onAudioPauseButton = () => {
            setIsAudioPlaying(false)
            if (audioRef) {
                audioRef.current.pause()
            }
        }

        return <div className={styles.music_page__audio_card}>
            <div className={styles.music_page__audio_card__wrapper}>
                <div className={styles.music_page__audio_card__inner}>
                    <div className={styles.music_page__audio_card__img}>
                        <img src={img_url}/>
                    </div>
                    <div className={styles.music_page__audio_card__info}
                         ref={audioCardInfoRef}>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div>
                                <p>{artist}</p>
                                <p>{title}</p>
                            </div>
                            <p>{minutes}:{secondsFormated}</p>
                        </div>
                        <div className={styles.music_page__audio_card__info_duration_line}
                             style={{
                                 position: 'relative',
                                 width: curDurationLineSize + "px",
                                 height: '.25rem',
                                 backgroundColor: "#F4F9FC"
                             }}>
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: '.25rem',
                                width: maxDurationLineSize + "px",
                                backgroundColor: "rgba(98, 100, 97, .25)",
                            }}/>
                        </div>
                    </div>
                </div>
                <div style={{margin: '0 auto'}}>

                    <div className={styles.music_page__audio_card__info_volume_line}
                         style={{
                             position: "relative",
                             backgroundColor: "rgba(98, 100, 97, .25)",
                             width: ".25rem",
                             height: "50px",
                         }} onMouseDown={(e) => {
                        const min = tumblerRef.current.offsetParent.offsetTop
                        const max = min + maxVolumeLineSize
                        if (e.clientY > min || e.clientY < max) {
                            const v = (e.clientY - min) / volumeLineUnit / 100
                            if (v > 1 || v < 0) return
                            setVolume(1 - v)
                        }
                        setIsMouseClicked(true)
                    }} onMouseUp={() => setIsMouseClicked(false)}
                         onMouseMove={(e: React.MouseEvent) => {
                             if (!isMouseClicked) return;
                             const min = tumblerRef.current.offsetParent.offsetTop
                             const max = min + maxVolumeLineSize
                             if (e.clientY > min || e.clientY < max) {
                                 const v = (e.clientY - min) / volumeLineUnit / 100
                                 if (v > 1 || v < 0) return
                                 setVolume(1 - v)
                             }
                         }}>
                        <div style={{
                            position: "absolute",
                            bottom: 0,
                            width: '.25rem',
                            height: curVolumeLineSize + "px",
                            backgroundColor: "#F4F9FC",
                        }}/>
                        <div ref={tumblerRef} style={{
                            position: "absolute",
                            bottom: (curVolumeLineSize - 6) + "px",
                            left: "-4px",
                            height: "12px",
                            width: "12px",
                            borderRadius: "8px",
                            backgroundColor: "rgb(244, 249, 252)",
                            cursor: "pointer"
                        }}>
                        </div>
                    </div>

                </div>
                <div>
                    {audioRef.current !== undefined && isAudioPlaying ?
                        <HiStop style={{cursor: "pointer"}} size={48}
                                onClick={() => onAudioPauseButton()}/>
                        :
                        <HiPlay style={{cursor: "pointer"}} size={48} onClick={() => onAudioPlayButton()}/>}


                </div>
            </div>
            <audio ref={audioRef} id={uid} src={url}
                   onCanPlay={(e: React.BaseSyntheticEvent) => setDuration(e.target.duration)} controls={false}/>

        </div>

    }
;

export default AudioCard

