import sharp from "sharp";
import {
  DetectLabelsCommandInput,
  DetectLabelsCommand,
  Instance,
  BoundingBox,
  SearchFacesByImageCommand,
} from "@aws-sdk/client-rekognition";
import { rekognitionClient } from "../config/awsv3";

describe("画像", () => {
  // ファイル名
  const FILE_NAME = "test.jpg";
  // 画像の入力元
  const INPUT_PATH =
    "/Users/matsumoto/Documents/GitHub/Rekognition-template/__test__/images/inputs/" +
    FILE_NAME;

  // 画像の出力先
  const OUTPUT_PATH = (prefix: string) =>
    "/Users/matsumoto/Documents/GitHub/Rekognition-template/__test__/images/outputs/" +
    prefix +
    FILE_NAME;

  // 画像のロード
  const loadImage = async () => {
    console.log("loadImage");
    const image = await sharp(INPUT_PATH);
    console.log({
      msg: "msg",
      meta: await image.metadata(),
    });
    return image;
  };

  // 画像の出力
  const saveImage = async (imgs: sharp.Sharp[]) => {
    console.log("saveImage");
    for (const img of imgs) {
      console.log((await img.metadata()).width);
    }
    await imgs.map(async (img, i) => {
      await img.toFile(OUTPUT_PATH(`${i}-`));
    });
  };

  // rekognitionでPersonのBoundingBox値取得
  const getBoudingBox = async (img: sharp.Sharp) => {
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

  /**
   * 例えばinput.pngをtop: 600, left: 400の位置で400x200で切り抜きたい場合は以下のようになる。
  sharp('input.png')
  .extract({
    top: 600,
    left: 400,
    width: 400,
    height: 200
  })
  .toFile('extract.png');
   */
  test("aaa", async () => {
    // 画像のロード
    const img = await loadImage();

    // rekognitionでPersonのBoundingBox値取得
    const personBoxes = await getBoudingBox(img);

    console.log(personBoxes);
    // BoundingBoxに基づいて、画像を切り出す
    const extractImgs = await extract(img, personBoxes);

    // 画像の保存
    // await saveImage(extractImgs);

    // 切り出した画像を、顔認証APIに投げる
    const result = await matchFace(extractImgs);

    console.log({ result });

    expect(2).toBe(2);
  });
});

// jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
