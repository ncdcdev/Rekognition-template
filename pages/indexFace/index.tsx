import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Data as DetectLabelsData } from "../api/detectLabels";

const WIDTH = 320 * 1.5;
const HEIGHT = 240 * 1.5;

const useApp = () => {
  const webcamRef = useRef<Webcam>(null);
  const [img, setImg] = useState<string | null>(null);
  const [result, setResult] = useState<DetectLabelsData>();
  const [name, setName] = useState("");

  const capture = useCallback(async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      const img = screenshot.split(",")[1];
      const res = await axios.post<DetectLabelsData>("/api/face", {
        img,
        name
      });
      console.log({ data: res.data });
      setResult(res.data);
      setImg(screenshot);
    }
  }, [webcamRef, name]);

  return { webcamRef, capture, img, result, name, setName };
};

export const App = () => {
  const { webcamRef, capture, img, result, name, setName } = useApp();
  return (
    <div>
      <header className="flex-wrap bg-teal-500 text-white p-6 mb-6">
        <h1>メンバ登録</h1>
      </header>
      <div style={{ display: "flex" }}>
        <div>
          <div className="container mb-6">
            <Webcam
              audio={false}
              width={WIDTH}
              height={HEIGHT}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
            <div className="name-container">
              <div className="w-24">名前:</div>
              <input className="shadow appearance-none border rounded w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }} />
            </div>
          </div>
          <div className="button-container">
            <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded" onClick={capture}>登録</button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-between;
        }

        .name-container {
          display: flex;
          align-items: center;
        }

        .button-container {
          display:flex;
          justify-content:center;
        }
      `}</style>
    </div>
  );
};
export default App;

// d515a40b-a466-4230-88fa-ad6552935f8a