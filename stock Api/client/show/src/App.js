import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import { Row, Col } from "react-bootstrap";
import createPlotlyComponent from "react-plotlyjs";
import Plotly from "plotly.js/dist/plotly-cartesian";
const Plot = createPlotlyComponent(Plotly);
function App() {
  const [check, setCheck] = useState(false);
  const [error, setError] = useState();
  const [stock, setStock] = useState();
  const [stockx] = useState([]);
  const [stocky] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    Axios.post("http://localhost:5000/getStocks")
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setCheck(true);
        } else {
          setSymbol(data.data.message["Meta Data"]["2. Symbol"]);
          setStock(data.data.message["Time Series (Daily)"]);
          console.log(data.data.message);
          setCheck(false);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  for (const key in stock) {
    stockx.push(key);
    stocky.push(stock[key]["1. open"]);
  }

  const Chart = () => {
    return (
      <Plot
        data={[
          {
            x: stockx,
            y: stocky,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
          },
        ]}
        layout={{ width: 1600, height: 440, title: symbol }}
      />
    );
  };
  const input = () => {
    return (
      <div className="text-center">
        <input
          className="stk-input"
          placeholder="MICROSOFT - MSFT"
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="App text-center">
      <h1 className="pt-3 ">STOCK MARKET</h1>
      <Row>{input()}</Row>
      <Row>
        <div className="text-center mt-2">
          <button className="stk-btn btn-dark">Submit</button>
        </div>
      </Row>
      <div className="m-auto text-center p-auto">
        <Chart />
      </div>
    </div>
  );
}

export default App;
