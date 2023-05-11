
export class BuildCmd {

    private constructor() {
    }

    public static git_gc_prune(): string {
        return "git gc --prune=\"30m\"";
    }

    public static git_prune_expire(): string {
        return "git prune --expire=\"30m\" -v";
    }

    public static git_reflog_expire(): string {
        return "git reflog expire --expire-unreachable=\"30m\" --all";
    }

    public static build_whales_web(): string {
        return "yarn run build";
    }

}