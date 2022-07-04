import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { SearchFacesByImageData } from "../api/matchFaces/batch";
import { FaceListData } from "../api/collections";

const WIDTH = 320 * 1.5;
const HEIGHT = 240 * 1.5;

type Attendance = {
  name: string;
  isAttendance: boolean;
}[];

const useApp = () => {
  const webcamRef = useRef<Webcam>(null);
  const [img, setImg] = useState<string | null>(null);
  const [result, setResult] = useState<SearchFacesByImageData>();
  const [attendanceList, setAttendanceList] = useState<Attendance>([]);

  const capture = useCallback(async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      const img = screenshot.split(",")[1];
      const res = await axios.post<SearchFacesByImageData>(
        "/api/matchFaces/batch",
        {
          img: img,
        }
      );
      if (res.data.members.length != 0) {
        const updatedAttendanceList = attendanceList.map((attendance) => {
          // 照合したメンバの出欠状態を変更する
          if (res.data.members.includes(attendance.name)) {
            return {
              ...attendance,
              isAttendance: true,
            };
          }
          return attendance;
        });
        setAttendanceList(updatedAttendanceList);
      }

      setResult(res.data);
      setImg(screenshot);
    }
  }, [webcamRef, attendanceList]);

  return { webcamRef, capture, img, result, attendanceList, setAttendanceList };
};

export const App = () => {
  const { webcamRef, capture, img, result, attendanceList, setAttendanceList } =
    useApp();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const res = await axios.get<FaceListData>("/api/collections");
      const uniqueMembers = Array.from(new Set(res.data.members)); // 重複排除
      const initialAttendance = uniqueMembers.map((member) => {
        return {
          name: member,
          isAttendance: false,
        };
      });
      setAttendanceList(initialAttendance);
    })();
  }, []);

  return (
    <div>
      <header className="flex-wrap bg-teal-500 text-white p-6 mb-6">
        <h1>出欠確認</h1>
      </header>

      <div className="flex">
        <div className={`w-[${WIDTH}px]`}>
          <div className="mb-6">
            <Webcam
              audio={false}
              width={WIDTH}
              height={HEIGHT}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
              onClick={async () => {
                setLoading(true);
                await capture();
                setLoading(false);
              }}
            >
              {loading ? "出欠確認中" : "出席確認"}
            </button>
          </div>
        </div>
        <div className={`flex-1`}>
          <div className="flex flex-wrap">
            {attendanceList.map((attendance, index) => {
              return (
                <div
                  key={index}
                  className={`ml-4 mb-4 w-[200px] border-2 ${
                    attendance.isAttendance
                      ? "border-sky-500"
                      : "border-red-500"
                  } rounded-lg`}
                >
                  <div className="flex justify-center">
                    <div>{attendance.name.toUpperCase()}</div>
                  </div>
                  <div className="flex justify-center">
                    <div>{attendance.isAttendance ? "○" : "×"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
