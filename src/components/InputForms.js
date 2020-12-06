import React, { useState } from "react";
import TextFileInput from "./TextFileInput";
import CSVFileInput from "./CSVFileInput";

const InputForms = ({
  updateBars,
  updateEquips,
  bars,
  equips,
  updateTitle,
}) => {
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
      [bar.name]: {
        ...newBar,
        pos: position,
      },
    };
    console.log("NOVA BARRA ADD", newState);
    updateBars(newState);
    setBar(defaultBar);
  };

  const defaultEquip = {
    endPointA: "",
    endPointB: "",
    r_pu: "",
    x_pu: "",
    bsh_pu: "",
    tap: "",
    tap_df_deg: "",
    tap_min: "",
    tap_max: "",
  };
  const [equip, setEquip] = useState(defaultEquip);
  const handleEquipChange = (e) => {
    let newState = { ...equip, [e.target.name]: e.target.value };
    setEquip(newState);
    // console.log(newState);
  };

  const handleEquipSubmit = (e) => {
    e.preventDefault();

    let equipName = `LT_${[equip.endPointA] + [equip.endPointB]}`;
    let equipNameReverse = `LT_${[equip.endPointB] + [equip.endPointA]}`;

    let lineN_reverse = Object.values(equips).filter(
      (equip) => equip.name === equipNameReverse
    ).length;

    let lineN =
      lineN_reverse +
      Object.values(equips).filter((equip) => equip.name === equipName).length +
      1;

    let newEquip = equip;
    for (var key in newEquip) {
      if (key === "endPointA" || key === "endPointB") continue;
      newEquip[key] = parseFloat(newEquip[key].replace(",", "."));
    }
    let newState = {
      ...equips,
      [equipName + "_" + lineN]: {
        ...newEquip,
        type: "LT",
        name: equipName,
        n: lineN,
      },
    };
    console.log("NOVO EQUIP ADD", newState);
    updateEquips(newState);
    setEquip(defaultEquip);
  };

  return (
    <div>
      <TextFileInput
        updateBars={updateBars}
        updateEquips={updateEquips}
        updateTitle={updateTitle}
      ></TextFileInput>
      <CSVFileInput
        updateBars={updateBars}
        updateEquips={updateEquips}
        updateTitle={updateTitle}
      ></CSVFileInput>

      <div className="lg:flex lg:space-x-4">
        <div className="lg:w-1/2">
          <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
            BAR MANUAL INPUT
          </h2>
          <form onSubmit={handleBarSubmit}>
            <div className="flex items-center">
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
            </div>

            <div className="flex items-center mt-2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                Id:
              </label>
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
              <label className="text-gray-700 text-sm font-bold mr-2">
                Type:
              </label>
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
        <div className="lg:w-1/2">
          <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
            BRANCH MANUAL INPUT
          </h2>
          <form onSubmit={handleEquipSubmit}>
            <div className="md:flex md: items-center mt-2">
              <div className="flex items-center md:w-1/2">
                <label className="text-gray-700 text-sm font-bold mr-2">
                  From:
                </label>
                <input
                  className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="endPointA"
                  onChange={handleEquipChange}
                  value={equip.endPointA}
                  required
                ></input>
              </div>
              <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
                <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                  To:
                </label>
                <input
                  className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="endPointB"
                  onChange={handleEquipChange}
                  value={equip.endPointB}
                  required
                ></input>
              </div>
            </div>

            <div className="md:flex items-center mt-2">
              <div className="flex items-center md:w-1/3">
                <label className="text-gray-700 text-sm font-bold mr-2">
                  r [pu]:
                </label>
                <input
                  className="w-full shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="r_pu"
                  onChange={handleEquipChange}
                  value={equip.r_pu}
                  required
                ></input>
              </div>
              <div className="flex items-center md:w-1/3 md:mt-0 mt-2">
                <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                  x [pu]:
                </label>
                <input
                  className="w-full shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="x_pu"
                  onChange={handleEquipChange}
                  value={equip.x_pu}
                  required
                ></input>
              </div>

              <div className="flex items-center md:w-1/3 md:mt-0 mt-2">
                <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                  bsh (total) [pu]:
                </label>
                <input
                  className="w-full shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="bsh_pu"
                  onChange={handleEquipChange}
                  value={equip.bsh_pu}
                  required
                ></input>
              </div>
            </div>

            <div className="md:flex md: items-center mt-2">
              <div className="flex items-center md:w-1/2">
                <label className="text-gray-700 text-sm font-bold mr-2">
                  tap linear:
                </label>
                <input
                  className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="tap"
                  onChange={handleEquipChange}
                  value={equip.tap}
                ></input>
              </div>
              <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
                <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                  tap &phi; [deg]:
                </label>
                <input
                  className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="tap_df_deg"
                  onChange={handleEquipChange}
                  value={equip.tap_df_deg}
                ></input>
              </div>
            </div>

            <div className="md:flex md: items-center mt-2">
              <div className="flex items-center md:w-1/2">
                <label className="text-gray-700 text-sm font-bold mr-2">
                  tap min:
                </label>
                <input
                  className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="tap_min"
                  onChange={handleEquipChange}
                  value={equip.tap_min}
                ></input>
              </div>
              <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
                <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                  tap max:
                </label>
                <input
                  className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="tap_max"
                  onChange={handleEquipChange}
                  value={equip.tap_max}
                ></input>
              </div>
            </div>
            <div className="flex">
              <input
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
                type="submit"
                value="Add Branch"
              ></input>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default InputForms;
