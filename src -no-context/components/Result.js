import { useRef } from "react";

function Result({ pointsSum, dispatch, maxPoints }) {
  const pointsPer = Math.round((pointsSum / maxPoints) * 100);
  let emoji;
  const highscore = useRef(0);
  if (pointsSum >= highscore.current) highscore.current = pointsSum;

  if (pointsPer > 0 && pointsPer <= 50) emoji = "🤨";
  if (pointsPer > 50 && pointsPer < 80) emoji = "🙃";
  if (pointsPer >= 80) emoji = "🎉";
  if (pointsPer === 100) emoji = "🥇";
  if (pointsPer === 0) emoji = "🤦‍♂️";

  function handleRestartQuiz() {
    dispatch({ type: "restart" });
  }

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{pointsSum}</strong> points out
        of 280 ({pointsPer}%)
      </p>
      <p className="highscore">(Highscore: {highscore.current} points)</p>
      <button className="btn btn-ui" onClick={handleRestartQuiz}>
        Restart quiz
      </button>
    </>
  );
}

export default Result;
