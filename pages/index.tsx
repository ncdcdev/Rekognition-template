import Link from "next/link";
import Image from "next/image";

const App = () => {
  const contents = [
    {
      linkPass: "/label",
      title: "人数検出",
      detail: "カメラに写っている人を検知して、その人数を表示するサンプルアプリケーションです。人を検知すると画像内で赤枠で囲んで表示します。",
      image: "/image/detect_person.png",
    },
    {
      linkPass: "/indexFace",
      title: "メンバー登録",
      detail: "メンバーの顔の画像を登録するンプルアプリケーションです。顔と名前を登録すると出欠確認が出来るようになります。",
      image: "/image/register_face.png",
    },
    {
      linkPass: "/matchFace",
      title: "出欠確認",
      detail: "メンバー登録アプリケーションで登録した顔の画像を使って、出欠確認を行うサンプルアプリケーションです。カメラに写っている人の顔を検知して出席登録します。",
      image: "/image/match_face.png",
    },
    {
      linkPass: "/analysisFace",
      title: "表情分析",
      detail: "カメラに写っている人の表情を分析して、その結果を表示するサンプルアプリケーションです。カメラに写っている人の顔を検知してその顔の表情を分析します。",
      image: "/image/analysis_face.png",
    },
  ];

  return (
    <>
      <header>
        <h1>画像解析アプリケーション</h1>
      </header>

      <div className="container">
        {contents.map((content) => {
          return (
            <div key={content.title}>
              <Link href={content.linkPass}>
                <div className="card card-skin">
                  <Image
                    className="card__imgframe"
                    src={content.image ?? "/image/No-Image.png"}
                    alt=""
                    width={300}
                    height={200}
                    objectFit="contain"
                  />
                  <div className="card__textbox">
                    <div className="card__titletext">{content.title}</div>
                    <div className="card__overviewtext">{content.detail}</div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      <style jsx>{`
      header {
        margin 0;
        width: 100%;
        background-color: #14b8a6;
        margin-bottom: 100px;
      }

      h1 {
        font-size: 30px;
        color: #fff;
        text-align: center;
        padding: 20px;
      }

      .container {
        display: flex;
        margin: 0 auto;
        justify-content: space-around;
      }

      .card{
        width: 320px;
        height: auto;
      }
      .card__imgframe{
        max-width: 100%;
        height: auto;
      }
      .card__textbox{
        width: 100%;
        height: auto;
        padding: 20px 18px;
        background: #ffffff;
        box-sizing: border-box;
      }
      .card__textbox > * + *{
        margin-top: 10px;
      }
      .card__titletext{
        font-size: 24px;
        font-weight: bold;
        line-height: 125%;
      }
      .card__overviewtext{
        font-size: 18px;
        line-height: 150%;
      }
      .card-skin{
        cursor: pointer;
        box-shadow: 2px 2px 6px rgba(0,0,0,.4);
      }
    `}</style>
    </>
  );
};

export default App;
