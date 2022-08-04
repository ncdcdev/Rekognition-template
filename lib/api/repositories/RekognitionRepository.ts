import { DetectLabelsCommand, DetectLabelsCommandInput, DetectLabelsCommandOutput, RekognitionClient } from "@aws-sdk/client-rekognition";


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
}