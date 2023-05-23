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

export const ComiteSeleccion = () => {
	const TABLA = "comiteevaluador";
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
	const [categoriasSeleccion, setcategoriasSeleccion] = useState(null);

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

	useEffect(() => {
		datatable
			.gettable("parametros/categorias")
			.then((categorias) => setcategoriasSeleccion(categorias));
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
	const cambiohtml = (x, name) => {
		let _product = { ...formData };
		_product[`${name}`] = x;
		dispatch(setFormData(_product));
	};

	/*eventos*/

	/**operacion transacciones */
	const saveProduct = () => {
		setSubmitted(true);
		if (formData.nom_coe?.trim()) {
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
					<TablaDatos datostabla={dataSet} titulo="Categorias ">
						<Column
							field="nom_coe"
							header="Nombre"
							sortable
							headerStyle={{ width: "50%", minWidth: "10rem" }}
						></Column>

						<Column
							field="ord_coe"
							header="Orden"
							sortable
							headerStyle={{ width: "5%", minWidth: "10rem" }}
						></Column>
						<Column
							field="categoraia"
							header="Categoria"
							sortable
							headerStyle={{ width: "35%", minWidth: "10rem" }}
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
								<div className="field col">
									<label htmlFor="nom_coe">Nombre:</label>
									<InputText
										id="nom_coe"
										value={formData.nom_coe}
										onChange={(e) => onInputChange(e, "nom_coe")}
										required
										autoFocus
										className={classNames({
											"p-invalid": submitted && !formData.nom_coe,
										})}
									/>
									{submitted && !formData.nom_coe && (
										<small className="p-invalid">Campo requerido.</small>
									)}
								</div>

								<div className="field col">
									<label htmlFor="pai_coe">País:</label>
									<InputText
										id="pai_coe"
										value={formData.pai_coe}
										onChange={(e) => onInputChange(e, "pai_coe")}
									/>
								</div>
								<div className="field col">
									<label htmlFor="per_coe">Perfil español:</label>
									<EditorHtml
										valorinicial={formData.per_coe}
										nombre="per_coe"
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className="formgrid grid">
									<div className="field col-6">
										<label htmlFor="ord_coe">Orden:</label>
										<InputText
											id="ord_coe"
											value={formData.ord_coe}
											onChange={(e) => onInputChange(e, "ord_coe")}
										/>
									</div>

									<div className="field col-6">
										<label htmlFor="cod_cat_coe">Categoria:</label>
										<Dropdown
											value={formData.cod_cat_coe}
											onChange={(e) => {
												dispatch(
													setFormData({ ...formData, cod_cat_coe: e.value })
												);
											}}
											options={categoriasSeleccion}
											optionLabel="name"
											placeholder="Seleccione"
										/>
									</div>
								</div>

								<div className="field">
									<ImagenCampo
										label="Imagen"
										formData={formData}
										CampoImagen="img_coe"
										nombreCampo="demo"
										edicampo={formData.img_coe}
										urlupload="/upload/images/site"
									/>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className="field col">
									<label htmlFor="per_coe_ing">Perfil ingles:</label>
									<EditorHtml
										valorinicial={formData.per_coe_ing}
										nombre="per_coe_ing"
										cambiohtml={cambiohtml}
									/>
								</div>
							</TabPanel>
						</TabView>

						{/* </div> */}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.nom_coe}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
