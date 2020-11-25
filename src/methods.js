import React from "react";
import * as math from "mathjs";

const DisplayMatrix = ({ symbol, matrix, unit }) => {
  const n_rows = matrix._size[0];
  let n_cols = 0;
  let td = [];
  let tr = [];
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
      <div className="mr-2" style={{ whiteSpace: "nowrap" }}>
        {symbol} =
      </div>
      <div className="overflow-auto max-w-xl" style={{ maxHeight: "350px" }}>
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

const Y_CALC = (equips, NB, NR) => {
  const Y = math.zeros(NB, NB);

  for (let i = 0; i < NR; i++) {
    let EQUIPS = Object.values(equips);
    let k = parseInt(EQUIPS[i].endPointA) - 1;
    let m = parseInt(EQUIPS[i].endPointB) - 1;
    let t = 1;
    if (isNaN(EQUIPS[i].tap) === false) {
      t = math.multiply(
        EQUIPS[i].tap,
        math.exp(math.complex(0, (EQUIPS[i].tap_df_deg * Math.PI) / 180))
      );
    }
    let ykm = math.divide(1, math.complex(EQUIPS[i].r_pu, EQUIPS[i].x_pu));
    let bsh = EQUIPS[i].bsh_pu / 2;
    let sqrt_abs_t = math.sqrt(math.abs(t));
    let i_bsh = math.complex(0, bsh);
    // %USUAL TIPO 5 PAGINA 11:
    // %k|----1:t---p--bsh--ykm--bsh--|m
    Y._data[k][m] = math.subtract(
      Y._data[k][m],
      math.multiply(math.conj(t), ykm)
    );
    Y._data[m][k] = math.subtract(Y._data[m][k], math.multiply(t, ykm));
    Y._data[k][k] = math.add(
      math.add(Y._data[k][k], math.multiply(sqrt_abs_t, ykm)),
      math.divide(i_bsh, sqrt_abs_t)
    );
    Y._data[m][m] = math.add(math.add(Y._data[m][m], ykm), i_bsh);
  }
  return Y;
};

export const NewtonRaphsonMethod = (
  bars,
  equips,
  NB,
  NR,
  updateSolution,
  err_tolerance
) => {
  let BARS = Object.values(bars).sort((a, b) =>
    parseInt(a.name) > parseInt(b.name)
      ? 1
      : parseInt(b.name) > parseInt(a.name)
      ? -1
      : 0
  ); //ordernado por numero da barra

  const Y = Y_CALC(equips, NB, NR);
  updateSolution([
    <h1 key={"solver"} className="text-xl font-bold">
      Newton-Raphson Method
    </h1>,
  ]);

  const G = math.re(Y);
  const B = math.im(Y);
  let theta = math.matrix(BARS.map((bar) => (bar.theta_deg * Math.PI) / 180)); //theta [rad]
  let V = math.matrix(BARS.map((bar) => bar.v_pu));
  let PQ_index = BARS.filter((bar) => bar.tipo === 0).map((bar) =>
    parseInt(bar.name)
  ); //%numero barra tipo PQ
  let PV_index = BARS.filter((bar) => bar.tipo === 1).map((bar) =>
    parseInt(bar.name)
  ); //%numero barra tipo PV
  let Vtheta_index = BARS.filter((bar) => bar.tipo === 2).map((bar) =>
    parseInt(bar.name)
  ); //%numero barra tipo slack
  let Pesp = BARS.map((bar) => bar.p_g - bar.p_c);

  let Qesp = BARS.map((bar) => bar.q_g - bar.q_c);

  updateSolution((old) => [
    ...old,
    <h2 key={"definitions header"} className="text-lg">
      Initial Parameters:
    </h2>,
    <div
      key={"definitions"}
      className="flex justify-center items-center space-x-4"
    >
      <div key={"convergence error"}>
        {String.fromCharCode(1013)}: {err_tolerance}
      </div>
      <DisplayMatrix symbol={"V"} unit={"pu"} matrix={V}></DisplayMatrix>
      <DisplayMatrix
        symbol={String.fromCharCode(920)}
        unit={"rad"}
        matrix={theta}
      ></DisplayMatrix>
    </div>,
    <DisplayMatrix
      symbol={"Y"}
      unit={"pu"}
      matrix={Y}
      key={"admitance matrix"}
    ></DisplayMatrix>,
  ]);

  let iteration = 0;
  // let k = 1; //remember matrix zero based
  let Pcalc = P_CALC(V, theta, G, B, NB, equips);
  let Qcalc = Q_CALC(V, theta, G, B, NB, equips);

  console.log(Pcalc, Qcalc);
  // let k_index = k - 1;

  // let V_m = math.subset(V, math.index(m));
  // let V_k = math.subset(V, math.index(k_index));
  // let theta_m = math.subset(theta, math.index(m));
  // let theta_k = theta._data[k_index];
  // let theta_km = math.subtract(theta_k, theta_m);
  // let G_km = math.transpose(math.subset(G, math.index([k_index], m)));
  // let B_km = math.transpose(math.subset(B, math.index([k_index], m)));
  // let cos_theta_km = math.resize(math.cos(theta_km), G_km._size);
  // let G_km_cos_theta_km = math.dotMultiply(G_km, cos_theta_km);
  // let sin_theta_km = math.resize(math.sin(theta_km), B_km._size);
  // let B_km_sin_theta_km = math.dotMultiply(B_km, sin_theta_km);
  // let G_B_add = math.add(G_km_cos_theta_km, B_km_sin_theta_km);
  // let V_m_G_B = math.dotMultiply(math.resize(V_m, G_B_add._size), G_B_add);
  // let sum_V_m_G_B = math.sum(V_m_G_B);
  // let Pcalc = math.multiply(V_k, sum_V_m_G_B);
  // console.log(V_k, math.round(Pcalc, 4));

  // let Pcalc=V[k_index]*math.sum((math.multiply(V_m,(G_km.*cos(theta_km)+B_km.*sin(theta_km)));
  // console.log(k, m, V_m, math.cos(theta_km), G_km);

  // m = RAMOS.map((ramo) => parseInt(ramo.endPointA));
  // let sum = math.subtract(V, 1);
  // console.log(sum, V, math.ones(NB, 1));
  // console.log("SUBSET", math.subset(V, math.index([0, 2])));
  // let Pcalc=V(k)*sum(V_m.*(G_km.*cos(theta_km)+B_km.*sin(theta_km)));
  // <div key={iteration}>Iteration: {iteration}</div>,
};

const getRelatedEndPoint = (equips, k_index) => {
  let EQUIPS = Object.values(equips);
  // let k_index = k; //matrix is zero based
  let m = [];
  EQUIPS.forEach((equip) => {
    let endPointA = parseInt(equip.endPointA) - 1; //matrix is zero based
    let endPointB = parseInt(equip.endPointB) - 1; //matrix is zero based

    if (endPointA === k_index && m.indexOf(endPointB) === -1) {
      console.log("VOU ADD B", m, endPointB);
      m.push(endPointB); //matrix is zero based
    }
    if (endPointB === k_index && m.indexOf(endPointA) === -1) {
      console.log("VOU ADD A", m, endPointA);
      m.push(endPointA); //-matrix is zero based
    }
  });
  m.push(k_index);
  m.sort((a, b) => a - b);

  return m;
};

const P_CALC = (V, theta, G, B, NB, equips) => {
  let Pcalc = [];
  for (let i = 0; i < NB; i++) {
    let k_index = i;
    let m = getRelatedEndPoint(equips, k_index);
    let V_m = math.subset(V, math.index(m));
    let V_k = math.subset(V, math.index(k_index));
    let theta_m = math.subset(theta, math.index(m));
    let theta_k = theta._data[k_index];
    let theta_km = math.subtract(theta_k, theta_m);
    let G_km = math.transpose(math.subset(G, math.index([k_index], m)));
    let B_km = math.transpose(math.subset(B, math.index([k_index], m)));
    let cos_theta_km = math.resize(math.cos(theta_km), G_km._size);
    let G_km_cos_theta_km = math.dotMultiply(G_km, cos_theta_km);
    let sin_theta_km = math.resize(math.sin(theta_km), B_km._size);
    let B_km_sin_theta_km = math.dotMultiply(B_km, sin_theta_km);
    let G_B_add = math.add(G_km_cos_theta_km, B_km_sin_theta_km);
    let V_m_G_B = math.dotMultiply(math.resize(V_m, G_B_add._size), G_B_add);
    let sum_V_m_G_B = math.sum(V_m_G_B);
    Pcalc.push(math.multiply(V_k, sum_V_m_G_B));
  }
  return Pcalc;
};

const Q_CALC = (V, theta, G, B, NB, equips) => {
  let Qcalc = [];
  for (let i = 0; i < NB; i++) {
    let k_index = i;
    let m = getRelatedEndPoint(equips, k_index);
    let V_m = math.subset(V, math.index(m));
    let V_k = math.subset(V, math.index(k_index));
    let theta_m = math.subset(theta, math.index(m));
    let theta_k = theta._data[k_index];
    let theta_km = math.subtract(theta_k, theta_m);
    let G_km = math.transpose(math.subset(G, math.index([k_index], m)));
    let B_km = math.transpose(math.subset(B, math.index([k_index], m)));
    let sin_theta_km = math.resize(math.sin(theta_km), B_km._size);
    let G_km_sin_theta_km = math.dotMultiply(G_km, sin_theta_km);

    let cos_theta_km = math.resize(math.cos(theta_km), G_km._size);
    let B_km_cos_theta_km = math.dotMultiply(B_km, cos_theta_km);
    let G_B_sub = math.subtract(G_km_sin_theta_km, B_km_cos_theta_km);
    let V_m_G_B = math.dotMultiply(math.resize(V_m, G_B_sub._size), G_B_sub);
    let sum_V_m_G_B = math.sum(V_m_G_B);
    Qcalc.push(math.multiply(V_k, sum_V_m_G_B));
  }
  return Qcalc;
};
