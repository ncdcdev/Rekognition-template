// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SearchFacesByImageCommand } from "@aws-sdk/client-rekognition";
import type { NextApiRequest, NextApiResponse } from "next";
import {AWSClients} from "../../config/awsv3";

export type Data = AWS.Rekognition.SearchFacesResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const img = req.body.img;
  console.log({ img });
  if (req.method == "POST") {
    const AWS = new AWSClients();
    const buffer = Buffer.from(img, "base64");

    const collectionId = "faces";

    try{
    // 作成したリストから検索する
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rekognition/interfaces/searchfacesbyimagecommandinput.html
    const searchParams = {
      CollectionId: collectionId,
      Image: {
        Bytes: buffer,
      },
    };

    const data = await AWS.rekognitionClient.send(
      new SearchFacesByImageCommand(searchParams)
    );
    res.status(200).send(data);
    return
    
    }catch(err){
      console.error(err);
      res.status(500);
      return
    }
  }
  res.status(404);
}
