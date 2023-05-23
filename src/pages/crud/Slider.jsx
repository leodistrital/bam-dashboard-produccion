import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	InputText,
	Dropdown,
	InputTextarea,
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
import { ImagenCampo } from "../../components/crud/ImagenCampo";

export const Slider = () => {
	const TABLA = "sliders";
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
	const [dropdownTipoAliado, setdropdownTipoAliado] = useState(null);

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
		datatable.gettable("parametros/parametros/tipo_slider").then((datos) => {
			setdropdownTipoAliado(datos);
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
		if (formData.nom_sli?.trim()) {
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
					<TablaDatos datostabla={dataSet} titulo="Sliders">
						<Column
							field="tiposlider"
							header="Tipo"
							sortable
							headerStyle={{ width: "30%", minWidth: "10rem" }}
						></Column>
						<Column
							field="nom_sli"
							header="Nombre"
							sortable
							headerStyle={{ width: "40%", minWidth: "10rem" }}
						></Column>

						<Column
							field="ord_sli"
							header="Orden"
							sortable
							headerStyle={{ width: "20%", minWidth: "10rem" }}
						></Column>
						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header="Detalle Slider"
						modal={true}
						className="p-fluid"
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}
					>
						<div className="field">
							{/* <pre>{JSON.stringify(formData,2)}</pre> */}
							<label htmlFor="nom_sli">Nombre:</label>
							<InputText
								id="nom_sli"
								value={formData.nom_sli}
								onChange={(e) => onInputChange(e, "nom_sli")}
								required
								autoFocus
								className={classNames({
									"p-invalid": submitted && !formData.nom_sli,
								})}
							/>
							{submitted && !formData.nom_sli && (
								<small className="p-invalid">Campo requerido.</small>
							)}
						</div>
						<div className="formgrid grid">
							<div className="field col">
								<label htmlFor="tip_sli">Tipo</label>
								<Dropdown
									value={formData.tip_sli}
									onChange={(e) => {
										dispatch(setFormData({ ...formData, tip_sli: e.value }));
									}}
									options={dropdownTipoAliado}
									optionLabel="name"
									placeholder="Seleccione"
								/>
							</div>
							<div className="field col">
								<label htmlFor="ord_sli">Orden:</label>
								<InputText
									id="ord_sli"
									value={formData.ord_sli}
									onChange={(e) => onInputChange(e, "ord_sli")}
								/>
							</div>
						</div>

						{formData?.tip_sli == 2 ? (
							<div className="field">
								<label htmlFor="tex_sli_esp">Descripción:</label>
								<InputTextarea
									id="tex_sli_esp"
									value={formData.tex_sli_esp}
									onChange={(e) => onInputChange(e, "tex_sli_esp")}
									required
									rows={6}
									cols={20}
								/>
							</div>
						) : (
							<div className="field">
								<ImagenCampo
									label="Imagen"
									formData={formData}
									CampoImagen="img_sli_esp"
									nombreCampo="demo"
									edicampo={formData.img_sli_esp}
								/>
							</div>
						)}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.nom_sli}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
