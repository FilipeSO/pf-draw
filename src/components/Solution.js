import React, { useState, useEffect } from "react";
import { NewtonRaphsonMethod } from "../methods";

const Solution = ({ bars, equips, solve }) => {
  const [solution, setSolution] = useState([]);

  const updateSolution = newState => {
    setSolution(newState, console.log("Atualizou o state"));
  };
  useEffect(() => {
    const NB = bars ? Object.keys(bars).length : 0;
    const NR = equips ? Object.keys(equips).length : 0;
    if (NB === 0 || NR === 0) {
      setSolution(<div>Aguardando dados...</div>);
    } else {
      NewtonRaphsonMethod(bars, equips, NB, NR, updateSolution, 0.01);
    }
  }, [solve]);
  return (
    <div className="flex flex-col items-center justify-center">{solution}</div>
  );
};

export default Solution;
