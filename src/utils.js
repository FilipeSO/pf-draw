// const evenPositiveOddNegative = (number) => {
//   if (number % 2 === 0) return 1;
//   else return -1;
// };

export const evenOddFix = (n, space = 5) => {
  if (n % 2 === 0) return space * n;
  else return -space * n + space;
};

export const getAngle = (dx, dy) => {
  return (Math.atan(dy / dx) * 180) / Math.PI;
};
export const getDistance = (dx, dy) => {
  // console.log("distancia", Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
};
const getQuadrant = (x1, y1, x2, y2) => {
  let angle = getAngle(x2 - x1, y2 - y1);
  // console.log("angulo", angle, x1, x2, y1, y2);
  if (angle > 0 && x2 > x1 && y2 > y1) {
    return 2;
  }
  if (angle > 0 && x2 < x1 && y2 < y1) {
    return 4;
  }
  if (angle < 0 && x2 > x1 && y1 > y2) {
    return 3;
  }
  if (angle < 0 && x2 < x1 && y1 < y2) {
    return 1;
  }
};

// const getLineMidPointByQuadrant = (x1, y1, x2, y2, n) => {
//   let midX = 0;
//   let midY = 0;
//   if (getQuadrant(x1, y1, x2, y2) === 2) {
//     midX =
//       x1 +
//       (Math.cos(
//         (getAngle(x2 - x1, y2 - y1) - 5 * n * evenPositiveOddNegative(n)) *
//           (Math.PI / 180)
//       ) *
//         getDistance(x2 - x1, y2 - y1)) /
//         2;

//     midY =
//       y1 +
//       (Math.sin(
//         (getAngle(x2 - x1, y2 - y1) - 5 * n * evenPositiveOddNegative(n)) *
//           (Math.PI / 180)
//       ) *
//         getDistance(x2 - x1, y2 - y1)) /
//         2;
//   } else if (getQuadrant(x1, y1, x2, y2) === 4) {
//     midX =
//       x2 +
//       (Math.cos(
//         (getAngle(x2 - x1, y2 - y1) - 5 * n * evenPositiveOddNegative(n)) *
//           (Math.PI / 180)
//       ) *
//         getDistance(x2 - x1, y2 - y1)) /
//         2;

//     midY =
//       y2 +
//       (Math.sin(
//         (getAngle(x2 - x1, y2 - y1) - 5 * n * evenPositiveOddNegative(n)) *
//           (Math.PI / 180)
//       ) *
//         getDistance(x2 - x1, y2 - y1)) /
//         2;
//   } else if (getQuadrant(x1, y1, x2, y2) === 3) {
//     midX =
//       x1 +
//       (Math.cos(
//         (getAngle(x2 - x1, y2 - y1) + 5 * n * evenPositiveOddNegative(n)) *
//           (Math.PI / 180)
//       ) *
//         getDistance(x2 - x1, y2 - y1)) /
//         2;

//     midY =
//       y1 +
//       (Math.sin(
//         (getAngle(x2 - x1, y2 - y1) + 5 * n * evenPositiveOddNegative(n)) *
//           (Math.PI / 180)
//       ) *
//         getDistance(x2 - x1, y2 - y1)) /
//         2;
//   } else if (getQuadrant(x1, y1, x2, y2) === 1) {
//     midX =
//       x1 -
//       (Math.cos(
//         (getAngle(x2 - x1, y2 - y1) - 5 * n * evenPositiveOddNegative(n)) *
//           (Math.PI / 180)
//       ) *
//         getDistance(x2 - x1, y2 - y1)) /
//         2;

//     midY =
//       y1 -
//       (Math.sin(
//         (getAngle(x2 - x1, y2 - y1) - 5 * n * evenPositiveOddNegative(n)) *
//           (Math.PI / 180)
//       ) *
//         getDistance(x2 - x1, y2 - y1)) /
//         2;
//   }
//   return [midX, midY];
// };

const getParallelLinePoints = (
  x1,
  y1,
  x2,
  y2,
  n,
  space = 5,
  lx = 40,
  ly = 40
) => {
  let midX1 = 0;
  let midY1 = 0;
  let midX2 = 0;
  let midY2 = 0;
  // console.log(getQuadrant(x1, y1, x2, y2));
  if (getQuadrant(x1, y1, x2, y2) === 2 || getQuadrant(x1, y1, x2, y2) === 3) {
    midX1 =
      x1 +
      Math.cos(
        (getAngle(x2 - x1, y2 - y1) - evenOddFix(n, space)) * (Math.PI / 180)
      ) *
        lx;

    midY1 =
      y1 +
      Math.sin(
        (getAngle(x2 - x1, y2 - y1) - evenOddFix(n, space)) * (Math.PI / 180)
      ) *
        ly;

    midX2 =
      x2 +
      Math.cos(
        (180 + getAngle(x2 - x1, y2 - y1) + evenOddFix(n, space)) *
          (Math.PI / 180)
      ) *
        lx;

    midY2 =
      y2 +
      Math.sin(
        (180 + getAngle(x2 - x1, y2 - y1) + evenOddFix(n, space)) *
          (Math.PI / 180)
      ) *
        ly;
  } else {
    midX1 =
      x1 +
      Math.cos(
        (180 + getAngle(x2 - x1, y2 - y1) - evenOddFix(n, space)) *
          (Math.PI / 180)
      ) *
        lx;

    midY1 =
      y1 +
      Math.sin(
        (180 + getAngle(x2 - x1, y2 - y1) - evenOddFix(n, space)) *
          (Math.PI / 180)
      ) *
        ly;

    midX2 =
      x2 +
      Math.cos(
        (getAngle(x2 - x1, y2 - y1) + evenOddFix(n, space)) * (Math.PI / 180)
      ) *
        lx;

    midY2 =
      y2 +
      Math.sin(
        (getAngle(x2 - x1, y2 - y1) + evenOddFix(n, space)) * (Math.PI / 180)
      ) *
        ly;
  }
  return [midX1, midY1, midX2, midY2];
};

