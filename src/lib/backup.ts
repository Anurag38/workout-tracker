import type { AppState } from "../types";
import { parseImport, serializeState } from "./db";

export interface BackupAdapter {
  readonly id: string;
  save(state: AppState): Promise<void>;
  restore(): Promise<AppState>;
}

type PrivateGitHubConfig = {
  owner: string;
  repo: string;
  token: string;
  path?: string;
  branch?: string;
};

export class PrivateGitHubBackupAdapter implements BackupAdapter {
  readonly id = "private-github";
  private readonly path: string;
  private readonly branch: string;

  constructor(private readonly config: PrivateGitHubConfig) {
    this.path = config.path ?? "liftlog-backup.json";
    this.branch = config.branch ?? "main";
  }

  private async request(method = "GET", body?: object) {
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.path}`;
    const response = await fetch(url, {
      method,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.config.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) throw new Error(`GitHub backup failed (${response.status}).`);
    return response.json();
  }

  async save(state: AppState): Promise<void> {
    let sha: string | undefined;
    try {
      const current = await this.request();
      sha = current.sha;
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("404")) throw error;
    }
    const encoded = btoa(unescape(encodeURIComponent(serializeState(state))));
    await this.request("PUT", {
      message: "Update LiftLog backup",
      content: encoded,
      branch: this.branch,
      ...(sha ? { sha } : {}),
    });
  }

  async restore(): Promise<AppState> {
    const file = await this.request();
    const decoded = decodeURIComponent(escape(atob(String(file.content).replace(/\n/g, ""))));
    return parseImport(decoded);
  }
}
