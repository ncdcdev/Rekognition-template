// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  DetectLabelsCommandOutput,
} from "@aws-sdk/client-rekognition";
import { RekognitionRepository } from "../../lib/api/repositories/RekognitionRepository";

export type Data = DetectLabelsCommandOutput

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DetectLabelsCommandOutput>
) {
  const img = req.body.img;
  if (req.method == "POST") {
    try{
      const buffer = Buffer.from(img, "base64");

      const repository = new RekognitionRepository();  
      const data = await repository.getDetectLabels(buffer);
      res.status(200).send(data);
      return

    }catch(err){
      console.error(err);
      res.status(500);
      return;
    }
  }
}
