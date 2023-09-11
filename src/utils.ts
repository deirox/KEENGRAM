const dayjs = require("dayjs");
var isYesterday = require("dayjs/plugin/isYesterday");

export const calculatePostWeight = (post: any) => {
    const dateNow = dayjs(dayjs().format());
    const dateDiff = dateNow.diff(post.created_date, "day");
    var dateRate;
    switch (dateDiff) {
        case 0:
        case 1:
            dateRate = 2;
            break;
        case 2:
            dateRate = 1;
            break;
        default:
            dateRate = 0;
    }
    const postWeight = Number(
        post.likes?.length + post.comments?.length + dateRate
    );
    return postWeight;
};

const utils = {
    calculatePostWeight: (post: any) => {
        const dateNow = dayjs(dayjs().format());
        const dateDiff = dateNow.diff(post.created_date, "day");
        var dateRate;
        switch (dateDiff) {
            case 0:
                dateRate = 3;
                break;
            case 1:
                dateRate = 2;
                break;
            case 2:
                dateRate = 1;
                break;
            default:
                dateRate = 0;
        }
        const postWeight = Number(
            post.likes?.length + post.comments?.length + dateRate
        );
        return postWeight;
    },
    makeid: (length: number) => {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    },
};
export default utils;
