// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  DetectLabelsCommandInput,
} from "@aws-sdk/client-rekognition";
import type { NextApiRequest, NextApiResponse } from "next";
import { AWSClients } from "../../../../config/awsv3";

export type Data = { members: string[] }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const AWS = new AWSClients();
  const collectionId = "faces";

  if (req.method == "POST") {
    const img = req.body.img;
    const buffer = Buffer.from(img, "base64");

    try {
      // 顔をDetectする
      const detectParams: DetectLabelsCommandInput = {
        Image: {
          Bytes: buffer,
        },
      };
      // 顔の画像を切り出す
      // 画像毎に照合APIにリクエストする

      return;
    } catch (err) {
      console.error(err);
      res.status(500);
      return;
    }
  }
  res.status(404);
}
