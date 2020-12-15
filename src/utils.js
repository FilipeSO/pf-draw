import * as math from "mathjs";

export const complexToPolarString = (complex, roundTo) => {
  let abs = math.round(complex.toPolar()["r"], roundTo);
  let deg = math.round((complex.toPolar()["phi"] * 180) / Math.PI, roundTo);
  return `${abs}∠${deg}°`;
};

export const complexToRecString = (complex, roundTo) => {
  return math.round(complex, roundTo).toString();
};

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

export const isLT = (equip) => {
  return (
    (equip.tap === 1 && equip.tap_df_deg === 0) ||
    (isNaN(equip.tap) && isNaN(equip.tap_df_deg))
  );
};

export const parseTextFile = (lines, bar_placement = "circle") => {
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
        r_pu: parseFloat(line.substring(17, 23)),
        x_pu: parseFloat(line.substring(23, 29)),
        bsh_pu: parseFloat(line.substring(29, 35)),
        tap: parseFloat(line.substring(36, 40)) / 1000,
        tap_min: parseFloat(line.substring(41, 45)) / 1000,
        tap_max: parseFloat(line.substring(46, 50)) / 1000,
        tap_df_deg: parseFloat(line.substring(50, 55)),
      };
      if (isLT(newBranch)) {
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
    if (bar_placement === "circle") {
      bars[key].pos = position;
      let degStep = 360 / Object.keys(bars).length;
      position = {
        x: position.x + Math.cos((degStep * barCount * Math.PI) / 180) * 50,
        y: position.y + Math.sin((degStep * barCount * Math.PI) / 180) * 50,
      };
      barCount++;
    }
    if (bar_placement === "random") {
      bars[key].pos = {
        x:
          window.innerWidth * 0.2 +
          Math.floor(Math.random() * (window.innerWidth * 0.6)),
        y: 600 * 0.2 + Math.floor(Math.random() * 600 * 0.6),
      };
    }
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
    for (let i = 0; i < nodeTR.length; i++) {
      let TR = nodeTR[i];
      let equipName = `TR_${TR.endPointA + TR.endPointB}`;

      let trN =
        Object.values(equips).filter(
          (equip) =>
            equip.name.substring(0, equip.name.lastIndexOf("_")) === equipName
        ).length + 1;

      let endPointA = bars[TR.endPointA];
      let endPointB = bars[TR.endPointB];
      let x1 = endPointA.pos.x;
      let y1 = endPointA.pos.y;
      let x2 = endPointB.pos.x;
      let y2 = endPointB.pos.y;
      let newX = (x1 + x2) / 2;
      let newY = (y1 + y2) / 2;
      if (trN > 1) {
        let newPos = getLinePoints(x1, y1, x2, y2, trN, 5, 100, 100);
        newX = (newPos[2] + newPos[4]) / 2;
        newY = (newPos[3] + newPos[5]) / 2;
      }
      equips = {
        ...equips,
        [equipName + "_" + trN]: {
          ...TR,
          name: equipName + "_" + trN,
          pos: {
            x: newX,
            y: newY,
          },
          n: trN,
        },
      };
    }
  }
  return [title, bars, equips];
};

