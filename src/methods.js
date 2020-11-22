import * as math from "mathjs";

export const CalcY = (equips, NB, NR) => {
  const Y = math.zeros(NB, NB);

  for (let i = 0; i < NR; i++) {
    let RAMOS = Object.values(equips);
    let k = parseInt(RAMOS[i].endPointA) - 1;
    let m = parseInt(RAMOS[i].endPointB) - 1;
    let t = 1;
    if (isNaN(RAMOS[i].tap) === false) {
      t = math.multiply(
        RAMOS[i].tap,
        math.exp(math.complex(0, (RAMOS[i].tap_df_deg * Math.PI) / 180))
      );
    }
    let ykm = math.divide(1, math.complex(RAMOS[i].r_pu, RAMOS[i].x_pu));
    let bsh = RAMOS[i].bsh_pu / 2;
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
