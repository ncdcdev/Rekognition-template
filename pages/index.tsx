import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Image from "next/image";
import { DetectLabelsCommandOutput } from "@aws-sdk/client-rekognition";

const WIDTH = 320 * 1.5;
const HEIGHT = 240 * 1.5;

const useApp = () => {
  const webcamRef = useRef<Webcam>(null);
  const [img, setImg] = useState<string | null>(null);
  const [result, setResult] = useState<DetectLabelsCommandOutput>();

  const capture = useCallback(async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      const img = screenshot.split(",")[1];
      const res = await axios.post<DetectLabelsCommandOutput>(
        "/api/detectLabels",
        {
          img: img,
        }
      );
      console.log({ data: res.data });
      setResult(res.data);
      setImg(screenshot);
    }
  }, [webcamRef]);

  return { webcamRef, capture, img, result };
};

const BoundingBox = () => {};

export const App = () => {
  const { webcamRef, capture, img, result } = useApp();

  return (
    <div>
      <header>
        <h1>Rekognition</h1>
      </header>
      <div style={{ display: "flex" }}>
        <div>
          <div>
            <Webcam
              audio={false}
              width={WIDTH}
              height={HEIGHT}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
          </div>
          <button onClick={capture}>解析</button>
          <div>
            {img && (
              <Image src={img} alt="Screenshot" width={WIDTH} height={HEIGHT} />
            )}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <textarea
            value={JSON.stringify(result)}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
