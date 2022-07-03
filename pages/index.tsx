import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Image from "next/image";
import {
  DetectLabelsCommandOutput,
  Label,
  Instance,
  BoundingBox,
} from "@aws-sdk/client-rekognition";

const WIDTH = 320;
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

type BoundingBoxProps = {
  labels?: Label[];
};

const BoundingBoxes = ({ labels }: BoundingBoxProps) => {
  const boxes = useMemo(() => {
    if (!labels) {
      return [];
    }
    const boxes = labels
      .filter((f) => f.Name === "Person")
      .flatMap((m) => m.Instances)
      .filter((f): f is Instance => f != undefined)
      .map((m) => m.BoundingBox)
      .filter((f): f is BoundingBox => f != undefined);

    return boxes
      .map((m) => {
        return {
          width: m.Width ?? 0,
          height: m.Height ?? 0,
          top: m.Top ?? 0,
          left: m.Left ?? 0,
        };
      })
      .map((m) => {
        return {
          width: `${m.width * 100}%`,
          height: `${m.height * 100}%`,
          top: `${m.top * 100}%`,
          left: `${m.left * 100}%`,
        };
      });
  }, [labels]);

  return (
    <>
      {boxes.map((m, i) => {
        return (
          <div
            key={i}
            style={{
              ...m,
              position: "absolute",
              borderStyle: "solid",
              borderWidth: "4px 4px",
              borderColor: "red",
            }}
          ></div>
        );
      })}
    </>
  );
};

export const App = () => {
  const camDiv = useRef<HTMLDivElement>(null);
  const { webcamRef, capture, img, result } = useApp();
  const [start, setStart] = useState<boolean>(false)
  const personNum = useMemo(()=>{
    return result?.Labels?.filter(f => f.Name == "Person").flatMap(f => f.Instances).length ?? 0
  },[result])
  useEffect(() => {
    if(!start){
      return
    }
    
    const timer = setInterval(()=>{
        capture()
    }, 1000);

    return () => {
        clearInterval(timer)
    }
  }, [start,capture]);

  return (
    <div>
      <header>
        <h1>{personNum}人</h1>
      </header>
      <button onClick={()=>setStart(true)}>Start</button>
      <button onClick={()=>setStart(false)}>Stop</button>
      <div>
          <div ref={camDiv} style={{ position: "relative" }}>
            <Webcam
              audio={false}
              width={"100%"}
              height={"100%"}
              minScreenshotWidth={480}
              minScreenshotHeight={320}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
            {start && <BoundingBoxes labels={result?.Labels}/>}
          </div>
      </div>
    </div>
  );
};
export default App;
