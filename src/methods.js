import * as math from "mathjs";
// import React from "react";

export const tCalc = (equip) => {
  let tap_linear = isNaN(equip.tap) ? 1 : equip.tap;
  let tap_df_deg = isNaN(equip.tap_df_deg) ? 0 : equip.tap_df_deg;
  return math.multiply(
    tap_linear,
    math.exp(math.complex(0, (tap_df_deg * Math.PI) / 180))
  );
};

const Y_CALC = (equips, NB, NR) => {
  const Y = math.zeros(NB, NB);

  for (let i = 0; i < NR; i++) {
    let EQUIPS = Object.values(equips);
    let k = parseInt(EQUIPS[i].endPointA) - 1;
    let m = parseInt(EQUIPS[i].endPointB) - 1;
    let t = undefined;
    if (EQUIPS[i].type === "LT") {
      //LT
      t = 1;
    } else {
      //TR
      t = tCalc(EQUIPS[i]);
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

const PF_CALC = (state, equips) => {
  let pf_data = [];
  let totalLoss = math.complex(0, 0);
  let equips_arr = Object.values(equips);
  equips_arr.forEach((equip) => {
    let k = parseInt(equip.endPointA) - 1;
    let m = parseInt(equip.endPointB) - 1;
    let t = undefined;
    if (equip.type === "LT") {
      //LT
      t = 1;
    } else {
      //TR
      t = tCalc(equip);
    }
    let ykm = math.divide(1, math.complex(equip.r_pu, equip.x_pu));
    let bsh = equip.bsh_pu / 2;

    let Vk = state["V"]._data[k];
    let Vm = state["V"]._data[m];
    let thetak = state["theta"]._data[k];
    let thetam = state["theta"]._data[m];
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

    // console.log(Sloss.toString(), totalLoss);
    pf_data.push({
      k,
      m,
      Ikm,
      Imk,
      Skm,
      Smk,
      Sloss,
    });
    // console.log(math.round(Smk, roundTo), math.abs(Smk));
  });
  return [pf_data, totalLoss];
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
  let theta = math.matrix(BARS.map((bar) => (bar.theta_deg * Math.PI) / 180)); //theta [rad]
  let V = math.matrix(BARS.map((bar) => parseFloat(bar.v_pu)));

  let PQ_index = BARS.filter((bar) => bar.type === 0).map((bar) =>
    parseInt(bar.name)
  ); //%numero barra tipo PQ
  let zero_PQ_index = PQ_index.map((elem) => elem - 1); //numero barra tipo PQ base zero

  // let PV_index = BARS.filter((bar) => bar.type === 1).map((bar) =>
  //   parseInt(bar.name)
  // ); //%numero barra tipo PV
  // let zero_PV_index = PV_index.map((elem) => elem - 1); //numero barra tipo PV base zero

  let PQ_PV_index = BARS.filter(
    (bar) => bar.type === 0 || bar.type === 1
  ).map((bar) => parseInt(bar.name)); //%numero barra tipo PQ ou PV
  let zero_PQ_PV_index = PQ_PV_index.map((elem) => elem - 1); //%numero barra tipo PQ ou PV base zero

  // let Vtheta_index = BARS.filter((bar) => bar.type === 2).map((bar) =>
  //   parseInt(bar.name)
  // ); //%numero barra tipo slack
  // let zero_Vtheta_index = Vtheta_index.map((elem) => elem - 1);
  // //%numero barra tipo slack base zero

  let Pesp = BARS.map((bar) => bar.p_g - bar.p_c);

  let Qesp = BARS.map((bar) => bar.q_g - bar.q_c);
  // console.log(BARS, PQ_index, PQ_PV_index);
  let iteration = 0;
  let iterationData = [];
  let J = undefined;

  while (true) {
    let Pcalc = P_CALC(V, theta, G, B, NB, equips);
    let Qcalc = Q_CALC(V, theta, G, B, NB, equips);
    let dP = math.subtract(Pesp, Pcalc);
    let dQ = math.subtract(Qesp, Qcalc);
    let g = zero_PQ_PV_index.map((elem) => dP[elem]); //zero based matrix
    g.push(...zero_PQ_index.map((elem) => dQ[elem]));
    iterationData.push({
      iteration: iteration,
      V: math.squeeze(V),
      theta: math.squeeze(theta),
      g: math.squeeze(g),
      J: J,
      Pcalc: Pcalc,
      Qcalc: Qcalc,
    });

    if (math.max(math.abs(g)) < err_tolerance) {
      console.log("FIM");
      break;
    } else {
      iteration++;
      console.log("ITERATION:", iteration);
      if (iteration > 1000) break;
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
    zero_PQ_PV_index.map((elem) => {
      theta._data[elem] = X_next._data[count];
      count++;
      return 0;
    });

    zero_PQ_index.map((elem) => {
      V._data[elem] = X_next._data[count];
      count++;
      return 0;
    });
  }

  //CALCULO FLUXO ENTRE RAMOS
  const state = iterationData[iterationData.length - 1];
  const [pf_data, totalLoss] = PF_CALC(state, equips);
  iterationData[iterationData.length - 1].pf_data = pf_data;
  iterationData[iterationData.length - 1].totalLoss = totalLoss;

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
  EQUIPS.forEach((equip) => {
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
