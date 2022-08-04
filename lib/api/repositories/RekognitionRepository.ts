import { DetectLabelsCommand, DetectLabelsCommandInput, DetectLabelsCommandOutput, RekognitionClient, SearchFacesByImageCommand, SearchFacesByImageCommandInput, SearchFacesByImageCommandOutput } from "@aws-sdk/client-rekognition";

const COLLECTION_ID = "faces"

export class RekognitionRepository {
  private client: RekognitionClient

  constructor() {
    this.client = new RekognitionClient({
      region: "ap-northeast-1",
    });
  }

  async getDetectLabels(img: Buffer): Promise<DetectLabelsCommandOutput> {
    const params: DetectLabelsCommandInput = {
      Image: {
        Bytes: img,
      },
    };
    return await this.client.send(new DetectLabelsCommand(params));
  }

  /**
   * 作成したコレクションから顔を検索する
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rekognition/interfaces/searchfacesbyimagecommandinput.html
   * @param img 
   * @param maxFaces 
   * @returns 
   */
  async searchFaceByImage(img: Buffer,maxFaces:number): Promise<SearchFacesByImageCommandOutput> {
    const params: SearchFacesByImageCommandInput = {
        CollectionId: COLLECTION_ID,
        Image: {
        Bytes: img,
      },
      MaxFaces: maxFaces
    };
    return await this.client.send(new SearchFacesByImageCommand(params));
  }
}