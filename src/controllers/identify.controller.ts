import { Request, Response } from "express";
import { identifyContact } from "../services/identify.service";

export const identify = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    const result = await identifyContact({
      email,
      phoneNumber,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};