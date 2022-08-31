// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RekognitionRepository } from "../../../lib/api/repositories/RekognitionRepository";

export type Data = { member: string | null }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const img = req.body.img;
  if (req.method == "POST") {
    const buffer = Buffer.from(img, "base64");

    const repository = new RekognitionRepository();
    try {
      const data = await repository.searchFaceByImage(buffer,1);

      const member = (data.FaceMatches?.length != null && data.FaceMatches[0].Face != null) ? data.FaceMatches[0].Face.ExternalImageId ?? "" : null
      res.status(200).send({ member });
      return;
    } catch (err) {
      console.error(err);
      res.status(500);
      return;
    }
  }
}
