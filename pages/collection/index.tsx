import axios from "axios";

export const App = () => {
  return (
    <div>
      <header>
        <h1>コレクション登録</h1>
        <button onClick={async () => { await axios.post("/api/collections",) }}>登録</button>
        <h1>コレクション削除</h1>
        <button onClick={async () => { await axios.delete("/api/collections",) }}>削除</button>
      </header>
    </div>
  );
};
export default App;

// d515a40b-a466-4230-88fa-ad6552935f8a