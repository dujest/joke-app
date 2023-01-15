import axios from "axios";
import { Request, Response } from "express";

export class JokeController {
  async getJoke(request: Request, response: Response) {
    const { data } = await axios.get(process.env.JOKE_URL);
    console.log((request as any).user);
    response.status(200).json({ data });
  }
}
