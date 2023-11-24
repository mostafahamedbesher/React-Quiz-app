import { useEffect } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Main from "./Main";
import Result from "./Result";
import Error from "./Error";
import { useQuiz } from "../contexts/QuizContext";

// const BASE_URL = "http://localhost:8000";
const BASE_URL = "https://reactquiz-server.onrender.com";

export default function App() {
  const { status, dispatch, maxQuestionNo, questions } = useQuiz();

  function handleStart() {
    dispatch({ type: "setStatus", payload: { status: "active" } });
  }

  useEffect(function () {
    //fetch questions (fake API)
    async function fetchQuestions() {
      try {
        dispatch({ type: "setStatus", payload: { status: "loading" } });
        const res = await fetch(`${BASE_URL}/questions`);
        questions.current = await res.json();

        dispatch({ type: "setStatus", payload: { status: "ready" } });
      } catch (err) {
        dispatch({ type: "setStatus", payload: { status: "error" } });
      }
    }

    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />

      {status === "loading" && <Loader />}

      {status === "error" && <Error />}

      {status === "ready" && (
        <Start onStart={handleStart} maxQuestionNo={maxQuestionNo} />
      )}

      {status === "finished" && <Result />}

      {status === "active" && <Main />}
    </div>
  );
}

function Start({ onStart, maxQuestionNo }) {
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{maxQuestionNo} questions to test your React mastery</h3>
      <button className="btn" onClick={onStart}>
        Let's start
      </button>
    </div>
  );
}
