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

type BoundingBoxProps = {
  labels?: Label[];
};

const BoundingBoxes = ({ labels }: BoundingBoxProps) => {
  const boxes = useMemo(() => {
    if (!labels) {
      return [];
    }
    const boxes = labels
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
  const { webcamRef, capture, img, result } = useApp();

  useEffect(() => {
    setInterval(() => {
      capture();
    }, 1000);
  }, []);

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
          <div style={{ position: "relative" }}>
            {img && (
              <Image src={img} alt="Screenshot" width={WIDTH} height={HEIGHT} />
            )}
            <BoundingBoxes labels={result?.Labels} />
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
