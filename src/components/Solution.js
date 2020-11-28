import React, { useState, useEffect } from "react";
import { NewtonRaphsonMethod } from "../methods";
import * as math from "mathjs";

const Solution = ({ bars, equips, solver }) => {
  const [solution, setSolution] = useState([]);
  console.log(bars, equips);
  useEffect(() => {
    console.log("EFFECT", solver);
    const NB = bars ? Object.keys(bars).length : 0;
    const NR = equips ? Object.keys(equips).length : 0;
    if (NB === 0 || NR === 0) {
      setSolution(<div>Aguardando dados...</div>);
    } else {
      const err_tolerance = 0.01;
      let [Y, data, PQ_PV_index, PQ_index] = NewtonRaphsonMethod(
        bars,
        equips,
        NB,
        NR,
        err_tolerance
      );
      console.log(data);
      let theta_vector = PQ_PV_index.map((elem) => (
        <div>
          {String.fromCharCode(952)}
          <sub>{elem}</sub>
        </div>
      ));
      let v_vector = PQ_index.map((elem) => (
        <div>
          V<sub>{elem}</sub>
        </div>
      ));

      let results = [
        <div className="flex flex-col py-2 items-center justify-center">
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
            <div className="flex">
              <div>X</div>
              <div className="px-2">=</div>
              <div className="flex space-x-2 border-solid border-l-2 border-r-2 border-black px-1">
                {theta_vector}
                {v_vector}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div>J</div>
              <div className="px-2">=</div>
              <div className="border-solid border-l-2 border-r-2 border-black px-1">
                <div className="flex space-x-4">
                  <div className="flex flex-col ">
                    <div className="border-solid border-b-2 border-black">
                      &part;P
                    </div>
                    <div>&part;{String.fromCharCode(952)}</div>
                  </div>
                  <div className="flex flex-col ">
                    <div className="border-solid border-b-2 border-black">
                      &part;Q
                    </div>
                    <div>&part;V</div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex flex-col ">
                    <div className="border-solid border-b-2 border-black">
                      &part;P
                    </div>
                    <div>&part;{String.fromCharCode(952)}</div>
                  </div>
                  <div className="flex flex-col ">
                    <div className="border-solid border-b-2 border-black">
                      &part;Q
                    </div>
                    <div>&part;V</div>
                  </div>
                </div>
              </div>
            </div>

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
          </div>
          <h2 key={"parameters header"} className="text-md">
            Parameters:
          </h2>
          <DisplayMatrix
            symbol={"Y"}
            unit={"pu"}
            matrix={Y}
            key={"admitance matrix"}
          ></DisplayMatrix>
        </div>,
      ];
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          results.push(
            <div className="flex flex-wrap justify-center items-center space-x-4 px-4 py-2 border-dashed border-solid border-t-2 border-black">
              <div className="text-xs">Iteration {data[i].iteration}:</div>
              <DisplayMatrix
                symbol={"V"}
                unit={"pu"}
                matrix={data[i].V}
              ></DisplayMatrix>
              <DisplayMatrix
                symbol={String.fromCharCode(952)}
                unit={"rad"}
                matrix={data[i].theta}
              ></DisplayMatrix>
              <DisplayMatrix
                symbol={
                  <div className="flex flex-col border-solid border-l-2 border-r-2 border-black px-1">
                    <div>{String.fromCharCode(916)}P</div>
                    <div>{String.fromCharCode(916)}Q</div>
                  </div>
                }
                matrix={math.matrix(data[i].g)}
              ></DisplayMatrix>
            </div>
          );
        } else {
          results.push(
            <div className="flex flex-wrap justify-center items-center px-4 py-2 border-dashed border-solid border-t-2 border-black">
              <div className="text-xs">Iteration {data[i].iteration}:</div>
              <div>
                <div className="py-1">
                  <DisplayMatrix
                    symbol={"J"}
                    matrix={math.matrix(data[i].J)}
                  ></DisplayMatrix>
                </div>

                <div className="flex flex-wrap space-x-4 items-center justify-center">
                  <DisplayMatrix
                    symbol={"V"}
                    unit={"pu"}
                    matrix={data[i].V}
                  ></DisplayMatrix>
                  <DisplayMatrix
                    symbol={String.fromCharCode(952)}
                    unit={"rad"}
                    matrix={data[i].theta}
                  ></DisplayMatrix>
                  <DisplayMatrix
                    symbol={
                      <div className="flex flex-col border-solid border-l-2 border-r-2 border-black px-1">
                        <div>{String.fromCharCode(916)}P</div>
                        <div>{String.fromCharCode(916)}Q</div>
                      </div>
                    }
                    matrix={math.matrix(data[i].g)}
                  ></DisplayMatrix>
                </div>
              </div>
            </div>
          );
        }
      }
      setSolution(results);
    }
  }, [bars, equips, solver]);
  return (
    <div className="flex flex-col items-center justify-center">{solution}</div>
  );
};

const DisplayMatrix = ({ symbol, matrix, unit }) => {
  let td = [];
  let tr = [];

  console.log("VAI UPDATE");

  const n_rows = matrix._size[0];
  let n_cols = 0;

  if (matrix._size.length > 1) {
    n_cols = matrix._size[1];
    for (let i = 0; i < n_rows; i++) {
      for (let j = 0; j < n_cols; j++) {
        let value = math.round(matrix._data[i][j], 4);
        td.push(
          <td className="px-2" key={j}>
            {value.toString()}
          </td>
        );
      }
      tr.push(
        <tr className="text-center" key={i}>
          {td}
        </tr>
      );
      td = [];
    }
  } else {
    for (let i = 0; i < n_rows; i++) {
      let value = math.round(matrix._data[i], 4);
      tr.push(
        <tr className="text-center" key={i}>
          <td className="px-2" key={i}>
            {value.toString()}
          </td>
        </tr>
      );
    }
  }
  return (
    <div className="flex flex-wrap items-center justify-center">
      <div
        className="mr-2 flex flex-row items-center justify-center"
        style={{ whiteSpace: "nowrap" }}
      >
        {symbol}
        <div className="ml-2">=</div>
      </div>
      <div
        className="overflow-auto"
        style={{ maxHeight: "350px", maxWidth: "350px" }}
      >
        <table
          className="table-fixed border-solid border-l-2 border-r-2 border-black"
          style={{ whiteSpace: "nowrap" }}
        >
          <tbody>{tr}</tbody>
        </table>
      </div>
      {unit && (
        <div className="ml-2" style={{ whiteSpace: "nowrap" }}>
          [{unit}]
        </div>
      )}
    </div>
  );
};

export default Solution;
