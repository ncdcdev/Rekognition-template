// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  DetectFacesCommandInput,
  DetectFacesCommand,
  BoundingBox
} from "@aws-sdk/client-rekognition";
import type { NextApiRequest, NextApiResponse } from "next";
import { AWSClients } from "../../../../config/awsv3";

export type EmotionDataArray = { emotion: string | null, boundingBox:BoundingBox|null }[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmotionDataArray>
) {
  const AWS = new AWSClients();
  const img = req.body.img;

  if (req.method == "POST") {
    // 画像を取得
    const buffer = Buffer.from(img, "base64");

    try {
      // DetectFaces APIに画像を渡す
      // Attributesは"ALL"を指定しないとEmotionが取得できない
      const faceParams: DetectFacesCommandInput = {
        Attributes: ["ALL"],
        Image: {
          Bytes: buffer
        }
      }

      // DetectFaces APIレスポンスを受け取る
      const data = await AWS.rekognitionClient.send(
        new DetectFacesCommand(faceParams)
      );

      let returnObj: EmotionDataArray = []

      // レスポンスの顔ごとに一番値が大きい感情を取得してクライアントにレスポンスする
      if( data.FaceDetails != null ){
        data.FaceDetails.map(face=> {
          const emotion = face.Emotions?.reduce((a,b,)=>{
            if(Number(a.Confidence) > Number(b.Confidence)) {
              return a
            }
            return b
          },{Confidence:0}) 
          if(emotion==null) return
          returnObj.push({emotion:String(emotion.Type),boundingBox:face.BoundingBox??null})
        })
      }
      res.status(200).send(returnObj);
      return;
    } catch (err) {
      console.error(err);
      res.status(500);
      return;
    }
  }
}
