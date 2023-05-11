import {GiteaService} from "../service/GiteaService";
import {Repository} from "gitea-js";

export class GiteaController {

    private readonly giteaService: GiteaService;

    public constructor() {
        this.giteaService = new GiteaService();
    }

    public getRepo(owner?: string, name?: string): Promise<Repository> {
        owner = owner || "DengXJ";
        name = name || "whales-web-dist";
        return this.giteaService.getRepo(owner, name);
    }

    public deleteRepo(owner?: string, name?: string): Promise<void> {
        owner = owner || "DengXJ";
        name = name || "whales-web-dist";
        return this.giteaService.deleteRepo(owner, name);
    }

    public createRepo(name?: string, description?: string, gitIgnores?: string, license?: string): Promise<Repository> {
        name = name || "whales-web-dist";
        gitIgnores = gitIgnores || "Node";
        license = license || "GPL-3.0-or-later";
        description = description || "Packaged project.";
        return this.giteaService.createRepo({
            name: name,
            license: license,
            gitignores: gitIgnores,
            description: description,
            default_branch: "master",
            trust_model: "default",
            readme: "Default",
            auto_init: true
        });
    }

}