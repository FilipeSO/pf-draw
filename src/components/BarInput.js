import React, { useState } from "react";

const BarInput = ({ updateBars, bars }) => {
  const stageHeight = 600;
  const defaultBar = {
    name: "",
    id: "",
    tipo: "",
    v_pu: "",
    theta_deg: "",
    p_c: "",
    q_c: "",
    p_g: "",
    q_g: "",
    q_min: "",
    q_max: "",
  };
  const [bar, setBar] = useState(defaultBar);

  const handleBarChange = (e) => {
    let newState = { ...bar, [e.target.name]: e.target.value };
    setBar(newState);
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
    for (var key in newBar) {
      if (key === "id" || key === "name") continue;
      newBar[key] = parseFloat(newBar[key].replace(",", "."));
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
    <div>
      <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
        BAR MANUAL INPUT
      </h2>
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
            name="tipo"
            onChange={handleBarChange}
            value={bar.tipo}
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
        <div className="md:flex md: items-center mt-2">
          <div className="flex items-center md:w-1/2">
            <label className="text-gray-700 text-sm font-bold mr-2">
              V [pu]:
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
              P in [MW]:
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
              Q in [MVar]:
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
              P out [MW]:
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
              Q out [MVar]:
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
              Q min [MVar]:
            </label>
            <input
              className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
              type="text"
              name="q_min"
              onChange={handleBarChange}
              value={bar.q_min}
            ></input>
          </div>
          <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
            <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
              Q max [MVar]:
            </label>
            <input
              className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
              type="text"
              name="q_max"
              onChange={handleBarChange}
              value={bar.q_max}
            ></input>
          </div>
        </div>
        <div className="flex">
          <input
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
            type="submit"
            value="Add Bar"
          ></input>
        </div>
      </form>
    </div>
  );
};

export default BarInput;
