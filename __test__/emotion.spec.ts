import { DetectFacesCommandInput, DetectFacesCommand } from "@aws-sdk/client-rekognition";
import { AWSClients } from "../config/awsv3"
import fs from "fs"

describe("emotion", () => {
  test("test1", async () => {
    const AWS = new AWSClients()
    // 画像を取得
    const buffer = fs.readFileSync(__dirname + "/images/inputs/test2.jpg")

    // DetectFaces APIに画像を渡す
    const faceParams: DetectFacesCommandInput = {
      Attributes: ["ALL"],
      Image: {
        Bytes: buffer
      }
    }

    // DetectFaces APIレスポンスを受け取る
    const data = await AWS.rekognitionClient.send(
      new DetectFacesCommand(faceParams)
    );

    // レスポンスから一番値が大きい感情を取得してクライアントにレスポンスする
    if( data.FaceDetails == null ){
      return {emotion:""}
    }
    
    const maxEmotion = data.FaceDetails[0].Emotions?.reduce((a,b)=>{
      if(Number(a.Confidence) > Number(b.Confidence)) return a
      return b
    },{Confidence:0})

    const returnObj = {emotion: maxEmotion!=null ? maxEmotion.Type : ""}

    console.log({returnObj})
    expect(returnObj).toMatchObject({emotion:"CONFUSED"})
  })
})