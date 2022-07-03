import Link from 'next/link'

export const App = () => {
  return (
    <ul>
      <li>
        <Link href="/">
          <a>ラベル検出</a>
        </Link>
      </li>
      <li>
        <Link href="/indexFace">
          <a>インデックス登録</a>
        </Link>
      </li>
      <li>
        <Link href="/matchFace">
          <a>照合</a>
        </Link>
      </li>
      <li>
        <Link href="/collection">
          <a>コレクション登録/削除</a>
        </Link>
      </li>
    </ul>
  )
}

export default App