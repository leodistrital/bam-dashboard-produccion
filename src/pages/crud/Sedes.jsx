import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	InputText,
	Dropdown,
	InputTextarea,
	TabView,
	TabPanel,
	tabHeaderIIespanol,
	tabHeaderIIingles,
	EditorHtml,
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
import { ImagenCampo } from "../../components/crud/ImagenCampo";

export const Sedes = () => {
	const TABLA = "sedes";
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

	// console.log({grupo});

	useEffect(() => {
		//cargar la data total
		setCargando(true);
		dispatch(setFormData(emptyFormData));

		datatable.gettable(TABLA).then((data) => {
			dispatch(setDataSet(data));
			setCargando(false);
		});
	}, [recargar]);

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
		if (formData.nom_sed?.trim()) {
			console.log(formData);
			// debugger
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

		// console.log(_product);
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
	const cambiohtml = (x, name) => {
		let _product = { ...formData };
		_product[`${name}`] = x;
		dispatch(setFormData(_product));
	};

	return (
		<div className="grid">
			<div className="col-12">
				<div className="card">
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos datostabla={dataSet} titulo="Sedes">
						<Column
							field="nom_sed"
							header="Nombre"
							sortable
							headerStyle={{ width: "60%", minWidth: "10rem" }}
						></Column>
						<Column
							field="ord_sed"
							header="Orden"
							sortable
							headerStyle={{ width: "30%", minWidth: "10rem" }}
						></Column>

						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header="Detalle Sedes"
						modal={true}
						className="p-fluid"
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}
					>
						<TabView>
							<TabPanel
								className="justify-content: flex-end;"
								headerTemplate={tabHeaderIIespanol}
							>
								<div className="formgrid grid">
									<div className="field col">
										{/* <pre>{JSON.stringify(formData,2)}</pre> */}
										<label htmlFor="nom_sed">Nombre español:</label>
										<InputText
											id="nom_sed"
											value={formData.nom_sed}
											onChange={(e) => onInputChange(e, "nom_sed")}
											required
											autoFocus
											className={classNames({
												"p-invalid": submitted && !formData.nom_sed,
											})}
										/>
										{submitted && !formData.nom_sed && (
											<small className="p-invalid">Campo requerido.</small>
										)}
									</div>
								</div>

								<div className="formgrid grid">
									<div className="field col">
										<label htmlFor="dir_sed">Direccion español:</label>
										<EditorHtml
											valorinicial={formData.dir_sed}
											nombre="dir_sed"
											cambiohtml={cambiohtml}
										/>
										{/* <InputText
											id="dir_sed"
											value={formData.dir_sed}
											onChange={(e) => onInputChange(e, "dir_sed")}
										/> */}
									</div>
								</div>

								<div className="formgrid grid">
									<div className="field col">
										<label htmlFor="des_sed">Descripcion español:</label>
										<EditorHtml
											valorinicial={formData.des_sed}
											nombre="des_sed"
											cambiohtml={cambiohtml}
										/>
										{/* <InputTextarea
											id="des_sed"
											value={formData.des_sed}
											onChange={(e) => onInputChange(e, "des_sed")}
											rows={6}
											cols={20}
										/> */}
									</div>
								</div>

								<div className="formgrid grid">
									<div className="field col-6">
										<label htmlFor="ord_sed">Orden:</label>
										<InputText
											id="ord_sed"
											value={formData.ord_sed}
											onChange={(e) => onInputChange(e, "ord_sed")}
										/>
									</div>
								</div>

								<div className="field">
									<ImagenCampo
										label="Imagen"
										formData={formData}
										CampoImagen="img_sed"
										nombreCampo="demo"
										edicampo={formData.img_sed}
										urlupload="/upload/images/site"
									/>
								</div>
							</TabPanel>
							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className="field col">
									<label htmlFor="nom_sed_ing">Categoria ingles:</label>
									<InputText
										id="nom_sed_ing"
										value={formData.nom_sed_ing}
										onChange={(e) => onInputChange(e, "nom_sed_ing")}
									/>
								</div>
								<div className="field col">
									<label htmlFor="dir_sed_ing">Direccion ingles:</label>
									<EditorHtml
										valorinicial={formData.dir_sed_ing}
										nombre="dir_sed_ing"
										cambiohtml={cambiohtml}
									/>
									{/* <InputText
										id="dir_sed_ing"
										value={formData.dir_sed_ing}
										onChange={(e) => onInputChange(e, "dir_sed_ing")}
									/> */}
								</div>
								<div className="field col">
									<label htmlFor="des_sed_ing">Descripcion ingles:</label>
									<EditorHtml
										valorinicial={formData.des_sed_ing}
										nombre="des_sed_ing"
										cambiohtml={cambiohtml}
									/>
									{/* <InputTextarea
										id="des_sed_ing"
										value={formData.des_sed_ing}
										onChange={(e) => onInputChange(e, "des_sed_ing")}
										required
										rows={6}
										cols={20}
									/> */}
								</div>
							</TabPanel>
						</TabView>
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.nom_sed}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
