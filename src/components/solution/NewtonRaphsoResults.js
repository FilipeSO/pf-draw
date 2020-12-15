import React from "react";
import { NewtonRaphsonMethod } from "../../methods";
import DisplayMatrix from "./DisplayMatrix";
import * as math from "mathjs";

const StateVariables = ({ PQ_PV_index, PQ_index }) => {
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
  return (
    <div className="flex py-2">
      <div>X</div>
      <div className="px-2">=</div>
      <div
        className="flex space-x-2 border-solid border-l-2 border-r-2 border-black px-1 overflow-auto"
        style={{ maxHeight: "350px", maxWidth: "350px" }}
      >
        {theta_vector}
        {v_vector}
      </div>
    </div>
  );
};

const NewtonRaphsonMethodDefinition = () => {
  return (
    <div className="flex items-center justify-center py-2">
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
    <div className="flex items-center justify-center py-2">
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

const SolutionIntro = ({ Y, roundTo, PQ_PV_index, PQ_index }) => {
  return (
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
        <StateVariables
          PQ_PV_index={PQ_PV_index}
          PQ_index={PQ_index}
        ></StateVariables>
        <NewtonRaphsonJacobianDefinition></NewtonRaphsonJacobianDefinition>
        <NewtonRaphsonMethodDefinition></NewtonRaphsonMethodDefinition>
      </div>
      <div className="mt-2">
        <DisplayMatrix
          symbol={"Y"}
          unit={"pu"}
          matrix={Y}
          key={"admitance matrix"}
          roundTo={roundTo}
        ></DisplayMatrix>
      </div>
    </div>
  );
};

const Iterations = (data, roundTo) => {
  let results = [];
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

const BarStateTable = (state, NB, roundTo) => {
  let lines = [];
  for (let i = 0; i < NB; i++) {
    lines.push(
      <tr className="text-center hover:bg-blue-400 hover:text-white" key={i}>
        <td className="px-2">{i + 1}</td>
        <td className="px-2">{math.round(state["Pcalc"][i], roundTo)}</td>
        <td className="px-2">{math.round(state["Qcalc"][i], roundTo)}</td>
        <td className="px-2">{math.round(state["V"]._data[i], roundTo)}</td>
        <td className="px-2">
          {math.round((state["theta"]._data[i] * 180) / Math.PI, roundTo)}
        </td>
        <td className="px-2">{math.round(state["theta"]._data[i], roundTo)}</td>
      </tr>
    );
  }

  let result = (
    <div
      key={"bar state table"}
      className="border-dashed border-solid border-t-2 border-black py-2"
    >
      <table>
        <thead>
          <tr className="border-solid border-b-2 border-black">
            <th className="px-2">Bar</th>
            <th className="px-2">P [pu]</th>
            <th className="px-2">Q [pu]</th>
            <th className="px-2">V [pu]</th>
            <th className="px-2">{String.fromCharCode(952)} [deg]</th>
            <th className="px-2">{String.fromCharCode(952)} [rad]</th>
          </tr>
        </thead>
        <tbody>{lines}</tbody>
      </table>
    </div>
  );
  return result;
};

const PowerFlowStateTable = (state, NR, roundTo) => {
  const pf_data = state.pf_data;
  const totalLoss = state.totalLoss;
  let lines = [];

  for (let i = 0; i < NR; i++) {
    lines.push(
      <tr className="text-center hover:bg-blue-400 hover:text-white" key={i}>
        <td className="px-2">{pf_data[i]["k"] + 1}</td>
        <td className="px-2">{pf_data[i]["m"] + 1}</td>
        <td className="px-2">
          {math.round(pf_data[i]["Ikm"].toPolar()["r"], roundTo)}
          {"∠"}
          {math.round(pf_data[i]["Ikm"].toPolar()["phi"], roundTo)}
          {"°"}
        </td>
        <td className="px-2">
          {math.round(pf_data[i]["Imk"].toPolar()["r"], roundTo)}
          {"∠"}
          {math.round(pf_data[i]["Imk"].toPolar()["phi"], roundTo)}
          {"°"}
        </td>
        <td className="px-2">
          {math.round(pf_data[i]["Skm"], roundTo).toString()}
        </td>
        <td className="px-2">
          {math.round(pf_data[i]["Smk"], roundTo).toString()}
        </td>
        <td className="px-2">
          {math.round(pf_data[i]["Sloss"], roundTo).toString()}
        </td>
      </tr>
    );
  }

  let result = (
    <div
      key={"branch state table"}
      className="border-dashed border-solid border-t-2 border-black py-2"
    >
      <table>
        <thead>
          <tr className="border-solid border-b-2 border-black">
            <th className="px-2">k</th>
            <th className="px-2">m</th>
            <th className="px-2">
              I<sub>km</sub>[pu]
            </th>
            <th className="px-2">
              I<sub>mk</sub>[pu]
            </th>
            <th className="px-2">
              S<sub>km</sub>[pu]
            </th>
            <th className="px-2">
              S<sub>mk</sub>[pu]
            </th>
            <th className="px-2">
              S<sub>loss</sub>[pu]
            </th>
          </tr>
        </thead>
        <tbody>{lines}</tbody>
        <thead>
          <tr className="border-solid border-t-2 border-black">
            <th className="px-2"></th>
            <th className="px-2"></th>
            <th className="px-2"></th>
            <th className="px-2"></th>
            <th className="px-2"></th>
            <th className="px-2">Total Loss</th>
            <th className="px-2">
              {math.round(totalLoss, roundTo).toString()}
            </th>
          </tr>
        </thead>
      </table>
    </div>
  );
  return result;
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

  let results = [
    <SolutionIntro
      key={"solution intro"}
      PQ_PV_index={PQ_PV_index}
      PQ_index={PQ_index}
      Y={Y}
      roundTo={roundTo}
    ></SolutionIntro>,
  ];
  const solutionState = data[data.length - 1];
  // console.log("SOL", solutionState);
  for (let i = 0; i < NB; i++) {
    let barNum = i + 1;
    // let v = math.round(solutionState["V"]._data[i], roundTo);
    // let deg = math.round(
    //   (solutionState["theta"]._data[i] * 180) / Math.PI,
    //   roundTo
    // );
    let pf_data = solutionState.pf_data.filter(
      (data) => data.k === i || data.m === i
    );

    bars = {
      ...bars,
      [barNum.toString()]: {
        ...bars[barNum.toString()],
        // v_data: `${v}∠${deg}°`,
        v_data: math.Complex.fromPolar({
          r: solutionState["V"]._data[i],
          phi: solutionState["theta"]._data[i],
        }),
        pf_data: pf_data,
        roundTo: roundTo,
      },
    };
  }
  // console.log("BAR SOL", bars);
  results.push(Iterations(data, roundTo));
  results.push(BarStateTable(solutionState, NB, roundTo));
  results.push(PowerFlowStateTable(solutionState, NR, roundTo));
  //   console.log(Object.values(equips));
  return [results, bars];
};

export default NewtonRaphsonResults;
