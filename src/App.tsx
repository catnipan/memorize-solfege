import { useCallback, useEffect, useState } from "react";
import { interval, noop, take, tap } from "rxjs";

import audioDo from "./assets/do.mp3";
import audioRe from "./assets/re.mp3";
import audioMi from "./assets/mi.mp3";
import audioFa from "./assets/fa.mp3";
import audioSol from "./assets/sol.mp3";
import audioLa from "./assets/la.mp3";
import audioSi from "./assets/si.mp3";

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

const CardColor: { [key: number]: string } = {
  1: "hover:bg-red-50 hover:border-red-500 hover:shadow-red-100 hover:text-red-500",
  2: "hover:bg-orange-50 hover:border-orange-500 hover:shadow-orange-100 hover:text-orange-500",
  3: "hover:bg-yellow-50 hover:border-yellow-500 hover:shadow-yellow-100 hover:text-yellow-500",
  4: "hover:bg-green-50 hover:border-green-500 hover:shadow-green-100 hover:text-green-500",
  5: "hover:bg-blue-50 hover:border-blue-500 hover:shadow-blue-100 hover:text-blue-500",
  6: "hover:bg-purple-50 hover:border-purple-500 hover:shadow-purple-100 hover:text-purple-500",
  7: "hover:bg-fuchsia-50 hover:border-fuchsia-500 hover:shadow-fuchsia-100 hover:text-fuchsia-500",
};

const CardAudio: { [key: number]: [string, number] } = {
  1: [audioDo, 0.4],
  2: [audioRe, 0.5],
  3: [audioMi, 0.5],
  4: [audioFa, 0.4],
  5: [audioSol, 0.4],
  6: [audioLa, 0.5],
  7: [audioSi, 0.9],
};

const refreshIcon = (
  <svg
    viewBox="0 0 24 24"
    width="40"
    height="40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function getRandom(l: number, r: number): number {
  return l + Math.floor(Math.random() * (r - l));
}

function genRandomSolfege(): [number, string] {
  return SOLFEGES[getRandom(0, SOLFEGES.length)];
}

function SolfegeCard({ solfege: [number, name] }: { solfege: Solfege }) {
  return (
    <button
      className={`text-7xl font-semibold border-4 border-transparent text-center card ${CardColor[number]} transition-all`}
      onClick={() => {
        const [src, offset] = CardAudio[number];
        const audio = new Audio(src);
        audio.currentTime = offset;
        audio.play();
      }}
    >
      <div className="number">{number}</div>
      <div className="name">{name}</div>
    </button>
  );
}

function App() {
  const [solfegeBatch, setSolfgeBatch] = useState(SOLFEGES);
  const refresh = useCallback(() => {
    interval(30)
      .pipe(
        take(SOLFEGES.length),
        tap((idx) => {
          setSolfgeBatch((prev) => {
            const next = [...prev];
            while (true) {
              const candidate = genRandomSolfege();
              if (candidate === next[idx]) continue;
              next[idx] = candidate;
              break;
            }
            return next;
          });
        })
      )
      .subscribe(noop);
  }, [setSolfgeBatch]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        refresh();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [refresh]);

  return (
    <div className="flex flex-col min-h-screen text-center p-4">
      <header>
        <h1 className="text-2xl">memorize solfège</h1>
      </header>
      <div className="flex-grow flex flex-col items-center justify-center my-4">
        <div className="flex flex-row flex-wrap items-center justify-center">
          {solfegeBatch.map((solfege, idx) => (
            <SolfegeCard key={idx} solfege={solfege} />
          ))}
        </div>
      </div>
      <footer>
        <button
          onClick={refresh}
          className="p-1 rounded-lg hover:bg-gray-100 active:translate-y-1"
        >
          {refreshIcon}
        </button>
      </footer>
    </div>
  );
}

export default App;
