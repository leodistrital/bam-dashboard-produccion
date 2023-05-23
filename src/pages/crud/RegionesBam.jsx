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

export const RegionesBam = () => {
	const TABLA = "regionesbam";
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
	const [valueDropMenueventos, setvalueDropMenueventos] = useState(null);
	const [dropdownasistencia, setdropdownasistencia] = useState(null);
	const [dropdownGalerias, setdropdownGalerias] = useState(null);

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
		//solo para que se ejecute una vez al inicio
		/** setting parametros dropdowns u otros objetos independientes */
		datatable.gettable("parametros/galeriaimagenes").then((datos) => {
			setdropdownGalerias(datos);
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
	const cambiohtml = (x, name) => {
		let _product = { ...formData };
		_product[`${name}`] = x;
		dispatch(setFormData(_product));
	};

	/*eventos*/

	/**operacion transacciones */
	const saveProduct = () => {
		setSubmitted(true);
		if (formData.nom_reg?.trim()) {
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
				className='actions'
				style={{
					display: "flex",
				}}>
				<Button
					icon='pi pi-pencil'
					className='p-button-rounded p-button-success mr-2'
					onClick={() => editProduct(rowData.id)}
				/>
				<Button
					icon='pi pi-trash'
					className='p-button-rounded p-button-warning mr-2'
					onClick={() => confirmDeleteProduct(rowData)}
				/>
			</div>
		);
	};

	return (
		<div className='grid'>
			<div className='col-12'>
				<div className='card'>
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos datostabla={dataSet} titulo='Programacion'>
						<Column
							field='nom_reg'
							header='Nombre'
							sortable
							headerStyle={{
								width: "50%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='fec_reg'
							header='Fecha'
							sortable
							headerStyle={{
								width: "350%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='ord_reg'
							header='Orden'
							sortable
							headerStyle={{
								width: "15%",
								minWidth: "10rem",
							}}></Column>

						<Column
							header='Acciones'
							body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header='Detalle Programacion'
						modal={true}
						className='p-fluid'
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}>
						<TabView>
							<TabPanel
								className='justify-content: flex-end;'
								headerTemplate={tabHeaderIIespanol}>
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='nom_reg'>Nombre:</label>
										<InputText
											id='nom_reg'
											value={formData.nom_reg}
											onChange={(e) =>
												onInputChange(e, "nom_reg")
											}
											required
											autoFocus
											className={classNames({
												"p-invalid":
													submitted &&
													!formData.nom_reg,
											})}
										/>
										{submitted && !formData.nom_reg && (
											<small className='p-invalid'>
												Campo requerido.
											</small>
										)}
									</div>

									<div className='field col-6'>
										<label htmlFor='fec_reg'>
											Periodo:
										</label>
										<InputText
											id='fec_reg'
											value={formData.fec_reg}
											onChange={(e) =>
												onInputChange(e, "fec_reg")
											}
										/>
									</div>
								</div>
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='ord_reg'>Orden:</label>
										<InputText
											id='ord_reg'
											value={formData.ord_reg}
											onChange={(e) =>
												onInputChange(e, "ord_reg")
											}
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='dat_reg'>Fecha:</label>
										<InputText
											id='dat_reg'
											value={formData.dat_reg}
											onChange={(e) =>
												onInputChange(e, "dat_reg")
											}
										/>
									</div>
								</div>

								<div className='field col'>
									<label htmlFor='tit_reg'>Título:</label>
									<InputText
										id='tit_reg'
										value={formData.tit_reg}
										onChange={(e) =>
											onInputChange(e, "tit_reg")
										}
									/>
								</div>
								<div className='field col'>
									<label htmlFor='sit_reg'>Subtitulo:</label>
									<InputText
										id='sit_reg'
										value={formData.sit_reg}
										onChange={(e) =>
											onInputChange(e, "sit_reg")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='des_reg'>
										Descripcion:
									</label>
									<EditorHtml
										valorinicial={formData.des_reg}
										nombre='des_reg'
										cambiohtml={cambiohtml}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='acr_reg'>
										Link Acreditación:
									</label>
									<InputText
										id='acr_reg'
										value={formData.acr_reg}
										onChange={(e) =>
											onInputChange(e, "acr_reg")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='ade_reg'>
										Agenda descripción:
									</label>
									<EditorHtml
										valorinicial={formData.ade_reg}
										nombre='ade_reg'
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className='field col'>
									<AdjuntoCampo
										label='Programacion Agenda'
										formData={formData}
										CampoImagen='apd_reg'
										nombreCampo='demo'
										edicampo={formData.apd_reg}
										urlupload='/upload/docs'
									/>
								</div>

								<div className='field col'>
									<label htmlFor='gal_reg'>
										Galeria de fotos
									</label>
									<Dropdown
										value={formData.gal_reg}
										onChange={(e) => {
											dispatch(
												setFormData({
													...formData,
													gal_reg: e.value,
												})
											);
										}}
										options={dropdownGalerias}
										optionLabel='name'
										placeholder='Seleccione'
									/>
								</div>
								<div className='field col'>
									<label htmlFor='ter_reg'>
										TyC descripción:
									</label>
									<EditorHtml
										valorinicial={formData.ter_reg}
										nombre='ter_reg'
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className='field col'>
									<AdjuntoCampo
										label='TyC'
										formData={formData}
										CampoImagen='tpd_reg'
										nombreCampo='demo'
										edicampo={formData.tpd_reg}
										urlupload='/upload/docs'
									/>
								</div>

								<div className='field col'>
									<ImagenCampo
										label='Logos'
										formData={formData}
										CampoImagen='log_reg'
										nombreCampo='demo'
										edicampo={formData.log_reg}
										urlupload='/upload/images/site'
									/>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className='field col'>
									<label htmlFor='tit_reg_ing'>Título:</label>
									<InputText
										id='tit_reg_ing'
										value={formData.tit_reg_ing}
										onChange={(e) =>
											onInputChange(e, "tit_reg_ing")
										}
									/>
								</div>
								<div className='field col'>
									<label htmlFor='sit_reg_ing'>
										Subtitulo:
									</label>
									<InputText
										id='sit_reg_ing'
										value={formData.sit_reg_ing}
										onChange={(e) =>
											onInputChange(e, "sit_reg_ing")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='des_reg_ing'>
										Descripcion:
									</label>
									<EditorHtml
										valorinicial={formData.des_reg_ing}
										nombre='des_reg_ing'
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className='field col'>
									<label htmlFor='ade_reg_ing'>
										Agenda descripción:
									</label>
									<EditorHtml
										valorinicial={formData.ade_reg_ing}
										nombre='ade_reg_ing'
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className='field col'>
									<label htmlFor='ter_reg_ing'>
										TyC descripción:
									</label>
									<EditorHtml
										valorinicial={formData.ter_reg_ing}
										nombre='ter_reg_ing'
										cambiohtml={cambiohtml}
									/>
								</div>
							</TabPanel>
						</TabView>

						{/* </div> */}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.tit_ave}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
