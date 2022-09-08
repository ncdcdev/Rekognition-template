import { useRef, useState, useCallback, useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { EmotionData } from "../api/emotions";
import dynamic from 'next/dynamic';
import Link from "next/link";

const WIDTH = 320 * 1.5;
const HEIGHT = 240 * 1.5;

type Emotion = {
  label: string,
  emojiCode: string
}

const useApp = () => {
  const webcamRef = useRef<Webcam>(null);
  const [img, setImg] = useState<string | null>(null);
  const [result, setResult] = useState<EmotionData>({ emotion: null });
  const [emotion, setEmotion] = useState<Emotion>()

  const capture = useCallback(async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      const img = screenshot.split(",")[1];
      const res = await axios.post<EmotionData>("/api/emotions", {
        img: img,
      });

      console.log(res)
      // 返ってきた感情によって表示する絵文字を変える
      if (res.data.emotion != null) {
        switch (res.data.emotion) {
          case "ANGRY":
            setEmotion({ label: "ANGRY", emojiCode: "&#x1F621;" })
            break;
          case "CALM":
            setEmotion({ label: "CALM", emojiCode: "&#x1F610;" })
            break;
          case "CONFUSED":
            setEmotion({ label: "CONFUSED", emojiCode: "&#x1F635;&zwj;&#x1F4AB;" })
            break;
          case "DISGUSTED":
            setEmotion({ label: "DISGUSTED", emojiCode: "&#x1F92E;" })
            break;
          case "FEAR":
            setEmotion({ label: "FEAR", emojiCode: "&#x1F631;" })
            break;
          case "HAPPY":
            setEmotion({ label: "HAPPY", emojiCode: "&#x1F970;" })
            break;
          case "SAD":
            setEmotion({ label: "SAD", emojiCode: "&#x1F979;" })
            break;
          case "SURPRISED":
            setEmotion({ label: "SURPRISED", emojiCode: "&#x1F633;" })
            break;
          default:
            setEmotion({ label: "CALM", emojiCode: "&#x1F610;" })
        }
      }

      setResult(res.data);
      setImg(screenshot);
    }
  }, [webcamRef]);

  return { webcamRef, capture, img, result, emotion };
};

export const App = () => {
  const { webcamRef, capture, img, result, emotion } = useApp();
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
      <header className="flex bg-teal-500 text-white p-6 mb-6">
        <h1>表情分析</h1>
        <div className="ml-auto mr-5">
          <Link href="/">ホーム画面に戻る</Link>
        </div>
      </header>
      <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mx-1 my-1" onClick={() => setStart(true)}>Start</button>
      <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mx-1 my-1" onClick={() => setStart(false)}>Stop</button>

      <div style={{ display: "flex" }}>
        <div>
          <div className="mb-6">
            <Webcam
              audio={false}
              width={"100%"}
              height={"100%"}
              minScreenshotWidth={480}
              minScreenshotHeight={320}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
          </div>
        </div>
        <div>
          <div>{emotion?.label ?? ""}</div>
          <div className="text-300px" dangerouslySetInnerHTML={{ __html: emotion?.emojiCode ?? "" }}></div>
        </div>
      </div>
    </div>
  );
};
export default App;