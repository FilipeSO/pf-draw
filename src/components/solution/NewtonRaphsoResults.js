import React from "react";
import { NewtonRaphsonMethod } from "../../methods";
import DisplayMatrix from "./DisplayMatrix";
import * as math from "mathjs";

const NewtonRaphsonMethodDefinition = () => {
  return (
    <div className="flex items-center justify-center">
      <div>
        X<sup>m+1</sup>
      </div>
      <div className="px-2">=</div>
      <div className="flex items-center justify-center ">
        J<sup>-1</sup>
        <div className="flex flex-col border-solid border-l-2 border-r-2 border-black px-1">
          <div>{String.fromCharCode(916)}P</div>
          <div>{String.fromCharCode(916)}Q</div>
        </div>
        +X<sup>m</sup>
      </div>
    </div>
  );
};

const NewtonRaphsonJacobianDefinition = () => {
  return (
    <div className="flex items-center justify-center">
      <div>J</div>
      <div className="px-2">=</div>
      <div className="border-solid border-l-2 border-r-2 border-black px-1">
        <div className="flex space-x-4">
          <div className="flex flex-col ">
            <div className="border-solid border-b-2 border-black">&part;P</div>
            <div>&part;{String.fromCharCode(952)}</div>
          </div>
          <div className="flex flex-col ">
            <div className="border-solid border-b-2 border-black">&part;Q</div>
            <div>&part;V</div>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex flex-col ">
            <div className="border-solid border-b-2 border-black">&part;P</div>
            <div>&part;{String.fromCharCode(952)}</div>
          </div>
          <div className="flex flex-col ">
            <div className="border-solid border-b-2 border-black">&part;Q</div>
            <div>&part;V</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewtonRaphsonResults = (bars, equips, NB, NR, err_tolerance) => {
  let [Y, data, PQ_PV_index, PQ_index] = NewtonRaphsonMethod(
    bars,
    equips,
    NB,
    NR,
    err_tolerance
  );
  console.log(data);
  const roundTo = err_tolerance.toString().split(".")[1].length + 1;

  const theta_vector = PQ_PV_index.map((elem) => (
    <div key={elem}>
      {String.fromCharCode(952)}
      <sub>{elem}</sub>
    </div>
  ));
  const v_vector = PQ_index.map((elem) => (
    <div key={elem}>
      V<sub>{elem}</sub>
    </div>
  ));
  const StateVariables = () => (
    <div className="flex">
      <div>X</div>
      <div className="px-2">=</div>
      <div className="flex space-x-2 border-solid border-l-2 border-r-2 border-black px-1">
        {theta_vector}
        {v_vector}
      </div>
    </div>
  );

  let results = [
    <div
      key="method definition"
      className="flex flex-col py-2 items-center justify-center"
    >
      <h1>
        <a
          href="https://en.wikipedia.org/wiki/Power-flow_study"
          target="_blank"
          rel="noopener noreferrer"
          key={"definitions header"}
          className="text-lg"
        >
          Newton Raphson Method:
        </a>
      </h1>
      <div className="flex flex-col items-center justify-center border-dashed border-b-2 border-black py-2">
        <StateVariables></StateVariables>
        <NewtonRaphsonJacobianDefinition></NewtonRaphsonJacobianDefinition>
        <NewtonRaphsonMethodDefinition></NewtonRaphsonMethodDefinition>
      </div>
      <h2 key={"parameters header"} className="text-md">
        Parameters:
      </h2>
      <DisplayMatrix
        symbol={"Y"}
        unit={"pu"}
        matrix={Y}
        key={"admitance matrix"}
        roundTo={roundTo}
      ></DisplayMatrix>
    </div>,
  ];

  data.forEach((elem, index) => {
    if (index === 0) {
      results.push(
        <div
          key={elem.iteration}
          className="flex flex-wrap justify-center items-center space-x-4 px-4 py-2 border-dashed border-solid border-t-2 border-black"
        >
          <div className="text-xs">Iteration {elem.iteration}:</div>
          <DisplayMatrix
            symbol={"V"}
            unit={"pu"}
            matrix={elem.V}
            roundTo={roundTo}
          ></DisplayMatrix>
          <DisplayMatrix
            symbol={String.fromCharCode(952)}
            unit={"rad"}
            matrix={elem.theta}
            roundTo={roundTo}
          ></DisplayMatrix>
          <DisplayMatrix
            symbol={
              <div className="flex flex-col border-solid border-l-2 border-r-2 border-black px-1">
                <div>{String.fromCharCode(916)}P</div>
                <div>{String.fromCharCode(916)}Q</div>
              </div>
            }
            matrix={math.matrix(elem.g)}
            roundTo={roundTo}
          ></DisplayMatrix>
        </div>
      );
    } else {
      results.push(
        <div
          key={elem.iteration}
          className="flex flex-wrap justify-center items-center px-4 py-2 border-dashed border-solid border-t-2 border-black"
        >
          <div className="text-xs">Iteration {elem.iteration}:</div>
          <div>
            <div className="py-1">
              <DisplayMatrix
                symbol={"J"}
                matrix={math.matrix(elem.J)}
                roundTo={roundTo}
              ></DisplayMatrix>
            </div>

            <div className="flex flex-wrap space-x-4 items-center justify-center">
              <DisplayMatrix
                symbol={"V"}
                unit={"pu"}
                matrix={elem.V}
                roundTo={roundTo}
              ></DisplayMatrix>
              <DisplayMatrix
                symbol={String.fromCharCode(952)}
                unit={"rad"}
                matrix={elem.theta}
                roundTo={roundTo}
              ></DisplayMatrix>
              <DisplayMatrix
                symbol={
                  <div className="flex flex-col border-solid border-l-2 border-r-2 border-black px-1">
                    <div>{String.fromCharCode(916)}P</div>
                    <div>{String.fromCharCode(916)}Q</div>
                  </div>
                }
                matrix={math.matrix(elem.g)}
                roundTo={roundTo}
              ></DisplayMatrix>
            </div>
          </div>
        </div>
      );
    }
  });
  return results;
};

export default NewtonRaphsonResults;
