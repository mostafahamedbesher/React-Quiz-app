import { useEffect, useRef } from "react";
import { useQuiz } from "../contexts/QuizContext";

function Main() {
  const {
    questionNo,
    pointsSum,
    isAnswer,
    isSelectedAnswer,
    disabled,
    time,
    dispatch,
    maxQuestionNo,
    questions,
    maxPoints,
  } = useQuiz();

  const { question, options, correctOption, points } =
    questions?.current[questionNo - 1];

  const selectedAnswerEl = useRef(null);

  const timerId = useRef(null);

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  function handleAnswer(index, e) {
    selectedAnswerEl.current = e.target.textContent;

    dispatch({
      type: "selectAnswer",
      payload: {
        points: points,
        correctOption: correctOption,
        answerIndex: index,
      },
    });
  }

  function handleNextAnswer() {
    dispatch({ type: "next" });
  }

  useEffect(
    function () {
      timerId.current = setInterval(() => {
        dispatch({ type: "timer" });
      }, 1000);

      //cleanup function
      return () => clearInterval(timerId.current);
    },
    [dispatch]
  );

  return (
    <main className="main">
      {/* split this jsx to Progress component */}
      <div className="progress">
        <progress
          max={maxQuestionNo}
          value={isAnswer ? questionNo : questionNo - 1}
        />
        <p>
          Question <strong>{questionNo}</strong> / {maxQuestionNo}
        </p>
        <p>
          <strong>{pointsSum}</strong> /{maxPoints}
        </p>
      </div>

      {/* split this jsx to Question component */}
      <div>
        <h4>{question}</h4>
        <div className="options">
          {options.map((option, i) => (
            <button
              className={`btn btn-option ${
                selectedAnswerEl.current === option ? "answer" : ""
              } ${
                isSelectedAnswer
                  ? i === correctOption
                    ? "correct"
                    : "wrong"
                  : ""
              }`}
              key={i}
              disabled={disabled}
              ref={selectedAnswerEl}
              onClick={(e) => handleAnswer(i, e)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="progress">
          <p className="timer">{`${minutes > 9 ? minutes : `0${minutes}`}:${
            seconds > 9 ? seconds : `0${seconds}`
          }`}</p>
          {isAnswer && (
            <button className="btn" onClick={handleNextAnswer}>
              {questionNo === 15 ? "Finish" : "Next"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default Main;
