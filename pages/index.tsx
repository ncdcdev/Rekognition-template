import Link from 'next/link'

export const App = () => {
  const contents = [
    {
      linkPass: "/label",
      title: "ラベル検出",
      detail: "説明",
      image: null
    },
    {
      linkPass: "/indexFace",
      title : "インデックス登録",
      detail: "説明",
      image: null
    },
    {
      linkPass: "/matchFace",
      title : "照合",
      detail: "説明",
      image: null
    },
    {
      linkPass: "/collection",
      title : "コレクション登録/削除",
      detail: "説明",
      image: null
    }
  ];

  return (
    <>
      <header>
        <h1>Rekognition</h1>
      </header>

      <div className="container">
        {contents.map(content => {
          return (
            <div key={content.title}>
              <Link href={content.linkPass}>
                <div className="card card-skin">
                  <img className="card__imgframe" src={content.image ?? "/image/No-Image.png"} alt="" />
                  <div className="card__textbox">
                    <div className="card__titletext">
                      {content.title}
                    </div>
                    <div className="card__overviewtext">
                      {content.detail}
                    </div>
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
        padding: 10px;
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
        font-size: 20px;
        font-weight: bold;
        line-height: 125%;
      }
      .card__overviewtext{
        font-size: 12px;
        line-height: 150%;
      }
      .card-skin{
        cursor: pointer;
        box-shadow: 2px 2px 6px rgba(0,0,0,.4);
      }
    `}</style>
  </>
  )
}

export default App