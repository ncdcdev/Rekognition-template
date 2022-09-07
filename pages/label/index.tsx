import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Image from "next/image";
import Link from 'next/link';
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

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const handleDevices = useCallback(async () => {
    let unmounted = false;

    const f = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (!unmounted) {
          setDevices(devices.filter((f) => f.kind === "videoinput"));
        }
      } catch (e) {
        console.error(e);
      }
    };

    f();

    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    let unmounted = false;
    const f = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (!unmounted) {
          handleDevices();
        }
      } catch (e) {
        console.error(e);
      }
    };
    f();
    return () => {
      unmounted = true;
    };
  }, [handleDevices]);

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

  return { webcamRef, capture, img, result, devices };
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
  const { webcamRef, capture, img, result, devices } = useApp();
  const [start, setStart] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>();

  const personNum = useMemo(() => {
    return (
      result?.Labels?.filter((f) => f.Name == "Person").flatMap(
        (f) => f.Instances
      ).length ?? 0
    );
  }, [result]);

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
        <h1>人数検出</h1>
        <div className="ml-auto mr-5">
          <Link href="/">ホーム画面に戻る</Link>
        </div>
      </header>
      <header>
        <h1 className="text-3xl font-bold">人数：{personNum}人</h1>
      </header>
          <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mx-1 my-1" onClick={() => setStart(true)}>Start</button>
          <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mx-1 my-1" onClick={() => setStart(false)}>Stop</button>
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
            videoConstraints={{ deviceId: deviceId }}
          />
          {start && <BoundingBoxes labels={result?.Labels} />}
        </div>
        <div>
          {devices.map((device, key) => (
            <button
              key={device.deviceId}
              onClick={() => setDeviceId(device.deviceId)}
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mx-1 my-1"
            >
              {device.label || `Device ${key + 1}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default App;
