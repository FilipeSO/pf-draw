import * as math from "mathjs";
import React from "react";

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

export const NewtonRaphsonMethod = (bars, equips, NB, NR, err_tolerance) => {
  let BARS = Object.values(bars).sort((a, b) =>
    parseInt(a.name) > parseInt(b.name)
      ? 1
      : parseInt(b.name) > parseInt(a.name)
      ? -1
      : 0
  ); //ordernado por numero da barra

  const Y = Y_CALC(equips, NB, NR);

  const G = math.re(Y);
  const B = math.im(Y);
  let theta = math.matrix(BARS.map(bar => (bar.theta_deg * Math.PI) / 180)); //theta [rad]
  let V = math.matrix(BARS.map(bar => parseFloat(bar.v_pu)));

  let PQ_index = BARS.filter(bar => bar.tipo === 0).map(bar =>
    parseInt(bar.name)
  ); //%numero barra tipo PQ
  let zero_PQ_index = PQ_index.map(elem => elem - 1); //numero barra tipo PQ base zero

  // let PV_index = BARS.filter((bar) => bar.tipo === 1).map((bar) =>
  //   parseInt(bar.name)
  // ); //%numero barra tipo PV
  // let zero_PV_index = PV_index.map((elem) => elem - 1); //numero barra tipo PV base zero

  let PQ_PV_index = BARS.filter(
    bar => bar.tipo === 0 || bar.tipo === 1
  ).map(bar => parseInt(bar.name)); //%numero barra tipo PQ ou PV
  let zero_PQ_PV_index = PQ_PV_index.map(elem => elem - 1); //%numero barra tipo PQ ou PV base zero

  // let Vtheta_index = BARS.filter((bar) => bar.tipo === 2).map((bar) =>
  //   parseInt(bar.name)
  // ); //%numero barra tipo slack
  // let zero_Vtheta_index = Vtheta_index.map((elem) => elem - 1);
  // //%numero barra tipo slack base zero

  let Pesp = BARS.map(bar => bar.p_g - bar.p_c);

  let Qesp = BARS.map(bar => bar.q_g - bar.q_c);
  // console.log(BARS, PQ_index, PQ_PV_index);
  let iteration = 0;
  let iterationData = [];
  let J = undefined;

  while (true) {
    let Pcalc = P_CALC(V, theta, G, B, NB, equips);
    let Qcalc = Q_CALC(V, theta, G, B, NB, equips);
    let dP = math.subtract(Pesp, Pcalc);
    let dQ = math.subtract(Qesp, Qcalc);
    let g = zero_PQ_PV_index.map(elem => dP[elem]); //zero based matrix
    g.push(...zero_PQ_index.map(elem => dQ[elem]));
    iterationData.push({
      iteration: iteration,
      V: math.squeeze(V),
      theta: math.squeeze(theta),
      g: math.squeeze(g),
      J: J
    });

    if (math.max(math.abs(g)) < err_tolerance) {
      console.log("FIM");
      break;
    } else {
      iteration++;
      console.log("ITERATION:", iteration);
    }
    J = J_CALC(
      V,
      theta,
      G,
      B,
      NB,
      Pcalc,
      Qcalc,
      zero_PQ_PV_index,
      zero_PQ_index
    );

    let X = getNewtonX(theta, V, zero_PQ_PV_index, zero_PQ_index);

    // %dX=X_next-X
    // %g=J*dX
    // %X_next=inv(J)*g+X
    let X_next = math.add(math.multiply(math.inv(J), g), X);
    let count = 0;
    zero_PQ_PV_index.map(elem => {
      theta._data[elem] = X_next._data[count];
      count++;
      return 0;
    });

    zero_PQ_index.map(elem => {
      V._data[elem] = X_next._data[count];
      count++;
      return 0;
    });
  }
  return [Y, iterationData, PQ_PV_index, PQ_index];
};

const getNewtonX = (theta, V, zero_PQ_PV_index, zero_PQ_index) => {
  let theta_display = theta.subset(math.index(zero_PQ_PV_index));
  let v_display = V.subset(math.index(zero_PQ_index));
  if (typeof theta_display === "number") {
    theta_display = math.matrix([theta_display]).resize([1, 1]);
  }
  if (typeof v_display === "number") {
    v_display = math.matrix([v_display]).resize([1]);
  }
  return math.concat(theta_display, v_display, 0);
};

