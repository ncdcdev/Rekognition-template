// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import AWS from "../../config/aws";

export type Data = AWS.Rekognition.DetectLabelsResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const img = req.body.img;
  console.log({ img });
  if (req.method == "POST") {
    const client = new AWS.Rekognition();
    const buffer = Buffer.from(img, "base64");

    const params: AWS.Rekognition.DetectLabelsRequest = {
      Image: {
        Bytes: buffer,
      },
    };
    client.detectLabels(params, (err, response) => {
      if (err) {
        res.status(404);
      } else {
        res.status(200).send(response);
      }
    });
  }
  res.status(404);
}
