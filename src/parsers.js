import { getLinePoints } from "./components/drawing/utils";
import { isLT } from "./utils";
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
