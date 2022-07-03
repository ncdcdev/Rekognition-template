import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam"
import axios from "axios";
import Image from "next/image";
import { Data as SearchFacesByImageData } from "../api/matchFaces";
import { FaceListData } from "../api/collections";

const WIDTH = 320 * 1.5;
const HEIGHT = 240 * 1.5;

type Attendance = {
  name: string,
  isAttendance: boolean
}[]

const useApp = () => {
  const webcamRef = useRef<Webcam>(null);
  const [img, setImg] = useState<string | null>(null);
  const [result, setResult] = useState<SearchFacesByImageData>();
  const [attendanceList, setAttendanceList] = useState<Attendance>([])

  const capture = useCallback(async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      const img = screenshot.split(",")[1];
      const res = await axios.post<SearchFacesByImageData>("/api/matchFaces", {
        img: img,
      });
      if (res.data.member != null) {
        const updatedAttendanceList = attendanceList.map(attendance => {
          // 照合したメンバの出欠状態を変更する
          if (attendance.name === res.data.member) {
            return {
              ...attendance,
              isAttendance: true
            }
          }
          return attendance
        })
        setAttendanceList(updatedAttendanceList)
      }

      setResult(res.data);
      setImg(screenshot);
    }
  }, [webcamRef, attendanceList]);

  return { webcamRef, capture, img, result, attendanceList, setAttendanceList };
};

export const App = () => {
  const { webcamRef, capture, img, result, attendanceList, setAttendanceList } = useApp();

  useEffect(() => {
    (async () => {
      const res = await axios.get<FaceListData>("/api/collections");
      const initialAttendance = res.data.members.map(member => {
        return {
          name: member,
          isAttendance: false
        }
      })
      setAttendanceList(initialAttendance)
    })()
  }, [])

  return (
    <div>
      <header>
        <h1>出欠確認</h1>
      </header>
      <table>
        <thead>
          <tr>
            <th>名前</th>
            <th>出欠</th>
          </tr>
        </thead>
        <tbody>
          {attendanceList.map((attendance, index) =>
            <tr key={index}>
              <td>{attendance.name}</td>
              <td>{attendance.isAttendance ? "○" : "×"}</td>
            </tr>
          )}

        </tbody>
      </table>

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
          <button onClick={capture}>出欠確認</button>
        </div>
      </div>
    </div>
  );
};
export default App;
