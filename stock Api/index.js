const { default: Axios } = require("axios");
const { query } = require("express");
let express = require("express");
let app = express();
let PORT = 5000;
let unirest = require("unirest");
let cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.post("/getStocks", (req, res) => {
  const { symbol } = req.body;

  unirest
    .get("https://alpha-vantage.p.rapidapi.com/query")
    .query({
      outputsize: "compact",
      datatype: "json",
      function: "TIME_SERIES_DAILY",
      symbol: !symbol ? "MSFT" : req.body.symbol,
    })
    .headers({
      "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPID_KEY,
      useQueryString: true,
    })
    .end((stk) => {
      if (stk.error) res.status(stk.error.status).json({ error: stk.error });
      res.json({ message: stk.body });
    });
});

app.listen(PORT, console.log(`server running at ${PORT}`));
