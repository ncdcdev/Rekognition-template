// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
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

      let returnObj: EmotionData
      // レスポンスから一番値が大きい感情を取得してクライアントにレスポンスする
      if( data.FaceDetails == null ){
        returnObj = {emotion:""}
      }else{
        const maxEmotion = data.FaceDetails[0].Emotions?.reduce((a,b)=>{
          if(Number(a.Confidence) > Number(b.Confidence)) return a
          return b
        },{Confidence:0})
        returnObj = { emotion: maxEmotion!=null ? String(maxEmotion.Type) : null}

        res.status(200).send(returnObj);
        return;
      }
    } catch (err) {
      console.error(err);
      res.status(500);
      return;
    }
    res.status(404);
  }
}