export const parseCSVFile = (lines, bar_placement = "circle") => {
  let bars = [];
  let branches = [];
  let equips = [];
  let branchesInit = false;
  let skipNext = false;
  let title = "";

  lines.forEach((line, index) => {
    let row = line.split(";");
    // console.log(row);
    if (skipNext === true) {
      //skip header
      skipNext = false;
      return;
    }
    if (index === 0) {
      title = row[1].trim();
      skipNext = true;
      return;
    }
    if (row[0] === "9999") {
      branchesInit = true;
      skipNext = true;
      return;
    }
    if (branchesInit) {
      let newBranch = {
        endPointA: row[0].trim(),
        endPointB: row[1].trim(),
        r_pu: parseFloat(row[2]),
        x_pu: parseFloat(row[3]),
        bsh_pu: parseFloat(row[4]),
        tap: parseFloat(row[5]),
        tap_min: parseFloat(row[6]),
        tap_max: parseFloat(row[7]),
        tap_df_deg: parseFloat(row[8]),
      };
      if (isLT(newBranch)) {
        newBranch.type = "LT";
      } else {
        newBranch.type = "TR";
      }
      branches.push(newBranch);
    } else {
      bars = {
        ...bars,
        [row[0].trim()]: {
          name: row[0].trim(),
          tipo: parseInt(row[1]),
          id: row[2].trim(),
          v_pu: parseFloat(row[3]),
          theta_deg: parseFloat(row[4]),
          p_g: parseFloat(row[5]),
          q_g: parseFloat(row[6]),
          q_min: parseFloat(row[7]),
          q_max: parseFloat(row[8]),
          p_c: parseFloat(row[9]),
          q_c: parseFloat(row[10]),
          q_s: parseFloat(row[11]),
        },
      };
    }
  });
  // console.log(bars, branches);
  //adicionar pos as barras
  let position = {
    x:
      (window.innerWidth / 2) * 0.2 +
      Math.floor(Math.random() * ((window.innerWidth / 2) * 0.6)),
    y: (600 / 2) * 0.2 + Math.floor(Math.random() * (600 / 2) * 0.6),
  };
  let barCount = 1;
  for (var key in bars) {
    if (bar_placement === "circle") {
      bars[key].pos = position;
      let degStep = 360 / Object.keys(bars).length;
      position = {
        x: position.x + Math.cos((degStep * barCount * Math.PI) / 180) * 50,
        y: position.y + Math.sin((degStep * barCount * Math.PI) / 180) * 50,
      };
      barCount++;
    }
    if (bar_placement === "random") {
      bars[key].pos = {
        x:
          window.innerWidth * 0.2 +
          Math.floor(Math.random() * (window.innerWidth * 0.6)),
        y: 600 * 0.2 + Math.floor(Math.random() * 600 * 0.6),
      };
    }
  }

  //preparar obj equips
  branches.forEach((branch) => {
    if (branch.type === "LT") {
      let equipName = `LT_${[branch.endPointA] + [branch.endPointB]}`;
      let equipNameReverse = `LT_${[branch.endPointB] + [branch.endPointA]}`;

      let lineN =
        Object.values(equips).filter(
          (equip) => equip.name === equipName || equip.name === equipNameReverse
        ).length + 1;

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
    for (let i = 0; i < nodeTR.length; i++) {
      let TR = nodeTR[i];

      let equipName = `TR_${TR.endPointA + TR.endPointB}`;
      let equipNameReverse = `TR_${TR.endPointB + TR.endPointA}`;

      let trN =
        Object.values(equips).filter(
          (equip) =>
            equip.name.substring(0, equip.name.lastIndexOf("_")) ===
              equipName ||
            equip.name.substring(0, equip.name.lastIndexOf("_")) ===
              equipNameReverse
        ).length + 1;

      let endPointA = bars[TR.endPointA];
      let endPointB = bars[TR.endPointB];
      let x1 = endPointA.pos.x;
      let y1 = endPointA.pos.y;
      let x2 = endPointB.pos.x;
      let y2 = endPointB.pos.y;
      let newX = (x1 + x2) / 2;
      let newY = (y1 + y2) / 2;
      if (trN > 1) {
        let newPos = getLinePoints(x1, y1, x2, y2, trN, 5, 100, 100);
        newX = (newPos[2] + newPos[4]) / 2;
        newY = (newPos[3] + newPos[5]) / 2;
      }
      equips = {
        ...equips,
        [equipName + "_" + trN]: {
          ...TR,
          name: equipName + "_" + trN,
          pos: {
            x: newX,
            y: newY,
          },
          n: trN,
        },
      };
    }
    nodeTR.forEach((TR) => {});
  }
  return [title, bars, equips];
};
