// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CreateCollectionCommand, IndexFacesCommand } from "@aws-sdk/client-rekognition";
import type { NextApiRequest, NextApiResponse } from "next";
import {AWSClients} from "../../config/awsv3";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const img = req.body.img;
  console.log({ img });
  if (req.method == "POST") {
    const AWS = new AWSClients();
    const buffer = Buffer.from(img, "base64");

    const collectionId = "faces";

    try{
    // コレクションに顔を登録
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rekognition/classes/indexfacescommand.html
    // MaxFaces で検出する顔の数を指定する
    const createListParams = {
      CollectionId: collectionId,
      Image: {
        Bytes: buffer,
      },
      MaxFaces: 1,
    };
    const response = await AWS.rekognitionClient.send(
      new IndexFacesCommand(createListParams)
    );
    res.status(200).send(response);
    return

    }catch(err){
      console.error(err);
      res.status(500);
      return
    }
  }
  res.status(404);
}
