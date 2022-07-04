// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  SearchFacesByImageCommand,
  SearchFacesByImageCommandInput,
  SearchFacesByImageCommandOutput,
  DetectFacesCommandInput,
  DetectFacesCommand
} from "@aws-sdk/client-rekognition";
import type { NextApiRequest, NextApiResponse } from "next";
import { AWSClients } from "../../../config/awsv3";

export type EmotionData = { emotion: string | null }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmotionData>
) {
  const AWS = new AWSClients();
  const img = req.body.img;
  const collectionId = "faces";

  if (req.method == "POST") {
    // 画像を取得
    const buffer = Buffer.from(img, "base64");

    try {
      // DetectFaces APIに画像を渡す
      const faceParams: DetectFacesCommandInput = {
        Attributes: ["All"],
        Image: {
          Bytes: buffer
        }
      }

      // DetectFaces APIレスポンスを受け取る
      const data = await AWS.rekognitionClient.send(
        new DetectFacesCommand(faceParams)
      );

      console.log(data)

      // レスポンスから一番値が大きい感情を取得してクライアントにレスポンスする



      // const member = (data.FaceMatches?.length != null && data.FaceMatches[0].Face != null) ? data.FaceMatches[0].Face.ExternalImageId ?? "" : null
      res.status(200).send({ emotion: "SAD" });
      return;
    } catch (err) {
      console.error(err);
      res.status(500);
      return;
    }
    res.status(404);
  }
}
