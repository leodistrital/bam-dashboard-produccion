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

export const Menueventos = () => {
	const TABLA = "menueventos";
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
	const [dropdownEventos, setdropdowndropdownEventos] = useState(null);
	const [valueDropdownEdiciones, setvalueDropdownEdiciones] = useState(null);
	const [
		dropdownplantillaSeleccionado,
		setdropdownplantillaSeleccionado,
	] = useState(null);

	let tituloiter = "Menu de Eventos";
	let { grupo } = useParams();

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
		datatable
			.gettable("parametros/agendaeventos")
			.then((menu) => setdropdowndropdownEventos(menu));
		datatable
			.gettable("parametros/ediciones")
			.then((ediciones) => setvalueDropdownEdiciones(ediciones));
		datatable
			.gettable("parametros/parametros/plantillaevento")
			.then((datos) => {
				setdropdownplantillaSeleccionado(datos);
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
		if (formData.tit_mne?.trim()) {
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
		_product[`${"tip_spe"}`] = grupo;

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
					<TablaDatos datostabla={dataSet} titulo={tituloiter}>
						<Column
							field='tit_mne'
							header='Nombre'
							sortable
							headerStyle={{
								width: "50%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='menupadre'
							header='Menu Superior'
							sortable
							headerStyle={{
								width: "30%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='edicion'
							header='Edicion'
							sortable
							headerStyle={{
								width: "10%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='ord_mne'
							header='Orden'
							sortable
							headerStyle={{
								width: "10%",
								minWidth: "10rem",
							}}></Column>

						<Column
							header='Acciones'
							body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header='Detalle Speaker'
						modal={true}
						className='p-fluid'
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}>
						<TabView>
							<TabPanel
								className='justify-content: flex-end;'
								headerTemplate={tabHeaderIIespanol}>
								<div className='field col'>
									<label htmlFor='tit_mne'>Nombre:</label>
									<InputText
										id='tit_mne'
										value={formData.tit_mne}
										onChange={(e) =>
											onInputChange(e, "tit_mne")
										}
										required
										autoFocus
										className={classNames({
											"p-invalid":
												submitted && !formData.nom_spe,
										})}
									/>
									{submitted && !formData.nom_spe && (
										<small className='p-invalid'>
											Campo requerido.
										</small>
									)}
								</div>

								<div className='field col'>
									<label htmlFor='des_mne'>
										Descripcion:
									</label>
									<EditorHtml
										valorinicial={formData.des_mne}
										nombre='des_mne'
										cambiohtml={cambiohtml}
									/>
								</div>

								{/* <div className='field col'>
									<ImagenCampo
										label='Foto'
										formData={formData}
										CampoImagen='img_spe'
										nombreCampo='demo'
										edicampo={formData.img_spe}
										urlupload='/upload/images/site'
									/>
								</div> */}

								<div className='formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='cod_edi_mne'>
											Edicion:
										</label>
										<Dropdown
											value={formData.cod_edi_mne}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														cod_edi_mne: e.value,
													})
												);
											}}
											options={valueDropdownEdiciones}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='cod_pad_mne'>
											Menu Superior:
										</label>
										<Dropdown
											value={formData.cod_pad_mne}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														cod_pad_mne: e.value,
													})
												);
											}}
											options={valueDropMenueventos}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>

								<div className='formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='ord_mne'>Orden:</label>
										<InputText
											id='ord_mne'
											value={formData.ord_mne}
											onChange={(e) =>
												onInputChange(e, "ord_mne")
											}
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='pla_mne'>
											Plantilla:
										</label>
										<Dropdown
											value={formData.pla_mne}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														pla_mne: e.value,
													})
												);
											}}
											options={
												dropdownplantillaSeleccionado
											}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className='field col'>
									<label htmlFor='tit_mne_ing'>Nombre:</label>
									<InputText
										id='tit_mne_ing'
										value={formData.tit_mne_ing}
										onChange={(e) =>
											onInputChange(e, "tit_mne_ing")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='des_mne_ing'>
										Descripcion:
									</label>
									<EditorHtml
										valorinicial={formData.des_mne_ing}
										nombre='des_mne_ing'
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
