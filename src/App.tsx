import { useEffect, useState } from "react";
import "./App.css";

type Solfege = [number, string];
const SOLFEGES: Solfege[] = [
  [1, "do"],
  [2, "re"],
  [3, "mi"],
  [4, "fa"],
  [5, "sol"],
  [6, "la"],
  [7, "si"],
];

const DEFAULT_BATCH_SIZE = 5;

function genRandomSolfege(): [number, string] {
  return SOLFEGES[Math.floor(Math.random() * SOLFEGES.length)];
}

function genRandomSolfegeBatch(size: number) {
  return new Array(size).fill(undefined).map(() => genRandomSolfege());
}

function SolfegeCard({ solfege: [number, name] }: { solfege: Solfege }) {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      className="solfege-card"
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {isHover ? name : number}
    </div>
  );
}

function MemorizeSolfege() {
  const [solfegeBatch, setSolfgeBatch] = useState(
    genRandomSolfegeBatch(DEFAULT_BATCH_SIZE)
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setSolfgeBatch(genRandomSolfegeBatch(DEFAULT_BATCH_SIZE));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setSolfgeBatch]);

  return (
    <div className="solfege-container">
      {solfegeBatch.map((solfege) => (
        <SolfegeCard solfege={solfege} />
      ))}
    </div>
  );
}

function App() {
  return (
    <>
      <h2>memorize solfege</h2>
      <MemorizeSolfege />
      <br />
      <div>
        built with ❤️ by <a href="https://catnipan.com">@catnipan</a>
      </div>
    </>
  );
}

export default App;
