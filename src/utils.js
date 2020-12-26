import * as math from "mathjs";

export const complexToPolarString = (complex, roundTo) => {
  let abs = math.round(complex.toPolar()["r"], roundTo);
  let deg = math.round((complex.toPolar()["phi"] * 180) / Math.PI, roundTo);
  return `${abs}∠${deg}°`;
};

export const complexToRecString = (complex, roundTo) => {
  return math.round(complex, roundTo).toString();
};

export const isLT = (equip) => {
  return (
    (equip.tap === 1 && equip.tap_df_deg === 0) ||
    (isNaN(equip.tap) && isNaN(equip.tap_df_deg))
  );
};

export const typeNumToStr = (num) => {
  switch (num) {
    case "0":
      return "PQ";
    case "1":
      return "PV";
    case "2":
      return "Slack";
    default:
      return "";
  }
};
