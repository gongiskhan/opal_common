import React from 'react';
import {render} from 'react-dom';
import {Header} from "../../src/index";
const App = () => (
  <Header />
);
render(<App />, document.getElementById("root"));