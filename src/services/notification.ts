import { ChangelogEntry } from "../types/changelog";

export class NotificationService {
  constructor() {}

  async notifyNewChanges(entry: ChangelogEntry): Promise<void> {
    console.log(`New Change!!! ${entry}`);
  }
}
