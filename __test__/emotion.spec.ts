import { DetectFacesCommandInput, DetectFacesCommand } from "@aws-sdk/client-rekognition";
import { AWSClients } from "../config/awsv3"
import fs from "fs"
import { EmotionDataArray } from "../pages/api/emotions/batch";


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


  test("test2", async () => {
    const AWS = new AWSClients()
    // 画像を取得
    const buffer = fs.readFileSync(__dirname + "/images/inputs/test.jpg")

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
    let returnObj: EmotionDataArray = []

    // レスポンスの顔ごとに一番値が大きい感情を取得してクライアントにレスポンスする
    if( data.FaceDetails != null ){
      data.FaceDetails.map(face=> {
        const emotion = face.Emotions?.reduce((a,b,)=>{
          if(Number(a.Confidence) > Number(b.Confidence)) {
            return a
          }
          return b
        },{Confidence:0}) 
        if(emotion==null) return
        returnObj.push({emotion:String(emotion.Type),boundingBox:face.BoundingBox??null})
      })
    }

    console.log(returnObj)
    // expect(returnObj).toMatchObject({emotion:"CONFUSED"})
  })

})