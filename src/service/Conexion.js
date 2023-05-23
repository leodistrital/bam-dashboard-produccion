import axios from "axios";
import { store } from "../store/store";

const URL = process.env.REACT_APP_URLAPI + "/api/";
const URLlogin = process.env.REACT_APP_URLAPI + "/login";

export class Conexion {
	header = {};

	constructor() {
		const { xtoken } = store.getState().appsesion;
		this.header = {
			Authorization: xtoken,
		};
	}

	gettable(tabla) {
		return axios
			.get(URL + tabla, {
				headers: this.header,
			})
			.then((res) => {
				// console.log(res, "leo");
				return res.data;
			})
			.catch(function (err) {
				return 0;
			});
	}

	getItem(tabla, id) {
		return axios
			.get(URL + tabla + "/" + id, {
				headers: this.header,
			})
			.then((res) => res.data);
	}

	getCrearItem(tabla, data) {
		// console.log(tabla, data, 'envia crear')
		return axios
			.post(URL + tabla + "", { ...data }, { headers: this.header })
			.then((res) => res.data);
	}

	getEditarItem(tabla, data, id) {
		// console.log(data)
		return axios
			.put(URL + tabla + "/" + id, { ...data }, { headers: this.header })
			.then((res) => res.data);
	}
	getEliminarItem(tabla, data, id) {
		return axios
			.delete(URL + tabla + "/" + id, { headers: this.header })
			.then((res) => res.data);
	}

	getlogin(tabla, data) {
		// console.log(tabla, data, 'envia crear')
		return axios
			.post(URLlogin + "", { ...data })
			.then((res) => {
				// res.data
				// console.log(res)
				return res.data;
			})
			.catch(function (err) {
				return 0;
			});
	}
}
