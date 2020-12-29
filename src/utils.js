import * as math from "mathjs";

export const complexToPolarString = (complex, roundTo) => {
  let abs = math.round(complex.toPolar()["r"], roundTo);
  let deg = math.round((complex.toPolar()["phi"] * 180) / Math.PI, roundTo);
  return `${abs}∠${deg}°`;
};

export const complexToRecString = (complex, roundTo) => {
  return math.round(complex, roundTo).toString();
};

export const typeNumToStr = (num) => {
  switch (parseInt(num)) {
    case 0:
      return "PQ";
    case 1:
      return "PV";
    case 2:
      return "Slack";
    default:
      return "";
  }
};

export const getBarColor = (v_base) => {
  switch (true) {
    case v_base >= 138 && v_base < 230:
      return "red";
    case v_base >= 230 && v_base < 345:
      return "green";
    case v_base >= 345 && v_base < 440:
      return "yellow";
    case v_base >= 440 && v_base < 500:
      return "orange";
    case v_base >= 500 && v_base < 750:
      return "blue";
    case v_base >= 750:
      return "cyan";
    default:
      return "black";
  }
};
