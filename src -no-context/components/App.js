import { useReducer, useEffect, useRef } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Main from "./Main";
import Result from "./Result";
import Error from "./Error";

export default function App() {
  let maxQuestionNo = 15;
  let maxPoints = 280;

  const timeSeconds = 7.5 * 60;

  const intialState = {
    questionNo: 1,
    pointsSum: 0,
    isAnswer: false,
    isSelectedAnswer: false,
    disabled: false,
    status: "loading",
    time: timeSeconds,
  };

  const [state, dispatch] = useReducer(reducer, intialState);

  const {
    questionNo,
    pointsSum,
    isAnswer,
    isSelectedAnswer,
    disabled,
    status,
    time,
  } = state;

  const questions = useRef([]);
  // const maxQuestionNo = questions?.current?.length;
  // const maxPoints = questions?.current?.reduce(
  //   (prev, cur) => prev + cur.points,
  //   0
  // );

  function reducer(state, action) {
    switch (action.type) {
      case "setStatus":
        return {
          ...state,
          status: action.payload.status,
        };
      case "next": {
        if (state.questionNo === maxQuestionNo) {
          return {
            ...state,
            questionNo: state.questionNo,
            isAnswer: false,
            status: "finished",
            isSelectedAnswer: false,
          };
        }

        return {
          ...state,
          questionNo: state.questionNo + 1,
          isAnswer: false,
          isSelectedAnswer: false,
          disabled: false,
        };
      }
      case "selectAnswer": {
        let finalPoints;
        if (action.payload.answerIndex === action.payload.correctOption) {
          finalPoints = state.pointsSum + action.payload.points;
        } else {
          finalPoints = state.pointsSum;
        }

        return {
          ...state,
          pointsSum: finalPoints,
          isAnswer: !state.isAnswer,
          isSelectedAnswer: true,
          disabled: true,
        };
      }
      case "restart": {
        return { ...intialState, status: "ready" };
      }
      case "timer": {
        return {
          ...state,
          time: state.time - 1,
          status: state.time === 0 ? "finished" : state.status,
        };
      }
      default:
        throw new Error("Unknown");
    }
  }

  function handleStart() {
    dispatch({ type: "setStatus", payload: { status: "active" } });
  }

  useEffect(function () {
    //fetch questions (fake API)
    async function fetchQuestions() {
      try {
        dispatch({ type: "setStatus", payload: { status: "loading" } });
        const res = await fetch("http://localhost:8000/questions");
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

      {status === "finished" && (
        <Result
          pointsSum={pointsSum}
          dispatch={dispatch}
          maxPoints={maxPoints}
        />
      )}

      {status === "active" && (
        <Main
          questionNo={questionNo}
          pointsSum={pointsSum}
          isAnswer={isAnswer}
          dispatch={dispatch}
          questions={questions}
          isSelectedAnswer={isSelectedAnswer}
          disabled={disabled}
          maxQuestionNo={maxQuestionNo}
          maxPoints={maxPoints}
          time={time}
        />
      )}

      {/* {status === "error" ? (
        <Error />
      ) : status === "ready" ? (
        <Start onStart={handleStart} />
      ) : status === "finished" ? (
        <Result
          pointsSum={pointsSum}
          dispatch={dispatch}
          maxPoints={maxPoints}
        />
      ) : (
        status === "active" && (
          <Main
            questionNo={questionNo}
            pointsSum={pointsSum}
            isAnswer={isAnswer}
            dispatch={dispatch}
            questions={questions}
            isSelectedAnswer={isSelectedAnswer}
            disabled={disabled}
            maxQuestionNo={maxQuestionNo}
            maxPoints={maxPoints}
          />
        )
      )} */}
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
