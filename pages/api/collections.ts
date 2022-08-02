// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CreateCollectionCommand, DeleteCollectionCommand, ListFacesCommandInput, ListFacesCommand } from "@aws-sdk/client-rekognition";
import type { NextApiRequest, NextApiResponse } from "next";
import { AWSClients } from "../../config/awsv3";

const collectionId = "faces";

export type FaceListData = { members: string[] }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const AWS = new AWSClients();

  if (req.method == "GET") {
    try {
      const listFacesParams: ListFacesCommandInput = {
        CollectionId: collectionId,
      };
      const response = await AWS.rekognitionClient.send(
        new ListFacesCommand(listFacesParams)
      );
      res.setHeader("Content-Type", "application/json")
      res.status(200).send({ members: response.Faces?.map(face => face.ExternalImageId) });
      return

    } catch (err) {
      console.error(err);
      res.status(500);
      return
    }
    res.status(404);
  }

  if (req.method == "POST") {

    try {
      // コレクションの作成
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rekognition/interfaces/createcollectioncommandinput.html
      const createCollectionParams = {
        CollectionId: collectionId,
      };
      const response = await AWS.rekognitionClient.send(
        new CreateCollectionCommand(createCollectionParams)
      );
      res.status(200).send(response);
      return

    } catch (err) {
      console.error(err);
      res.status(500);
      return
    }
  }

  if (req.method == "DELETE") {
    const AWS = new AWSClients();


    try {
      // コレクションの削除
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rekognition/classes/deletecollectioncommand.html
      const deleteCollectionParams = {
        CollectionId: collectionId,
      };
      await AWS.rekognitionClient.send(
        new DeleteCollectionCommand(deleteCollectionParams)
      );

      res.status(204).end()
      return
    } catch (err) {
      console.error(err);
      res.status(500);
      return
    }
  }
}
