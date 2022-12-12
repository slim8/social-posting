export class PostModel {

    constructor(
        public message: string,
        public hashtags: string[],
        public mentions: string[],
        public accountId: string,
        public videoTitle: string,
    ) {
        /* TODO document why this constructor is empty */
    }

}