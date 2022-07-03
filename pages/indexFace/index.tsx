import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Image from "next/image";
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
        img: img,
        name: name
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
      <header>
        <h1>NCDCメンバ登録</h1>
      </header>
      <div style={{ display: "flex" }}>
        <div>
          <div className="container">
            <Webcam
              audio={false}
              width={WIDTH}
              height={HEIGHT}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
            <div className="name-container">
              <div>名前：</div>
              <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }} />
            </div>
          </div>
          <div className="button-container">
            <button onClick={capture}>登録</button>
          </div>
          {/* <div>
            {img && (
              <Image src={img} alt="Screenshot" width={WIDTH} height={HEIGHT} />
            )}
          </div> */}
        </div>
        {/* <div style={{ flex: 1 }}>
          <textarea
            value={JSON.stringify(result)}
            style={{ width: "100%", height: "100%" }}
          />
        </div> */}
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