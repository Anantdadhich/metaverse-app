import { WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD, OutgoingMessage } from "./data";
import client from "@repo/db/client";
import { RoomManager } from "./Roommanager";

function getRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export class User {
  public id: string;
  public userId?: string;
  private spaceId?: string;
  private x: number;
  private y: number;
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.id = getRandomString(10);
    this.x = 0;
    this.y = 0;
    this.ws = ws;
    this.initHandlers();
  }

  private initHandlers(): void {
    this.ws.on("message", async (data) => {
      console.log(data);
      const parsedData = JSON.parse(data.toString());
      console.log(parsedData);

      switch (parsedData.type) {
        case "join":
          const spaceId = parsedData.payload.spaceId;
          const token = parsedData.payload.token;

          if (!token) {
            this.send({
              type: "error",
              payload: { message: "Token is missing" }
            });
            this.ws.close();
            return;
          }

          try {
            const decoded = jwt.verify(token, JWT_PASSWORD) as JwtPayload;
            const userId = decoded.userId;

            if (!userId) {
              this.send({
                type: "error",
                payload: { message: "Invalid token: userId missing" }
              });
              this.ws.close();
              return;
            }

            this.userId = userId;

            const space = await client.space.findFirst({
              where: { id: spaceId },
            });

            if (!space) {
              this.send({
                type: "error",
                payload: { message: "Space not found" }
              });
              this.ws.close();
              return;
            }

            this.spaceId = spaceId;
            this.x = Math.floor(Math.random() * space.width);
            this.y = Math.floor(Math.random() * space.height);

            RoomManager.getInstance().addUser(spaceId, this);
            this.send({
              type: "space-joined",
              payload: {
                spawn: { x: this.x, y: this.y },
                users:
                  RoomManager.getInstance()
                    .getUsersInRoom(spaceId)
                    ?.filter((x) => x.id !== this.id)
                    .map((u) => ({
                      id: u.id,
                      x: u.x,
                      y: u.y,
                    })) ?? [],
              },
            });

            RoomManager.getInstance().broadcast(
              {
                type: "user-joined",
                payload: {
                  userId: this.userId,
                  id: this.id,
                  x: this.x,
                  y: this.y,
                },
              },
              this,
              this.spaceId!
            );
          } catch (error) {
            this.send({
              type: "error",
              payload: { message: "Error verifying token" }
            });
            this.ws.close();
          }
          break;

        case "move":
          const movex = parsedData.payload.x;
          const movey = parsedData.payload.y;

          const xDisplacement = Math.abs(this.x - movex);
          const yDisplacement = Math.abs(this.y - movey);

          if (
            (xDisplacement === 1 && yDisplacement === 0) ||
            (xDisplacement === 0 && yDisplacement === 1)
          ) {
            this.x = movex;
            this.y = movey;

            RoomManager.getInstance().broadcast(
              {
                type: "movement",
                payload: {
                  userId: this.userId,
                  id: this.id,
                  x: this.x,
                  y: this.y,
                },
              },
              this,
              this.spaceId!
            );
            return;
          }

          this.send({
            type: "movement-rejected",
            payload: { x: this.x, y: this.y },
          });
          break;

        // New WebRTC cases
        case "webrtc-offer":
          const offerTargetId = parsedData.payload.targetId;
          const offer = parsedData.payload.offer;

          if (!this.spaceId || !offerTargetId || !offer) {
            this.send({
              type: "webrtc-error",
              payload: { message: "Missing spaceId, targetId, or offer" },
            });
            return;
          }

          RoomManager.getInstance().broadcast(
            {
              type: "webrtc-offer",
              payload: {
                fromId: this.id,
                targetId: offerTargetId,
                offer,
              },
            },
            this,
            this.spaceId
          );
          break;

        case "webrtc-answer":
          const answerTargetId = parsedData.payload.targetId;
          const answer = parsedData.payload.answer;

          if (!this.spaceId || !answerTargetId || !answer) {
            this.send({
              type: "webrtc-error",
              payload: { message: "Missing spaceId, targetId, or answer" },
            });
            return;
          }

          RoomManager.getInstance().broadcast(
            {
              type: "webrtc-answer",
              payload: {
                fromId: this.id,
                targetId: answerTargetId,
                answer,
              },
            },
            this,
            this.spaceId
          );
          break;

        case "webrtc-ice-candidate":
          const iceTargetId = parsedData.payload.targetId;
          const candidate = parsedData.payload.candidate;

          if (!this.spaceId || !iceTargetId || !candidate) {
            this.send({
              type: "webrtc-error",
              payload: { message: "Missing spaceId, targetId, or candidate" },
            });
            return;
          }

          RoomManager.getInstance().broadcast(
            {
              type: "webrtc-ice-candidate",
              payload: {
                fromId: this.id,
                targetId: iceTargetId,
                candidate,
              },
            },
            this,
            this.spaceId
          );
          break;
      }
    });
  }

  public destroy(): void {
    if (this.spaceId) {
      RoomManager.getInstance().broadcast(
        {
          type: "user-left",
          payload: {
            userId: this.userId,
            id: this.id,
          },
        },
        this,
        this.spaceId
      );
      RoomManager.getInstance().removeUser(this, this.spaceId);
    }
  }

  public send(payload: OutgoingMessage): void {
    this.ws.send(JSON.stringify(payload));
  }
}