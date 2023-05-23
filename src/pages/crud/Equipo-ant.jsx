import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	InputText,
	InputTextarea
} from "../../components/crud";
import { Conexion } from "../../service/Conexion";
import {
	TablaDatos,
	BarraSuperior,
	EliminarVentana,
	productDialogFooter,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { setDataSet, setFormData } from "../../store/appSlice";
import { Cargando } from "../../components/crud/Cargando";
import { AdjuntoCampo } from "../../components/crud/AdjuntoCampo";
import { ImagenCampo } from "../../components/crud/ImagenCampo";

export const Equipo = () => {
	const TABLA = "equipos";
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
		// datatable.gettable("parametros/tipoacifras").then((datos) => {
		// 	setdropdownTipoAliado(datos);
		// });
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
			.then((data) => dispatch(setFormData({ ...data.data })));
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
		if (formData.nom_equ_esp?.trim()) {
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
					<TablaDatos datostabla={dataSet} titulo="Equipos">
						<Column
							field="nom_equ_esp"
							header="Nombre"
							sortable
							headerStyle={{ width: "70%", minWidth: "10rem" }}
						></Column>

						<Column
							field="ord_equ"
							header="Orden"
							sortable
							headerStyle={{ width: "20%", minWidth: "10rem" }}
						></Column>
						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header="Detalle Equipo"
						modal={true}
						className="p-fluid"
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}
					>
						<div className="field">
							{/* <pre>{JSON.stringify(formData, 2)}</pre> */}
							<label htmlFor="nom_doc_esp">Nombre:</label>
							<InputText
								id="nom_equ_esp"
								value={formData.nom_equ_esp}
								onChange={(e) => onInputChange(e, "nom_equ_esp")}
								required
								autoFocus
								className={classNames({
									"p-invalid": submitted && !formData.nom_equ_esp,
								})}
							/>
							{submitted && !formData.nom_equ_esp && (
								<small className="p-invalid">Campo requerido.</small>
							)}
						</div>
						<div className="field">
							<label htmlFor="obj_equ_esp">Descripción:</label>
							<InputTextarea
								id="obj_equ_esp"
								value={formData.obj_equ_esp}
								onChange={(e) => onInputChange(e, "obj_equ_esp")}
								required
								rows={6}
								cols={20}
							/>
						</div>
						<div className="field">
							<ImagenCampo
								label="Imagen"
								formData={formData}
								CampoImagen="img_equ"
								nombreCampo="demo"
								edicampo={formData.img_equ}
							/>
						</div>

						<div className="field">
							<ImagenCampo
								label="Logo"
								formData={formData}
								CampoImagen="log_equ"
								nombreCampo="demo"
								edicampo={formData.log_equ}
							/>
						</div>

						<div className="formgrid grid">
							<div className="field col-2">
								<label htmlFor="ord_equ">Orden:</label>
								<InputText
									id="ord_equ"
									value={formData.ord_equ}
									onChange={(e) => onInputChange(e, "ord_equ")}
								/>
							</div>
						</div>
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.nom_equ_esp}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
