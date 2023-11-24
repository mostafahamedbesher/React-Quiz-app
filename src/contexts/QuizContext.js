import { createContext, useContext, useReducer, useRef } from "react";

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

const QuizContext = createContext();

function QuizProvider({ children }) {
  const [
    {
      questionNo,
      pointsSum,
      isAnswer,
      isSelectedAnswer,
      disabled,
      status,
      time,
    },
    dispatch,
  ] = useReducer(reducer, intialState);

  const questions = useRef([]);

  return (
    <QuizContext.Provider
      value={{
        questionNo,
        pointsSum,
        isAnswer,
        isSelectedAnswer,
        disabled,
        status,
        time,
        dispatch,
        maxQuestionNo,
        questions,
        maxPoints,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("using context outside of QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };
