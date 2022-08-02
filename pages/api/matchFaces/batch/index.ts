import sharp from "sharp";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  BoundingBox,
  DetectLabelsCommand,
  DetectLabelsCommandInput,
  Instance,
  SearchFacesByImageCommand,
} from "@aws-sdk/client-rekognition";
import type { NextApiRequest, NextApiResponse } from "next";
import { rekognitionClient } from "../../../../config/awsv3";

export type SearchFacesByImageData = { members: string[] };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchFacesByImageData | string>
) {
  if (req.method == "POST") {
    const buffer = Buffer.from(req.body.img, "base64");
    const img = sharp(buffer);
    try {
      // rekognitionでPersonのBoundingBox値取得
      const personBoxes = await getBoundingBox(img);

      // BoundingBoxに基づいて、画像を切り出す
      const extractImgs = await extract(img, personBoxes);

      // 切り出した画像を、顔認証APIに投げる
      const members = await matchFace(extractImgs);

      res.status(200).send({ members });

      return;
    } catch (err) {
      console.error({ err });
      res.status(500);
      return;
    }
  }
}

// rekognitionでPersonのBoundingBox値取得
const getBoundingBox = async (img: sharp.Sharp) => {
  const params: DetectLabelsCommandInput = {
    Image: {
      Bytes: await img.toBuffer(),
    },
  };
  const data = await rekognitionClient.send(new DetectLabelsCommand(params));

  const boxes = data.Labels?.filter((f) => f.Name === "Person")
    .flatMap((m) => m.Instances)
    .filter((f): f is Instance => f != undefined)
    .map((m) => m.BoundingBox)
    .filter((f): f is BoundingBox => f != undefined);

  return boxes ?? [];
};

const extract = async (
  img: sharp.Sharp,
  boxes: BoundingBox[]
): Promise<sharp.Sharp[]> => {
  const { width = 0, height = 0 } = await img.metadata();
  const imges = boxes
    .map((m) => {
      return {
        width: m.Width,
        height: m.Height,
        top: m.Top,
        left: m.Left,
      };
    })
    .filter(
      (
        f
      ): f is {
        width: number;
        height: number;
        top: number;
        left: number;
      } => {
        return (
          f.width != undefined &&
          f.height != undefined &&
          f.top != undefined &&
          f.left != undefined
        );
      }
    )
    .map((m) => {
      return img.clone().extract({
        width: Math.floor(m.width * width),
        height: Math.floor(m.height * height),
        top: Math.floor(m.top * height),
        left: Math.floor(m.left * width),
      });
    });
  return imges;
};

const matchFace = async (imgs: sharp.Sharp[]) => {
  const faces: string[] = [];
  for (const img of imgs) {
    const searchParams = {
      CollectionId: "faces",
      Image: {
        Bytes: await img.toBuffer(),
      },
    };
    const data = await rekognitionClient.send(
      new SearchFacesByImageCommand(searchParams)
    );

    const result =
      data.FaceMatches?.flatMap((m) => {
        return m.Face?.ExternalImageId;
      }).filter((f): f is string => typeof f === "string") ?? [];

    faces.push(...result);
  }
  return faces;
};
