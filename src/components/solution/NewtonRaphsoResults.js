import React from "react";
import { NewtonRaphsonMethod } from "../../methods";
import DisplayMatrix from "./DisplayMatrix";
import * as math from "mathjs";
import { tCalc } from "../../methods";
import { isLT } from "../../utils";

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

const BarStateTable = (data, NB, roundTo) => {
  const solution = data[data.length - 1];
  let lines = [];
  for (let i = 0; i < NB; i++) {
    lines.push(
      <tr className="text-center hover:bg-blue-400 hover:text-white" key={i}>
        <td className="px-2">{i + 1}</td>
        <td className="px-2">{math.round(solution["Pcalc"][i], roundTo)}</td>
        <td className="px-2">{math.round(solution["Qcalc"][i], roundTo)}</td>
        <td className="px-2">{math.round(solution["V"]._data[i], roundTo)}</td>
        <td className="px-2">
          {math.round((solution["theta"]._data[i] * 180) / Math.PI, roundTo)}
        </td>
        <td className="px-2">
          {math.round(solution["theta"]._data[i], roundTo)}
        </td>
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

const PowerFlowStateTable = (data, equips, NR, roundTo) => {
  const solution = data[data.length - 1];

  let lines = [];
  let pf_data = [];
  let totalLoss = math.complex(0, 0);
  let equips_arr = Object.values(equips);
  equips_arr.forEach((equip) => {
    let k = parseInt(equip.endPointA) - 1;
    let m = parseInt(equip.endPointB) - 1;
    let t = undefined;
    if (isLT(equip)) {
      //LT
      t = 1;
    } else {
      //TR
      t = tCalc(equip);
    }
    let ykm = math.divide(1, math.complex(equip.r_pu, equip.x_pu));
    let bsh = equip.bsh_pu / 2;

    let Vk = solution["V"]._data[k];
    let Vm = solution["V"]._data[m];
    let thetak = solution["theta"]._data[k];
    let thetam = solution["theta"]._data[m];
    let Ek = math.multiply(Vk, math.exp(math.complex(0, thetak)));
    let Em = math.multiply(Vm, math.exp(math.complex(0, thetam)));

    //USUAL TIPO 5 PAGINA 11:
    //k|----1:t---p--bsh--ykm--bsh--|m
    let sqrt_abs_t = math.sqrt(math.abs(t));
    let i_bsh = math.complex(0, bsh);
    let sqrt_abs_t_ykm = math.multiply(sqrt_abs_t, ykm);
    let ibsh_sqrt_abs_t = math.divide(i_bsh, sqrt_abs_t);

    let ikm_Ek = math.multiply(math.add(sqrt_abs_t_ykm, ibsh_sqrt_abs_t), Ek);
    let n_conj_t_ykm = math.multiply(math.multiply(math.conj(t), -1), ykm);
    let ikm_Em = math.multiply(n_conj_t_ykm, Em);

    let Ikm = math.add(ikm_Ek, ikm_Em);
    // console.log(k + 1, m + 1, Ikm);
    let n_t_ykm_Ek = math.multiply(-1, t, ykm, Ek);
    let ykm_ibsh_Em = math.multiply(math.add(ykm, i_bsh), Em);

    let Imk = math.add(n_t_ykm_Ek, ykm_ibsh_Em);
    // console.log(k + 1, m + 1, Imk);
    let Skm = math.multiply(Ek, math.conj(Ikm));
    // console.log(Skm);

    let Smk = math.multiply(Em, math.conj(Imk));
    let Sloss = math.add(Smk, Skm);
    totalLoss = math.add(totalLoss, Sloss);

    console.log(Sloss.toString(), totalLoss);
    pf_data.push({
      Ikm,
      Imk,
      Skm,
      Smk,
      Sloss,
    });
    console.log(math.round(Smk, roundTo), math.abs(Smk));
  });
  console.log(pf_data);
  for (let i = 0; i < NR; i++) {
    lines.push(
      <tr className="text-center hover:bg-blue-400 hover:text-white" key={i}>
        <td className="px-2">{equips_arr[i].endPointA}</td>
        <td className="px-2">{equips_arr[i].endPointB}</td>
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
    <div className="flex py-2">
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
      <div className="mt-2">
        <DisplayMatrix
          symbol={"Y"}
          unit={"pu"}
          matrix={Y}
          key={"admitance matrix"}
          roundTo={roundTo}
        ></DisplayMatrix>
      </div>
    </div>,
  ];
  results.push(Iterations(data, roundTo));
  results.push(BarStateTable(data, NB, roundTo));
  results.push(PowerFlowStateTable(data, equips, NR, roundTo));
  //   console.log(Object.values(equips));
  return results;
};

export default NewtonRaphsonResults;