const getRelatedEndPoint = (equips, k_index) => {
  let EQUIPS = Object.values(equips);
  // let k_index = k; //matrix is zero based
  let m = [];
  EQUIPS.forEach(equip => {
    let endPointA = parseInt(equip.endPointA) - 1; //matrix is zero based
    let endPointB = parseInt(equip.endPointB) - 1; //matrix is zero based

    if (endPointA === k_index && m.indexOf(endPointB) === -1) {
      m.push(endPointB); //matrix is zero based
    }
    if (endPointB === k_index && m.indexOf(endPointA) === -1) {
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

const J_CALC = (
  V,
  theta,
  G,
  B,
  NB,
  Pcalc,
  Qcalc,
  zero_PQ_PV_index,
  zero_PQ_index
) => {
  let H = math.zeros(NB, NB);
  for (let k = 0; k < NB; k++) {
    for (let m = 0; m < NB; m++) {
      if (k === m)
        H._data[k][m] = -B._data[k][k] * math.pow(V._data[k], 2) - Qcalc[k];
      else
        H._data[k][m] =
          V._data[k] *
          V._data[m] *
          (G._data[k][m] * math.sin(theta._data[k] - theta._data[m]) -
            B._data[k][m] * math.cos(theta._data[k] - theta._data[m]));
    }
  }
  H = H.subset(math.index(zero_PQ_PV_index, zero_PQ_PV_index));

  let M = math.zeros(NB, NB);
  for (let k = 0; k < NB; k++) {
    for (let m = 0; m < NB; m++) {
      if (k === m)
        M._data[k][m] = -G._data[k][k] * math.pow(V._data[k], 2) - Pcalc[k];
      else
        M._data[k][m] =
          -V._data[k] *
          V._data[m] *
          (G._data[k][m] * math.cos(theta._data[k] - theta._data[m]) +
            B._data[k][m] * math.sin(theta._data[k] - theta._data[m]));
    }
  }
  M = M.subset(math.index(zero_PQ_index, zero_PQ_PV_index));

  let N = math.zeros(NB, NB);
  for (let k = 0; k < NB; k++) {
    for (let m = 0; m < NB; m++) {
      if (k === m)
        N._data[k][m] =
          (G._data[k][k] * math.pow(V._data[k], 2) + Pcalc[k]) / V._data[k];
      else
        N._data[k][m] =
          V._data[k] *
          (G._data[k][m] * math.cos(theta._data[k] - theta._data[m]) +
            B._data[k][m] * math.sin(theta._data[k] - theta._data[m]));
    }
  }
  N = N.subset(math.index(zero_PQ_PV_index, zero_PQ_index));

  let L = math.zeros(NB, NB);
  for (let k = 0; k < NB; k++) {
    for (let m = 0; m < NB; m++) {
      if (k === m)
        L._data[k][m] =
          (-B._data[k][k] * math.pow(V._data[k], 2) + Qcalc[k]) / V._data[k];
      else
        L._data[k][m] =
          V._data[k] *
          (G._data[k][m] * math.sin(theta._data[k] - theta._data[m]) -
            B._data[k][m] * math.cos(theta._data[k] - theta._data[m]));
    }
  }
  L = L.subset(math.index(zero_PQ_index, zero_PQ_index));
  if (typeof H === "number") {
    H = math.matrix([H]).resize([1, 1]);
  }
  if (typeof M === "number") {
    M = math.matrix([M]).resize([1, 1]);
  }
  if (typeof N === "number") {
    N = math.matrix([N]).resize([1, 1]);
  }
  if (typeof L === "number") {
    L = math.matrix([L]).resize([1, 1]);
  }

  let HN = math.concat(H, N);
  let ML = math.concat(M, L);
  let J = math.concat(HN, ML, 0);

  return J;
};

const DisplayMatrix = ({ symbol, matrix, unit }) => {
  let td = [];
  let tr = [];
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

export const NewtonRaphsonMethodResults = (
  bars,
  equips,
  NB,
  NR,
  err_tolerance
) => {
  let [Y, data, PQ_PV_index, PQ_index] = NewtonRaphsonMethod(
    bars,
    equips,
    NB,
    NR,
    err_tolerance
  );
  console.log(data);
  let theta_vector = PQ_PV_index.map(elem => (
    <div key={elem}>
      {String.fromCharCode(952)}
      <sub>{elem}</sub>
    </div>
  ));
  let v_vector = PQ_index.map(elem => (
    <div key={elem}>
      V<sub>{elem}</sub>
    </div>
  ));

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
    </div>
  ];
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      results.push(
        <div
          key={data[i].iteration}
          className="flex flex-wrap justify-center items-center space-x-4 px-4 py-2 border-dashed border-solid border-t-2 border-black"
        >
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
        <div
          key={data[i].iteration}
          className="flex flex-wrap justify-center items-center px-4 py-2 border-dashed border-solid border-t-2 border-black"
        >
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
  return results;
};
