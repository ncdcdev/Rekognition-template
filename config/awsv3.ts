import { RekognitionClient } from "@aws-sdk/client-rekognition";

export class AWSClients {
  rekognitionClient: RekognitionClient;

  constructor() {
    this.rekognitionClient = new RekognitionClient({
      region: "ap-northeast-1",
    });
  }
}

const awsClient = new AWSClients();

const rekognitionClient = awsClient.rekognitionClient;

export { rekognitionClient };
