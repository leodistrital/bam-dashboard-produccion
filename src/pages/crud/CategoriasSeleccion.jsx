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
import { AdjuntoCampo } from "../../components/crud/AdjuntoCampo";

export const CategoriasSeleccion = () => {
	const TABLA = "categoriasconvocatoria";
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
	const cambiohtml = (x, name) => {
		let _product = { ...formData };
		_product[`${name}`] = x;
		dispatch(setFormData(_product));
	};

	/*eventos*/

	/**operacion transacciones */
	const saveProduct = () => {
		setSubmitted(true);
		if (formData.nom_cac?.trim()) {
			// console.log(formData);
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

	return (
		<div className="grid">
			<div className="col-12">
				<div className="card">
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos datostabla={dataSet} titulo="Categorias Convocatoria">
						<Column
							field="nom_cac"
							header="Titulo"
							sortable
							headerStyle={{ width: "60%", minWidth: "10rem" }}
						></Column>
						<Column
							field="ord_cac"
							header="Orden"
							sortable
							headerStyle={{ width: "30%", minWidth: "10rem" }}
						></Column>

						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header="Detalle Categoria"
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
								{/* <div className="formgrid grid"> */}
								<div className="field col">
									{/* <pre>{JSON.stringify(formData,2)}</pre> */}
									<label htmlFor="nom_cac">Nombre:</label>
									<InputText
										id="nom_cac"
										value={formData.nom_cac}
										onChange={(e) => onInputChange(e, "nom_cac")}
										required
										autoFocus
										className={classNames({
											"p-invalid": submitted && !formData.nom_cac,
										})}
									/>
									{submitted && !formData.nom_cac && (
										<small className="p-invalid">Campo requerido.</small>
									)}
								</div>

								<div className="field col ">
									<label htmlFor="tit_cac">Titulo Español:</label>
									<InputText
										id="tit_cac"
										value={formData.tit_cac}
										onChange={(e) => onInputChange(e, "tit_cac")}
									/>
								</div>
								<div className="field col">
									<label htmlFor="des_cac">Descripcion español:</label>
									<EditorHtml
										valorinicial={formData.des_cac}
										nombre="des_cac"
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className="formgrid grid col">
									<div className="field col-6">
										<label htmlFor="ord_cac">Orden:</label>
										<InputText
											id="ord_cac"
											value={formData.ord_cac}
											onChange={(e) => onInputChange(e, "ord_cac")}
										/>
									</div>
									<div className="field col-6">
										<label htmlFor="col_cac">Color:</label>
										<InputText
											id="col_cac"
											value={formData.col_cac}
											onChange={(e) => onInputChange(e, "col_cac")}
										/>
									</div>
								</div>
								<div className="field col ">
									<label htmlFor="ad2_cac">Me quiero postular:</label>
									<InputText
										id="ad2_cac"
										value={formData.ad2_cac}
										onChange={(e) => onInputChange(e, "ad2_cac")}
									/>
								</div>

								<div className="formgrid grid">
									<div className="field col-6">
										<AdjuntoCampo
											label="Como participo"
											formData={formData}
											CampoImagen="ad1_cac"
											nombreCampo="demo"
											edicampo={formData.ad1_cac}
											urlupload="/upload/docs"
										/>
									</div>
								</div>
								<div className="field col">
									<ImagenCampo
										label="Imagen"
										formData={formData}
										CampoImagen="img_cac"
										nombreCampo="demo"
										edicampo={formData.img_cac}
										urlupload="/upload/images/site"
									/>
								</div>
							</TabPanel>

							{/* </div> */}

							{/* <div className="formgrid grid"> */}
							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className="field col">
									<label htmlFor="tit_cac_ing">Titulo ingles:</label>
									<InputText
										id="tit_cac_ing"
										value={formData.tit_cac_ing}
										onChange={(e) => onInputChange(e, "tit_cac_ing")}
									/>
								</div>

								<div className="field col">
									<label htmlFor="des_cac_ing">Descripcion ingles:</label>
									<EditorHtml
										valorinicial={formData.des_cac_ing}
										nombre="des_cac_ing"
										cambiohtml={cambiohtml}
									/>
								</div>
							</TabPanel>
						</TabView>

						{/* </div> */}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.nom_cac}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
