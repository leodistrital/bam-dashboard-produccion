import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./store/store";
import { Provider } from "react-redux";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./assets/layout/layout.scss";

import { HashRouter } from "react-router-dom";
import { Seguridad } from "./Seguridad";

ReactDOM.createRoot(document.getElementById("root")).render(
	<HashRouter>
		<Provider store={store}>
			<Seguridad />
		</Provider>
	</HashRouter>
);
