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
	EditorHtml
} from "../../components/crud";
import { Conexion } from "../../service/Conexion";
import {
	TablaDatos,
	BarraSuperior,
	EliminarVentana,
	productDialogFooter
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { setDataSet, setFormData } from "../../store/appSlice";
import { Cargando } from "../../components/crud/Cargando";
import { ImagenCampo } from "../../components/crud/ImagenCampo";
import { AdjuntoCampo } from "../../components/crud/AdjuntoCampo";

export const Proyectos = () => {
	const TABLA = "proyectos";
	let emptyFormData = {};
	const { dataSet, formData } = useSelector(state => state.appsesion); //datos el storage redux
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

		datatable.gettable(TABLA).then(data => {
			dispatch(setDataSet(data));
			setCargando(false);
		});
	}, [recargar]);

	useEffect(() => {
		datatable
			.gettable("parametros/categorias")
			.then(categorias => setcategoriasSeleccion(categorias));
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

	const editProduct = id => {
		setCargando(true);
		datatable
			.getItem(TABLA, id)
			.then(data => dispatch(setFormData({ ...data.data })));
		setProductDialog(true);
		setCargando(false);
	};

	const confirmDeleteProduct = fila => {
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
			life: 4000
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
		if (formData.per_pro?.trim()) {
			// console.log(formData);
			// debugger
			setCargando(true);
			if (formData.id == null) {
				//nuevo registro
				datatable
					.getCrearItem(TABLA, formData)
					.then(data => trasaccionExitosa());
			} else {
				//editar registro
				datatable
					.getEditarItem(TABLA, formData, formData.id)
					.then(data => trasaccionExitosa());
			}
		}
	};
	const deleteProduct = () =>
		datatable
			.getEliminarItem(TABLA, formData, formData.id)
			.then(data => trasaccionExitosa("borrar"));
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

	const actionBodyTemplate = rowData => {
		return (
			<div
				className="actions"
				style={{
					display: "flex"
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
					<TablaDatos datostabla={dataSet} titulo="Seleccionados">
						<Column
							field="nom_pro"
							header="Proyecto"
							sortable
							headerStyle={{ width: "25%", minWidth: "10rem" }}
						></Column>

						<Column
							field="per_pro"
							header="Autor"
							sortable
							headerStyle={{ width: "25%", minWidth: "10rem" }}
						></Column>
						<Column
							field="categoraia"
							header="Categoria"
							sortable
							headerStyle={{ width: "35%", minWidth: "10rem" }}
						></Column>
						<Column
							field="ord_pro"
							header="Orden"
							sortable
							headerStyle={{ width: "5%", minWidth: "10rem" }}
						></Column>

						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header="Detalle Seleccionado"
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
									<label htmlFor="per_pro">Autor:</label>
									<InputText
										id="per_pro"
										value={formData.per_pro}
										onChange={e => onInputChange(e, "per_pro")}
										required
										autoFocus
										className={classNames({
											"p-invalid": submitted && !formData.per_pro
										})}
									/>
									{submitted && !formData.per_pro && (
										<small className="p-invalid">Campo requerido.</small>
									)}
								</div>

								<div className="field col">
									<label htmlFor="nom_pro">Proyecto:</label>
									<InputText
										id="nom_pro"
										value={formData.nom_pro}
										onChange={e => onInputChange(e, "nom_pro")}
									/>
								</div>
								<div className="field col">
									<label htmlFor="sin_pro">Descripcion:</label>
									<InputTextarea
										id="sin_pro"
										value={formData.sin_pro}
										onChange={e => onInputChange(e, "sin_pro")}
										required
										rows={6}
										cols={20}
									/>
								</div>
								<div className="field col">
									<label htmlFor="con_pro">Sinopsis:</label>
									<EditorHtml
										valorinicial={formData.con_pro}
										nombre="con_pro"
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className="formgrid grid">
									<div className="field col-6">
										<label htmlFor="ord_pro">Orden:</label>
										<InputText
											id="ord_pro"
											value={formData.ord_pro}
											onChange={e => onInputChange(e, "ord_pro")}
										/>
									</div>

									<div className="field col-6">
										<label htmlFor="cod_cat_pro">Categoria:</label>
										<Dropdown
											value={formData.cod_cat_pro}
											onChange={e => {
												dispatch(
													setFormData({ ...formData, cod_cat_pro: e.value })
												);
											}}
											options={categoriasSeleccion}
											optionLabel="name"
											placeholder="Seleccione"
										/>
									</div>
								</div>
								<div className="formgrid grid">
									<div className="field col-6">
										<label htmlFor="gen_pro">Genero:</label>
										<InputText
											id="gen_pro"
											value={formData.gen_pro}
											onChange={e => onInputChange(e, "gen_pro")}
										/>
									</div>

									<div className="field col-6">
										<label htmlFor="dur_pro">Duracion:</label>
										<InputText
											id="dur_pro"
											value={formData.dur_pro}
											onChange={e => onInputChange(e, "dur_pro")}
										/>
									</div>
								</div>
								<div className="formgrid grid">
									<div className="field col-6">
										<label htmlFor="pdc_pro">Productora:</label>
										<InputText
											id="pdc_pro"
											value={formData.pdc_pro}
											onChange={e => onInputChange(e, "pdc_pro")}
										/>
									</div>

									<div className="field col-6">
										<label htmlFor="pdc_lin_pro">Link Productora:</label>
										<InputText
											id="pdc_lin_pro"
											value={formData.pdc_lin_pro}
											onChange={e => onInputChange(e, "pdc_lin_pro")}
										/>
									</div>
								</div>

								<div className="field">
									<ImagenCampo
										label="Imagen"
										formData={formData}
										CampoImagen="img_pro"
										nombreCampo="demo"
										edicampo={formData.img_pro}
										urlupload="/upload/images/site"
									/>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className="field col">
									<label htmlFor="nom_pro_ing">Proyecto ingles:</label>
									<InputText
										id="nom_pro_ing"
										value={formData.nom_pro_ing}
										onChange={e => onInputChange(e, "nom_pro_ing")}
									/>
								</div>
								<div className="field col">
									<label htmlFor="sin_pro_ing">Descripcion ingles:</label>
									<InputTextarea
										id="sin_pro_ing"
										value={formData.sin_pro_ing}
										onChange={e => onInputChange(e, "sin_pro_ing")}
										required
										rows={6}
										cols={20}
									/>
								</div>
								<div className="field col">
									<label htmlFor="con_pro_ing">Sinopsis ingles:</label>
									<EditorHtml
										valorinicial={formData.con_pro_ing}
										nombre="con_pro_ing"
										cambiohtml={cambiohtml}
									/>
								</div>
							</TabPanel>
						</TabView>

						{/* </div> */}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.per_pro}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