export const getLinePoints = (x1, y1, x2, y2, n, space, lx, ly) => {
  let points =
    n === 1
      ? [x1, y1, x2, y2]
      : [
          x1,
          y1,
          ...getParallelLinePoints(x1, y1, x2, y2, n, space, lx, ly),
          x2,
          y2,
        ];
  return points;
};

export const parseTextFile = (lines) => {
  let bars = [];
  let branches = [];
  let equips = [];
  let branchesInit = false;
  let title = "";
  lines.forEach((line, index) => {
    if (index === 0) {
      title = line.trim();
      return;
    }
    if (line === "9999") {
      branchesInit = true;
      return;
    }
    if (branchesInit) {
      let newBranch = {
        endPointA: line.substring(0, 4).trim(),
        endPointB: line.substring(8, 12).trim(),
        r_pu: parseFloat(line.substring(17, 23)) / 100,
        x_pu: parseFloat(line.substring(23, 29)) / 100,
        bsh_mvar: parseFloat(line.substring(29, 35)),
        tap: parseFloat(line.substring(36, 40)) / 1000,
        tap_min: parseFloat(line.substring(41, 45)) / 1000,
        tap_max: parseFloat(line.substring(46, 50)) / 1000,
        tap_df_deg: parseFloat(line.substring(50, 55)),
      };
      if (isNaN(newBranch.tap)) {
        newBranch.type = "LT";
      } else {
        newBranch.type = "TR";
      }
      branches.push(newBranch);
    } else {
      bars = {
        ...bars,
        [line.substring(0, 4).trim()]: {
          name: line.substring(0, 4).trim(),
          tipo: parseInt(line.substring(7, 8)),
          id: line.substring(9, 21).trim(),
          v_pu: parseFloat(line.substring(22, 26)) / 1000,
          theta_deg: parseFloat(line.substring(27, 30)),
          p_g: parseFloat(line.substring(30, 35)),
          q_g: parseFloat(line.substring(35, 40)),
          q_min: parseFloat(line.substring(40, 45)),
          q_max: parseFloat(line.substring(45, 50)),
          p_c: parseFloat(line.substring(55, 60)),
          q_c: parseFloat(line.substring(60, 65)),
          q_s: parseFloat(line.substring(65, 70)),
        },
      };
    }
  });

  //adicionar pos as barras
  let position = {
    x:
      (window.innerWidth / 2) * 0.2 +
      Math.floor(Math.random() * ((window.innerWidth / 2) * 0.6)),
    y: (600 / 2) * 0.2 + Math.floor(Math.random() * (600 / 2) * 0.6),
  };
  let barCount = 1;
  for (var key in bars) {
    bars[key].pos = position;
    let degStep = 360 / Object.keys(bars).length;
    position = {
      x: position.x + Math.cos((degStep * barCount * Math.PI) / 180) * 50,
      y: position.y + Math.sin((degStep * barCount * Math.PI) / 180) * 50,
    };
    barCount++;
  }

  //preparar obj equips
  branches.forEach((branch) => {
    if (branch.type === "LT") {
      let equipName = `LT_${[branch.endPointA] + [branch.endPointB]}`;
      let lineN =
        Object.values(equips).filter((equip) => equip.name === equipName)
          .length + 1;
      equips = {
        ...equips,
        [equipName + "_" + lineN]: {
          ...branch,
          type: "LT",
          name: equipName,
          n: lineN,
        },
      };
    }
  });

  for (let key in bars) {
    let nodeTR = branches.filter(
      (branch) => branch.type === "TR" && branch.endPointA === key
    );
    nodeTR.forEach((TR) => {
      let n =
        Object.values(equips).filter(
          (equip) =>
            equip.type === "TR" &&
            equip.endPointA === TR.endPointA &&
            equip.endPointB === TR.endPointB
        ).length + 1;
      let nameTR = `TR_${TR.endPointA + TR.endPointB}_${n}`;
      let endPointA = bars[TR.endPointA];
      let endPointB = bars[TR.endPointB];
      let x1 = endPointA.pos.x;
      let y1 = endPointA.pos.y;
      let x2 = endPointB.pos.x;
      let y2 = endPointB.pos.y;
      let newX = (x1 + x2) / 2;
      let newY = (y1 + y2) / 2;
      if (n > 1) {
        let newPos = getLinePoints(x1, y1, x2, y2, n, 5, 100, 100);
        newX = (newPos[2] + newPos[4]) / 2;
        newY = (newPos[3] + newPos[5]) / 2;
      }
      equips = {
        ...equips,
        [nameTR]: {
          ...TR,
          name: nameTR,
          pos: {
            x: newX,
            y: newY,
          },
          n: n,
        },
      };
    });
  }
  return [title, bars, equips];
};
