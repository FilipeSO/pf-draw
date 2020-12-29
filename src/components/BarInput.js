import React, { useState } from "react";
import BarPreview from "./drawing/BarPreview";
const BarInput = ({ updateBars, bars }) => {
  const stageHeight = 600;
  const defaultBar = {
    name: "",
    id: "",
    type: "",
    v_pu: "",
    theta_deg: "",
    p_c: "",
    q_c: "",
    p_g: "",
    q_g: "",
    q_min: "",
    q_max: "",
    use_pu: true,
    s_base: "",
    v_base: "",
  };
  const [bar, setBar] = useState(defaultBar);

  const handleBarChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    let newState = {};
    if (name === "use_pu") {
      value = e.target.value === "Per-Unit" ? true : false;
      newState = { ...defaultBar, [name]: value };
    } else {
      newState = { ...bar, [name]: value };
    }
    setBar(newState);
    // console.log(newState);
  };

  const handleBarSubmit = (e) => {
    e.preventDefault();
    let name = Object.keys(bars).length + 1;

    let position = {
      x:
        window.innerWidth * 0.2 +
        Math.floor(Math.random() * (window.innerWidth * 0.6)),
      y: stageHeight * 0.2 + Math.floor(Math.random() * stageHeight * 0.6),
    };
    let newBar = bar;
    let vb = parseFloat(newBar.v_base.replace(",", ".")); //retorna NaN se ""
    let sb = parseFloat(newBar.s_base.replace(",", ".")); //retorna NaN se ""
    for (var key in newBar) {
      if (newBar.use_pu === false) {
        switch (key) {
          case "id":
            break;
          case "name":
            break;
          case "use_pu":
            break;
          case "v_base":
            newBar[key] = parseFloat(newBar[key].replace(",", "."));
            break;
          case "s_base":
            newBar[key] = parseFloat(newBar[key].replace(",", "."));
            break;
          case "v_pu":
            newBar[key] = parseFloat(newBar[key].replace(",", ".")) / vb;
            break;
          case "theta_deg":
            newBar[key] = parseFloat(newBar[key].replace(",", "."));
            break;
          default:
            newBar[key] = parseFloat(newBar[key].replace(",", ".")) / sb;
            break;
        }
      } else {
        switch (key) {
          case "id":
            break;
          case "name":
            break;
          case "use_pu":
            break;
          default:
            newBar[key] = parseFloat(newBar[key].replace(",", "."));
            break;
        }
      }
    }
    let newState = {
      ...bars,
      [name]: {
        ...newBar,
        name: name.toString(),
        pos: position,
      },
    };
    console.log("NOVA BARRA ADD", newState);
    updateBars(newState);
    setBar(defaultBar);
  };

  return (
    <div className="">
      <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
        BAR MANUAL INPUT
      </h2>
      <BarPreview bar={bar}></BarPreview>
      <form onSubmit={handleBarSubmit}>
        {/* <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">
            Number:
          </label>
          <input
            className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
            type="text"
            name="name"
            value={bar.name}
            onChange={handleBarChange}
            required
          ></input>
        </div> */}

        <div className="flex items-center mt-2">
          <label className="text-gray-700 text-sm font-bold mr-2">Id:</label>
          <input
            className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
            type="text"
            name="id"
            value={bar.id}
            onChange={handleBarChange}
            required
          ></input>
        </div>

        <div className="flex items-center mt-2">
          <label className="text-gray-700 text-sm font-bold mr-2">Type:</label>
          <select
            className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
            name="type"
            onChange={handleBarChange}
            value={bar.type}
            required
          >
            <option disabled value="">
              -- select an option --
            </option>
            <option value="0">PQ</option>
            <option value="1">PV</option>
            <option value="2">Slack</option>
          </select>
        </div>

        <div className="flex items-center justify-center mt-2 text-white">
          <input
            type="button"
            name="use_pu"
            className={`focus:outline-none w-1/2 text-center cursor-pointer  ${
              bar.use_pu
                ? "bg-blue-400 font-bold"
                : "bg-blue-200 hover:bg-blue-300"
            }`}
            onClick={handleBarChange}
            value={"Per-Unit"}
          ></input>
          <input
            type="button"
            name="use_pu"
            className={`focus:outline-none w-1/2 text-center cursor-pointer ${
              !bar.use_pu
                ? "bg-blue-400 font-bold"
                : "bg-blue-200 hover:bg-blue-300"
            }`}
            onClick={handleBarChange}
            value={"Unit"}
          ></input>
        </div>

        <div className="border-2 border-blue-400 px-2 py-4">
          {!bar.use_pu && (
            <div className="md:flex md:items-center mb-2">
              <div className="flex items-center md:w-1/2">
                <label className="text-gray-700 text-sm font-bold mr-2">
                  V<sub>base</sub> [kV]:
                </label>
                <input
                  className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="v_base"
                  onChange={handleBarChange}
                  value={bar.v_base}
                  required
                ></input>
              </div>
              <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
                <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                  S<sub>base</sub> [MVA]:
                </label>
                <input
                  className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="s_base"
                  onChange={handleBarChange}
                  value={bar.s_base}
                  required
                ></input>
              </div>
            </div>
          )}

          <div className="md:flex md:items-center">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                V [{bar.use_pu ? "pu" : "kV"}]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="v_pu"
                onChange={handleBarChange}
                value={bar.v_pu}
                required
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                &theta; [deg]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="theta_deg"
                onChange={handleBarChange}
                value={bar.theta_deg}
                required
              ></input>
            </div>
          </div>

          <div className="md:flex md: items-center mt-2">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                P in [{bar.use_pu ? "pu" : "MW"}]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="p_g"
                onChange={handleBarChange}
                value={bar.p_g}
                required
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                Q in [{bar.use_pu ? "pu" : "MVar"}]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="q_g"
                onChange={handleBarChange}
                value={bar.q_g}
                required
              ></input>
            </div>
          </div>

          <div className="md:flex md: items-center mt-2">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                P out [{bar.use_pu ? "pu" : "MW"}]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="p_c"
                onChange={handleBarChange}
                value={bar.p_c}
                required
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                Q out [{bar.use_pu ? "pu" : "MVar"}]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="q_c"
                onChange={handleBarChange}
                value={bar.q_c}
                required
              ></input>
            </div>
          </div>

          <div className="md:flex md: items-center mt-2">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                Q max [{bar.use_pu ? "pu" : "MVar"}]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="q_max"
                onChange={handleBarChange}
                value={bar.q_max}
                required
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                Q min [{bar.use_pu ? "pu" : "MVar"}]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="q_min"
                onChange={handleBarChange}
                value={bar.q_min}
                required
              ></input>
            </div>
          </div>
        </div>

        <div className="flex mt-2">
          <input
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md cursor-pointer"
            type="submit"
            value="Add Bar"
          ></input>
        </div>
      </form>
    </div>
  );
};

export default BarInput;
