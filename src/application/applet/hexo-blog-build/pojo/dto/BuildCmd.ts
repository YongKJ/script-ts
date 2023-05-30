
export class BuildCmd {

    private constructor() {
    }

    public static clean_hexo_blog(): string {
        return "D:\\Document\\MyCodes\\Gitea\\github-hexo-blog\\node_modules\\.bin\\hexo.CMD clean";
    }

    public static build_hexo_blog(): string {
        return "D:\\Document\\MyCodes\\Gitea\\github-hexo-blog\\node_modules\\.bin\\hexo.CMD generate";
    }

}