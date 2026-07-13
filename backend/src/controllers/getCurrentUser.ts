import { Request, Response } from "express";
import { db } from "../db";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.User?.id) {
      res.status(401).json({ message: "You are not logged in" });
      return;
    }

    const user = await db.user.findUnique({
      where: {
        id: req.User.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      res.status(401).json({ message: "User does not exist" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("error in get current user controller " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getCurrentUser;
