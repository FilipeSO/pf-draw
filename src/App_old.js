import React from "react";
import { useEffect, useRef, useState } from "react";
import { data } from "./data";
function App() {
  const selectedColor = "#00F";
  const unSelectedColor = "#000";
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [state, setState] = useState({
    name: "",
    pos: "",
    type: "",
    volt: "",
    potIn: "",
    potOut: "",
    selected: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
    data.forEach((item) => {
      drawCircleToCoordinates(item.pos.x, item.pos.y, unSelectedColor);
    });
  }, []);

  const drawCircleToCoordinates = (x, y, color) => {
    contextRef.current.fillStyle = color; //hex "#xxxxxx"
    contextRef.current.beginPath();
    contextRef.current.arc(x, y, 5, 0, Math.PI * 2, true);
    contextRef.current.fill();
  };
  const checkToolTip = ({ nativeEvent }) => {
    var rect = nativeEvent.target.getBoundingClientRect();
    var x = nativeEvent.clientX - rect.left;
    var y = nativeEvent.clientY - rect.top;
    console.log(x, y);
    for (var i = 0; i < data.length; i++) {
      if (
        data[i].pos.x + 5 > x &&
        data[i].pos.x - 5 < x &&
        data[i].pos.y + 5 > y &&
        data[i].pos.y - 5 < y
      ) {
        drawCircleToCoordinates(state.pos.x, state.pos.y, unSelectedColor);
        drawCircleToCoordinates(data[i].pos.x, data[i].pos.y, selectedColor);
        setState({ ...state, ...data[i], selected: true });
        break;
      } else {
        drawCircleToCoordinates(state.pos.x, state.pos.y, unSelectedColor);
        setState({ ...state, selected: false });
      }
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} onClick={checkToolTip} />
      {state.selected && (
        <div class="modal" style={{ top: state.pos.y, left: state.pos.x }}>
          <p>Nome: {state.name}</p>
          <p>Tipo: {state.type}</p>
          <p>Tensão: {state.volt}</p>
          <p>Potência Entrada: {state.potIn}</p>
          <p>Potência Saída: {state.potOut}</p>
        </div>
      )}
    </div>
  );
}

export default App;
