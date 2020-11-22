import React, { useState, useEffect } from "react";
import { CalcY } from "../methods";
import * as math from "mathjs";

const DisplayMatrix = (matrix) => {
  return (
    <div className="flex items-center justify-center">
      <div>Y=</div>
      <table>
        <tbody>
          <tr>
            <td className="px-2">1.4489+j22.1489</td>
            <td className="px-2">1.4489+j22.1489</td>
            <td className="px-2">1.4489+j22.1489</td>
          </tr>
          <tr class="bg-green-200">
            <td className="px-2">1.4489+j22.1489</td>
            <td className="px-2">1.4489+j22.1489</td>
            <td className="px-2">1.4489+j22.1489</td>
          </tr>
          <tr>
            <td className="px-2">1.4489+j22.1489</td>
            <td className="px-2">1.4489+j22.1489</td>
            <td className="px-2">1.4489+j22.1489</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Solution = ({ bars, equips }) => {
  console.log(bars, equips);
  const [solution, setSolution] = useState([<div key={"solver"}>Solução</div>]);

  useEffect(() => {
    const NB = bars ? Object.keys(bars).length : 0;
    const NR = equips ? Object.keys(equips).length : 0;
    if (NB === 0 && NR === 0) {
      setSolution(<div>Aguardando dados</div>);
    } else {
      const Y = CalcY(equips, NB, NR);
      console.log(Y);
      setSolution([
        <div key={"solver"}>Solução Newton:</div>,
        <DisplayMatrix matrix={Y} key={1}></DisplayMatrix>,
      ]);
    }
  }, [equips, bars]);
  //   if (NB === 0 && NR === 0)
  //     return (
  //       <div className="flex items-center justify-center">Aguardando dados</div>
  //     );

  return (
    <div className="flex flex-col items-center justify-center">{solution}</div>
  );
};

export default Solution;
