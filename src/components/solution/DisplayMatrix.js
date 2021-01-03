import React from "react";
import * as math from "mathjs";

const DisplayMatrix = ({ symbol, matrix, unit, roundTo }) => {
  let td = [];
  let tr = [];
  const n_rows = matrix._size[0];
  let n_cols = 0;

  if (matrix._size.length > 1) {
    n_cols = matrix._size[1];
    for (let i = 0; i < n_rows; i++) {
      for (let j = 0; j < n_cols; j++) {
        let value = math.round(matrix._data[i][j], roundTo);
        td.push(
          <td
            className="px-2 hover:bg-blue-400"
            title={`${i + 1}, ${j + 1}`}
            key={j}
          >
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
      let value = math.round(matrix._data[i], roundTo);
      tr.push(
        <tr className="text-center" key={i}>
          <td className="px-2 hover:bg-blue-400" key={i}>
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

export default DisplayMatrix;
