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

export const ProgramacionEventos = () => {
	const TABLA = "agendaeventos";
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
			.gettable("parametros/menueventos")
			.then((menu) => setvalueDropMenueventos(menu));
		datatable.gettable("parametros/parametros/asistencia").then((datos) => {
			setdropdownasistencia(datos);
		});
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
		if (formData.tit_ave?.trim()) {
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
							field='tit_mne'
							header='Menú'
							sortable
							headerStyle={{
								width: "30%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='tit_ave'
							header='Nombre'
							sortable
							headerStyle={{
								width: "50%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='fec_ave'
							header='Fecha'
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
								<div className='field col'>
									<label htmlFor='tit_ave'>Titulo:</label>
									<InputText
										id='tit_ave'
										value={formData.tit_ave}
										onChange={(e) =>
											onInputChange(e, "tit_ave")
										}
										required
										autoFocus
										className={classNames({
											"p-invalid":
												submitted && !formData.tit_ave,
										})}
									/>
									{submitted && !formData.tit_ave && (
										<small className='p-invalid'>
											Campo requerido.
										</small>
									)}
								</div>

								<div className='field col'>
									<label htmlFor='des_ave'>
										Descripcion:
									</label>
									<EditorHtml
										valorinicial={formData.des_ave}
										nombre='des_ave'
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='fec_ave'>Fecha:</label>
										<InputText
											id='fec_ave'
											value={formData.fec_ave}
											onChange={(e) =>
												onInputChange(e, "fec_ave")
											}
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='hor_ave'>Hora:</label>
										<InputText
											id='hor_ave'
											value={formData.hor_ave}
											onChange={(e) =>
												onInputChange(e, "hor_ave")
											}
										/>
									</div>
								</div>

								<div className='field col'>
									<label htmlFor='not_ave'>Nota:</label>
									<InputText
										id='not_ave'
										value={formData.not_ave}
										onChange={(e) =>
											onInputChange(e, "not_ave")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='pre_ave'>
										Prerequistos:
									</label>
									<InputText
										id='pre_ave'
										value={formData.pre_ave}
										onChange={(e) =>
											onInputChange(e, "pre_ave")
										}
									/>
								</div>
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='eva_cat'>
											Asitencia:
										</label>
										<Dropdown
											value={formData.eva_cat}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														eva_cat: e.value,
													})
												);
											}}
											options={dropdownasistencia}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
									<div className='field col-6'>
										<label htmlFor='ord_cac'>
											Menu Eventos:
										</label>
										<Dropdown
											value={formData.edi_cat}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														edi_cat: e.value,
													})
												);
											}}
											options={valueDropMenueventos}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>
								<div className='field col'>
									<label htmlFor='lug_ave'>Lugar:</label>
									<InputText
										id='lug_ave'
										value={formData.lug_ave}
										onChange={(e) =>
											onInputChange(e, "lug_ave")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='url_ave'>Link:</label>
									<InputText
										id='url_ave'
										value={formData.url_ave}
										onChange={(e) =>
											onInputChange(e, "url_ave")
										}
									/>
								</div>

								<div className='field col'>
									<ImagenCampo
										label='Imagen'
										formData={formData}
										CampoImagen='img_ave'
										nombreCampo='demo'
										edicampo={formData.img_ave}
										urlupload='/upload/images/site'
									/>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className='field col'>
									<label htmlFor='tit_ave_ing'>
										Titulo ingles:
									</label>
									<InputText
										id='tit_ave_ing'
										value={formData.tit_ave_ing}
										onChange={(e) =>
											onInputChange(e, "tit_ave_ing")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='des_ave_ing'>
										Descripcion ingles:
									</label>
									<EditorHtml
										valorinicial={formData.des_ave_ing}
										nombre='des_ave_ing'
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className='field col'>
									<label htmlFor='nor_ave_ing'>
										Nota ingles:
									</label>
									<InputText
										id='nor_ave_ing'
										value={formData.nor_ave_ing}
										onChange={(e) =>
											onInputChange(e, "nor_ave_ing")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='pre_ave_ing'>
										Prerequistos ingles:
									</label>
									<InputText
										id='pre_ave_ing'
										value={formData.pre_ave_ing}
										onChange={(e) =>
											onInputChange(e, "pre_ave_ing")
										}
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
