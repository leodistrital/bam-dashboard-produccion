import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	InputTextarea,
	Dialog,
	InputText,
	Dropdown,
} from "../../components/crud";
import { Conexion } from "../../service/Conexion";
import {
	TablaDatos,
	BarraSuperior,
	EliminarVentana,
	productDialogFooter,
} from "../../components/";
import { useDispatch, useSelector } from "react-redux";
import { setDataSet, setFormData } from "../../store/appSlice";
import { Cargando } from "../../components/crud/Cargando";

export const Cliente = () => {
	const TABLA = "cliente";
	let emptyFormData = {};
	const { dataSet, formData } = useSelector((state) => state.appsesion); //datos el storage redux
	const dispatch = useDispatch();
	const [productDialog, setProductDialog] = useState(false);
	const [deleteProductDialog, setDeleteProductDialog] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const toast = useRef(null);
	const [recargar, setrecargar] = useState(0);
	const [cargando, setCargando] = useState(false);
	const datatable = new Conexion();
	const [dropdownValues, setdropdownValues] = useState(null);

	useEffect(() => {
		//cargar la data total
		setCargando(true);
		dispatch(setFormData(emptyFormData));
		datatable.gettable(TABLA).then((data) => {
			dispatch(setDataSet(data));
			setCargando(false);
		});
	}, [recargar]);

	useEffect(() => {
		//solo para que se ejecute una vez al inicio
		/** setting parametros dropdowns u otros objetos independientes */
		datatable.gettable("parametros/usuario").then((datos) => {
			setdropdownValues(datos);
		});
		/** setting parametros dropdowns u otros objetos independientes */
	}, []);

	/*eventos*/
	const openNew = () => {
		dispatch(setFormData(emptyFormData));
		setSubmitted(false);
		setProductDialog(true);
	};
	const hideDialog = () => {
		setSubmitted(false);
		setProductDialog(false);
	};

	const hideDeleteProductDialog = () => {
		setDeleteProductDialog(false);
	};

	const editProduct = (id) => {
		setCargando(true);
		datatable
			.getItem(TABLA, id)
			.then((data) => dispatch(setFormData({ ...data })));
		setProductDialog(true);
		setCargando(false);
	};

	const confirmDeleteProduct = (fila) => {
		dispatch(setFormData(fila));
		setDeleteProductDialog(true);
	};
	const trasaccionExitosa = (tipo = "") => {
		setrecargar(recargar + 1);
		tipo === "borrar" ? setDeleteProductDialog(false) : hideDialog();
		dispatch(setFormData(emptyFormData));

		toast.current.show({
			severity: "success",
			summary: "Confirmacion",
			detail: "Transacción Exitosa",
			life: 4000,
		});
	};
	/*eventos*/

	/**operacion transacciones */
	const saveProduct = () => {
		setSubmitted(true);
		if (formData.nombre?.trim()) {
			setCargando(true);
			if (formData.id == null) {
				//nuevo registro
				datatable
					.getCrearItem(TABLA, formData)
					.then((data) => trasaccionExitosa());
			} else {
				//editar registro
				datatable
					.getEditarItem(TABLA, formData, formData.id)
					.then((data) => trasaccionExitosa());
			}
		}
	};
	const deleteProduct = () =>
		datatable
			.getEliminarItem(TABLA, formData, formData.id)
			.then((data) => trasaccionExitosa("borrar"));
	/**operacion transacciones */

	/* validaciones de campos */
	const onInputChange = (e, name) => {
		// console.log(e.target, e.target.value, name);
		const val = (e.target && e.target.value) || "";
		let _product = { ...formData };
		_product[`${name}`] = val;
		dispatch(setFormData(_product));
	};

	const actionBodyTemplate = (rowData) => {
		return (
			<div
				className="actions"
				style={{
					display: "flex",
				}}
			>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-success mr-2"
					onClick={() => editProduct(rowData.id)}
				/>
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-warning mr-2"
					onClick={() => confirmDeleteProduct(rowData)}
				/>
			</div>
		);
	};

	return (
		<div className="grid">
			<div className="col-12">
				<div className="card">
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos datostabla={dataSet} titulo="Clientes">
						<Column
							field="nombre"
							header="Nombre"
							sortable
							headerStyle={{ width: "20%", minWidth: "10rem" }}
						></Column>
						<Column
							field="contacto"
							header="Contacto"
							sortable
							headerStyle={{ width: "20%", minWidth: "10rem" }}
						></Column>
						<Column
							field="email"
							header="Email"
							sortable
							headerStyle={{ width: "20%", minWidth: "10rem" }}
						></Column>
						<Column
							field="nit"
							header="nit"
							sortable
							headerStyle={{ width: "20%", minWidth: "10rem" }}
						></Column>
						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header="Detalle Cliente"
						modal={true}
						className="p-fluid"
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}
					>
						<div className="field">
							<label htmlFor="nombre">Nombre:</label>
							<InputText
								id="nombre"
								value={formData.nombre}
								onChange={(e) => onInputChange(e, "nombre")}
								required
								autoFocus
								className={classNames({
									"p-invalid": submitted && !formData.nombre,
								})}
							/>
							{submitted && !formData.nombre && (
								<small className="p-invalid">Campo requerido.</small>
							)}
						</div>

						<div className="field">
							<label htmlFor="name">Razon Social:</label>
							<InputText
								id="rsocial"
								value={formData.rsocial}
								onChange={(e) => onInputChange(e, "rsocial")}
								autoFocus
							/>
						</div>
						<div className="field">
							<label htmlFor="contacto">Nombre contacto:</label>
							<InputText
								id="contacto"
								value={formData.contacto}
								onChange={(e) => onInputChange(e, "contacto")}
								autoFocus
							/>
						</div>

						<div className="formgrid grid">
							<div className="field col">
								<label htmlFor="direccion">Direccion</label>
								<InputText
									id="direccion"
									value={formData.direccion}
									onChange={(e) => onInputChange(e, "direccion")}
									autoFocus
								/>
							</div>
							<div className="field col">
								<label htmlFor="quantity">Telefonos</label>
								<InputText
									id="telefonos"
									value={formData.telefonos}
									onChange={(e) => onInputChange(e, "telefonos")}
								/>
							</div>
						</div>

						<div className="formgrid grid">
							<div className="field col">
								<label htmlFor="price">E-mail:</label>
								<InputText
									id="email"
									value={formData.email}
									onChange={(e) => onInputChange(e, "email")}
								/>
							</div>
							<div className="field col">
								<label htmlFor="quantity">NIT:</label>
								<InputText
									id="nit"
									value={formData.nit}
									onChange={(e) => onInputChange(e, "nit")}
								/>
							</div>
						</div>
						<div className="field col">
							<label htmlFor="responsable">Responsable</label>
							<Dropdown
								value={formData.responsable}
								onChange={(e) => {
									dispatch(setFormData({ ...formData, responsable: e.value }));
								}}
								options={dropdownValues}
								optionLabel="name"
								placeholder="Seleccione"
							/>
						</div>

						<div className="field">
							<label htmlFor="description">Observaciones:</label>
							<InputTextarea
								id="observaciones"
								value={formData.observaciones}
								onChange={(e) => onInputChange(e, "observaciones")}
								required
								rows={3}
								cols={20}
							/>
						</div>
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
