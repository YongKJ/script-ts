import {Api, CreateRepoOption, giteaApi, Repository} from "gitea-js";
import {Global} from "../config/Global";
import fetch from "cross-fetch"

export class GiteaService {

    private readonly gitea: Api<unknown>;

    public constructor() {
        this.gitea = new giteaApi(Global.GITEA_BASE_URL, {
            token: Global.GITEA_AUTH_TOKEN,
            customFetch: fetch
        });
    }

    public async getRepo(owner: string, name: string): Promise<Repository> {
        return (await this.gitea.repos.repoGet(owner, name)).data;
    }

    public async deleteRepo(owner: string, name: string): Promise<void> {
         await this.gitea.repos.repoDelete(owner, name);
    }

    public async createRepo(option: CreateRepoOption): Promise<Repository> {
        return (await this.gitea.user.createCurrentUserRepo(option)).data;
    }

}