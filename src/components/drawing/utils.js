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
