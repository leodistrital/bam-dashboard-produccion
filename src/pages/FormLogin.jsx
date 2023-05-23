import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useDispatch } from "react-redux";
import { logInn } from "../store/appSlice";
import { Cargando } from "../components/crud/Cargando";
import { useSelector } from "react-redux";
import { setDataSet, setFormData } from "../store/appSlice";
import { Conexion } from "../service/Conexion";
import { Toast } from "primereact/toast";

export const FormLogin = () => {
	const appSession = useSelector((state) => state.appsesion);
	const { dataSet, formData } = useSelector((state) => state.appsesion); //datos el storage redux
	const [cargando, setCargando] = useState(false);
	const dispatch = useDispatch();
	const toast = useRef(null);
	const datatable = new Conexion();

	const handleLogInn = () => {
		console.log("entro");
		setCargando(true);
		// dispatch(setFormData(emptyFormData));
		datatable.getlogin("login", formData).then((data) => {
			// console.log(data, 'estamo en el form')
			if (data === 0) {
				console.log("no login");
				toast.current.show({
					severity: "error",
					summary: "Error de Login",
					detail: "Los datos no corresponden",
					life: 6000,
				});
				setCargando(false);
				return false;
			}
			
			// console.log(data.token)
			// 	dispatch(setDataSet(data));
			 dispatch(logInn(data.token));
			setCargando(false);
			// 	console.log(data, 'en aliadops')
			// 	setCargando(false);
		});
	};

	/* validaciones de campos */
	const onInputChange = (e, name) => {
		// console.log(e.target, e.target.value, name);
		const val = (e.target && e.target.value) || "";
		let _product = { ...formData };
		_product[`${name}`] = val;
		dispatch(setFormData(_product));
	};

	return (
		<div className="flex flex-column justify-content-center min-h-screen">
			<div className="flex align-items-center justify-content-center ">
				<div className="surface-card p-4 shadow-2 border-round w-full lg:w-3">
					<div className="text-center mb-5">
						{/* <img
							src="assets/layout/images/logonextrade.jpg"
							alt="hyper"
							height={80}
							className="mb-3"
						/> */}
						<div className="text-900 text-3xl font-medium mb-3">
							Iniciar Sesión
						</div>
					</div>
					<div>
						<label htmlFor="email" className="block text-900 font-medium mb-2">
							Usuario
						</label>
						<InputText
							id="email"
							type="text"
							className="w-full mb-3"
							onChange={(e) => onInputChange(e, "email")}
						/>

						<label
							htmlFor="password"
							className="block text-900 font-medium mb-2"
						>
							Contreaseña
						</label>
						<InputText
							id="password"
							type="password"
							className="w-full mb-3"
							onChange={(e) => onInputChange(e, "password")}
						/>

						<Button
							label="Sign In"
							icon="pi pi-user"
							className="w-full"
							onClick={handleLogInn}
						/>
					</div>
				</div>
				{/* <pre style={{ fontSize: "0.9rem" }}>
					{JSON.stringify(appSession, null, "\n")}
				</pre> */}
			</div>
			<Cargando cargando={cargando} />
			<Toast  position="top-left" ref={toast} />
		</div>
	);
};
