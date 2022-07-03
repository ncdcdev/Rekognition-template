// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { rekognitionClient } from "../../config/awsv3";
import {
  DetectLabelsCommand,
  DetectLabelsCommandInput,
  DetectLabelsCommandOutput,
} from "@aws-sdk/client-rekognition";

export type Data = DetectLabelsCommandOutput

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DetectLabelsCommandOutput>
) {
  const img = req.body.img;
  console.log({ img });
  if (req.method == "POST") {
    const buffer = Buffer.from(img, "base64");

    const params: DetectLabelsCommandInput = {
      Image: {
        Bytes: buffer,
      },
    };
    const data = await rekognitionClient.send(new DetectLabelsCommand(params));
    res.status(200).send(data);
  }
  res.status(404);
}
