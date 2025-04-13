import { Router } from "express";
import { userrouter } from "./user";
import { spacerouter } from "./space";
import { adminrouter } from "./admin";
import { signinschema, signupschema } from "../../types/types";
import { compare, hash } from "../../scryptalgo";
import jwt from "jsonwebtoken";
import client from "@repo/db/client";
import { JWT_PASSWORD } from "../../config";

export const router = Router();


router.post("/signup", async (req, res) => {
  const parseddata = signupschema.safeParse(req.body);

  if (!parseddata.success) {
    res.status(400).json({ message: "Validation failed. Please check your input." });
    return;
  }

  try {
    // Check if user already exists
    const existingUser = await client.user.findFirst({
      where: { email: parseddata.data.email }
    });

    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const hashedPassword = await hash(parseddata.data.password);
    
    // Map the type from the schema to the database role (case-sensitive)
    const role = parseddata.data.type === "admin" ? "Admin" : "User";

    const user = await client.user.create({
      data: {
        email: parseddata.data.email,
        username: parseddata.data.username,
        password: hashedPassword,
        role: role,
        avatarColor: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random color
      },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_PASSWORD
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarColor: user.avatarColor
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// The signin and verify routes look good, so keep them the same


router.post("/signin", async (req, res) => {
  const parseddata = signinschema.safeParse(req.body);

  if (!parseddata.success) {
    res.status(400).json({ message: "Invalid email or password format" });
    return;
  }

  try {
    const user = await client.user.findFirst({
      where: { email: parseddata.data.email }
    });

    if (!user) {
      res.status(403).json({ message: "Invalid email or password" });
      return;
    }

    const isValid = await compare(parseddata.data.password, user.password);

    if (!isValid) {
      res.status(403).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_PASSWORD
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarColor: user.avatarColor
      }
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

router.get("/verify", async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_PASSWORD) as { userId: string };
    
    const user = await client.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarColor: user.avatarColor
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/elements", async (req, res) => {
  try {
    const elements = await client.element.findMany();
    res.json({
      elements: elements.map((e) => ({
        id: e.id,
        imageUrl: e.imageUrl,
        height: e.height,
        width: e.width,
        static: e.static,
      })),
    });
  } catch (error) {
    console.error("Elements fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/avatar", async (req, res) => {
  try {
    const avatars = await client.avatar.findMany();
    res.json({
      avatars: avatars.map((e) => ({
        id: e.id,
        imageUrl: e.imageUrl,
        name: e.name,
      })),
    });
  } catch (error) {
    console.error("Avatar fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.use("/user", userrouter);
router.use("/space", spacerouter);
router.use("/element", adminrouter);