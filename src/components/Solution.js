import React, { useState, useEffect } from "react";
// import { NewtonRaphsonMethodResults } from "../methods";
import NewtonRaphsoResults from "./solution/NewtonRaphsoResults";

// import * as math from "mathjs";

const Solution = ({ bars, equips, solver, err_tolerance, updateBars }) => {
  const [solution, setSolution] = useState([]);
  useEffect(() => {
    console.log("EFFECT", solver, bars, equips);
    const NB = bars ? Object.keys(bars).length : 0;
    const NR = equips ? Object.keys(equips).length : 0;
    if (NB === 0 || NR === 0) {
      setSolution(<div>Waiting for data...</div>);
    } else {
      if (solver === "newton-raphson") {
        let [results, newBarState] = NewtonRaphsoResults(
          bars,
          equips,
          NB,
          NR,
          parseFloat(err_tolerance)
        );
        setSolution(results);
        updateBars(newBarState);
      } else if (solver === "fast-decoupled") {
        setSolution(<div>Fast Decoupled Method is in development...</div>);
      } else {
        setSolution(<div>Waiting for data...</div>);
      }
    }
    // eslint-disable-next-line
  }, [bars, equips, solver, err_tolerance]);

  return (
    <div className="flex flex-col items-center justify-center">{solution}</div>
  );
};

export default Solution;
