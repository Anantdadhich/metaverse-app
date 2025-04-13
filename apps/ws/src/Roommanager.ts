
import { OutgoingMessage } from "./data";
import { User } from "./User";

export class RoomManager {
  private rooms: Map<string, User[]> = new Map();

  private static instance: RoomManager;

  private constructor() {
    this.rooms = new Map();
  }

  static getInstance(): RoomManager {
    if (!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }

  public addUser(spaceId: string, user: User): void {
    if (!this.rooms.has(spaceId)) {
      this.rooms.set(spaceId, [user]);
    } else {
      const existingUsers = this.rooms.get(spaceId) || [];
      existingUsers.push(user);
      this.rooms.set(spaceId, existingUsers);
    }
  }
  public removeUser(user: User, spaceId: string): void {
    if (!this.rooms.has(spaceId)) {
      return;
    }
    this.rooms.set(
      spaceId,
      (this.rooms.get(spaceId)?.filter((u) => u.id !== user.id) ?? [])
    );
  }

  public broadcast(message: OutgoingMessage, user: User, roomId: string): void {
    if (!this.rooms.has(roomId)) {
      return;
    }
    this.rooms.get(roomId)?.forEach((u) => {
      if (u.id !== user.id) {
        u.send(message);
      }
    });
  }

  
  public getUsersInRoom(roomId: string): User[] {
    return this.rooms.get(roomId) ?? [];
  }
}