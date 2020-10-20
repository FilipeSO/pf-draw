const fs = require("fs");
const readline = require("readline");

async function processLineByLine() {
  const fileStream = fs.createReadStream("ieee30buses.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  let lineCounter = 1;
  let bars = [];
  let branches = [];
  let branchesInit = false;
  //   let barRegex = /(^.{4}).{3}(.{1}).{1}(.{12}).{1}(.{4}).{1}(.{3})/g;
  for await (const line of rl) {
    if (lineCounter === 1) {
      console.log("Título:", line);
      lineCounter++;
      continue;
    }
    if (line === "9999") {
      branchesInit = true;
      continue;
    }
    if (branchesInit) {
      branches.push({
        type: "LT",
        endPointA: line.substring(0, 4).trim(),
        endPointB: line.substring(8, 12).trim(),
        r_pu: parseFloat(line.substring(17, 23)) / 100,
        x_pu: parseFloat(line.substring(23, 29)) / 100,
        bsh_mvar: parseFloat(line.substring(29, 35)),
        tap: parseFloat(line.substring(36, 40)) / 1000,
        tap_min: parseFloat(line.substring(41, 45)) / 1000,
        tap_max: parseFloat(line.substring(46, 50)) / 1000,
        tap_df_deg: parseFloat(line.substring(50, 55)),
      });
    } else {
      //   console.log(barRegex.exec(line));
      //   bars.push({
      //     numero: parseInt(line.substring(0, 4)),
      //     tipo: parseInt(line.substring(7, 8)),
      //     id: line.substring(9, 21).trim(),
      //     v_pu: parseFloat(line.substring(22, 26)) / 1000,
      //     theta_deg: parseFloat(line.substring(27, 30)),
      //     p_g: parseFloat(line.substring(30, 35)),
      //     q_g: parseFloat(line.substring(35, 40)),
      //     q_min: parseFloat(line.substring(40, 45)),
      //     q_max: parseFloat(line.substring(45, 50)),
      //     p_c: parseFloat(line.substring(55, 60)),
      //     q_c: parseFloat(line.substring(60, 65)),
      //     q_s: parseFloat(line.substring(65, 70)),
      //   });
      // }
      bars = {
        ...bars,
        [parseInt(line.substring(0, 4))]: {
          numero: parseInt(line.substring(0, 4)),
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
    lineCounter++;
  }
  fs.writeFile("ieee30bars.json", JSON.stringify(bars), function (err) {
    if (err) {
      console.log(err);
    }
  });
  fs.writeFile("ieee30branches.json", JSON.stringify(branches), function (err) {
    if (err) {
      console.log(err);
    }
  });
  //   console.log(bars.length, bars);
  //   console.log(branches.length, branches);
}

processLineByLine();
