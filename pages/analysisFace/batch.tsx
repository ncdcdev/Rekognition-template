import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { EmotionDataArray } from "../api/emotions/batch";
import dynamic from 'next/dynamic';
import { BoundingBox } from "@aws-sdk/client-rekognition";

const WIDTH = 320 * 1.5;
const HEIGHT = 240 * 1.5;

type Emotion = {
  label: string,
  emojiCode: string,
  boundingBox: BoundingBox | null
}

const useApp = () => {
  const webcamRef = useRef<Webcam>(null);
  const [img, setImg] = useState<string | null>(null);
  const [result, setResult] = useState<EmotionDataArray>();
  const [emotion, setEmotion] = useState<Emotion[]>()


  const capture = useCallback(async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      const img = screenshot.split(",")[1];
      const res = await axios.post<EmotionDataArray>("/api/emotions/batch", {
        img: img,
      });
      const emotionArray:Emotion[] = []

      // 返ってきた感情によって表示する絵文字を変える
      res.data.map(data=>{
        if (data.emotion != null) {
          const commonParam = { boundingBox: data.boundingBox}
          switch (data.emotion) {
            case "ANGRY":
              emotionArray.push({ label: "ANGRY", emojiCode: "&#x1F621;", ...commonParam })
              break;
            case "CALM":
              emotionArray.push({ label: "CALM", emojiCode: "&#x1F610;", ...commonParam })
              break;
            case "CONFUSED":
              emotionArray.push({ label: "CONFUSED", emojiCode: "&#x1F635;&zwj;&#x1F4AB;", ...commonParam })
              break;
            case "DISGUSTED":
              emotionArray.push({ label: "DISGUSTED", emojiCode: "&#x1F92E;", ...commonParam })
              break;
            case "FEAR":
              emotionArray.push({ label: "FEAR", emojiCode: "&#x1F631;", ...commonParam })
              break;
            case "HAPPY":
              emotionArray.push({ label: "HAPPY", emojiCode: "&#x1F970;", ...commonParam })
              break;
            case "SAD":
              emotionArray.push({ label: "SAD", emojiCode: "&#x1F979;", ...commonParam })
              break;
            case "SURPRISED":
              emotionArray.push({ label: "SURPRISED", emojiCode: "&#x1F633;", ...commonParam })
              break;
            default:
              emotionArray.push({ label: "CALM", emojiCode: "&#x1F610;", ...commonParam })
          }
          setEmotion(emotionArray)
        }
      })


      setResult(res.data);
      setImg(screenshot);
    }
  }, [webcamRef]);

  const BoundingBoxes = ( {emotions,parentHeight} :{ emotions:Emotion[], parentHeight: number}) => {
    const boxes = useMemo(() => {
      if (!emotions) {
        return [];
      }

      return emotions
        .filter((emotion): emotion is Emotion => emotion != undefined)  
        .map((emotions) => {
          return {
            label:emotions.label,
            emojiCode:emotions.emojiCode,
            width: emotions.boundingBox?.Width ?? 0,
            height: emotions.boundingBox?.Height ?? 0,
            top: emotions.boundingBox?.Top ?? 0,
            left: emotions.boundingBox?.Left ?? 0,
          };
        })
        .map((boundingBox) => {
          return {
            label:boundingBox.label,
            emojiCode:boundingBox.emojiCode,
            width: `${boundingBox.width * 100}%`,
            height: `${boundingBox.height * 100}%`,
            top: `${(boundingBox.top-boundingBox.height/2) * 80}%`,
            left: `${(boundingBox.left-boundingBox.width/2) * 100}%`,
            emojiSize: parentHeight
          };
        });
    }, [emotion]);
  
    return (
      <>
        {boxes.map((m, i) => {
          return (
            <div
              key={i} 
              style={{
                ...m,
                position: "absolute",
                fontSize: m.emojiSize + "px"
              }}
              dangerouslySetInnerHTML={{ __html: m.emojiCode ?? "" }}
            ></div>
          );
        })}
      </>
    );
  };

  return { webcamRef, capture, img, result, emotion ,BoundingBoxes};
};


export const App = () => {
  const { webcamRef, capture, img, result, emotion ,BoundingBoxes} = useApp();
  const [start, setStart] = useState<boolean>(false);


  useEffect(() => {
    if (!start) {
      return;
    }

    const timer = setInterval(() => {
      capture();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [start, capture]);

  return (
    <div>
      <header className="flex-wrap bg-teal-500 text-white p-6 mb-6">
        <h1>表情分析</h1>
      </header>
      <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mx-1 my-1" onClick={() => setStart(true)}>Start</button>
      <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mx-1 my-1" onClick={() => setStart(false)}>Stop</button>

      <div style={{ display: "flex" }}>
        <div>
          <div className="mb-6" style={{ position: "relative" }}>
            <Webcam
              audio={false}
              width={"100%"}
              height={"100%"}
              minScreenshotWidth={480}
              minScreenshotHeight={320}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
            {start && <BoundingBoxes emotions={emotion??[]} parentHeight={320}/>}
          </div>
        </div>
        {/* <div>
          <div>{emotion?.label ?? ""}</div>
          <div className="text-300px" dangerouslySetInnerHTML={{ __html: emotion?.emojiCode ?? "" }}></div>
        </div> */}
      </div>
    </div>
  );
};
export default App;