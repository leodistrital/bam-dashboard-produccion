import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	InputText,
	InputTextarea,
	Calendar,
	addLocale,
	locale,
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
import { AdjuntoCampo } from "../../components/crud/AdjuntoCampo";

export const Sitio = () => {
	const TABLA = "sitio";
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
	const [dropdownEdiciones, setdropdownEdiciones] = useState(null);

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
		datatable.gettable("parametros/parametros/si_no").then((datos) => {
			setdropdownTipoAliado(datos);
		});
		datatable.gettable("parametros/ediciones").then((datos) => {
			setdropdownEdiciones(datos);
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
		if (formData.dir_sit?.trim()) {
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
	// const deleteProduct = () =>
	// 	datatable
	// 		.getEliminarItem(TABLA, formData, formData.id)
	// 		.then((data) => trasaccionExitosa("borrar"));
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
				className='actions'
				style={{
					display: "flex",
				}}>
				<Button
					icon='pi pi-pencil'
					className='p-button-rounded p-button-success mr-2'
					onClick={() => editProduct(rowData.id)}
				/>
				{/* <Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-warning mr-2"
					onClick={() => confirmDeleteProduct(rowData)}
				/> */}
			</div>
		);
	};

	return (
		<div className='grid'>
			<div className='col-12'>
				<div className='card'>
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					{/* <BarraSuperior openNew={openNew} /> */}
					<TablaDatos datostabla={dataSet} titulo='Sitio'>
						<Column
							field='nom_sit'
							header='Nombre'
							sortable
							headerStyle={{
								width: "90%",
								minWidth: "10rem",
							}}></Column>

						<Column
							header='Acciones'
							body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header='Detalle Sitio'
						modal={true}
						className='p-fluid'
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}>
						<div className='field'>
							{/* <pre>{JSON.stringify(formData, 2)}</pre> */}
							<label htmlFor='dir_sit'>Dirección:</label>
							<InputText
								id='dir_sit'
								value={formData.dir_sit}
								onChange={(e) => onInputChange(e, "dir_sit")}
								required
								autoFocus
								className={classNames({
									"p-invalid": submitted && !formData.dir_sit,
								})}
							/>
							{submitted && !formData.dir_sit && (
								<small className='p-invalid'>
									Campo requerido.
								</small>
							)}
						</div>

						<div className='formgrid grid'>
							<div className='field col'>
								<label htmlFor='mai_sit'>Correo:</label>
								<InputText
									id='mai_sit'
									value={formData.mai_sit}
									onChange={(e) =>
										onInputChange(e, "mai_sit")
									}
								/>
							</div>
							<div className='field col'>
								<label htmlFor='tel_sit'>Telefonos:</label>
								<InputText
									id='tel_sit'
									value={formData.tel_sit}
									onChange={(e) =>
										onInputChange(e, "tel_sit")
									}
								/>
							</div>
						</div>
						<div className='formgrid grid'>
							<div className='field col'>
								<label htmlFor='fac_sit'>Facebook:</label>
								<InputText
									id='fac_sit'
									value={formData.fac_sit}
									onChange={(e) =>
										onInputChange(e, "fac_sit")
									}
								/>
							</div>
							<div className='field col'>
								<label htmlFor='twt_sit'>Twitter:</label>
								<InputText
									id='twt_sit'
									value={formData.twt_sit}
									onChange={(e) =>
										onInputChange(e, "twt_sit")
									}
								/>
							</div>
						</div>
						<div className='formgrid grid'>
							<div className='field col'>
								<label htmlFor='ins_sit'>Instagram:</label>
								<InputText
									id='ins_sit'
									value={formData.ins_sit}
									onChange={(e) =>
										onInputChange(e, "ins_sit")
									}
								/>
							</div>
							<div className='field col'>
								<label htmlFor='you_sit'>Youtube:</label>
								<InputText
									id='you_sit'
									value={formData.you_sit}
									onChange={(e) =>
										onInputChange(e, "you_sit")
									}
								/>
							</div>
						</div>

						<div className='formgrid grid'>
							<div className='field col'>
								<label htmlFor='con_sit'>
									Activar Convocatorias
								</label>
								<Dropdown
									value={formData.con_sit}
									onChange={(e) => {
										dispatch(
											setFormData({
												...formData,
												con_sit: e.value,
											})
										);
									}}
									options={dropdownTipoAliado}
									optionLabel='name'
									placeholder='Seleccione'
								/>
							</div>
							<div className='field col'>
								<label htmlFor='sel_sit'>
									Activar Seleccionados
								</label>
								<Dropdown
									value={formData.sel_sit}
									onChange={(e) => {
										dispatch(
											setFormData({
												...formData,
												sel_sit: e.value,
											})
										);
									}}
									options={dropdownTipoAliado}
									optionLabel='name'
									placeholder='Seleccione'
								/>
							</div>
						</div>
						<div className='formgrid grid'>
							<div className='field col'>
								<label htmlFor='reg_sit'>
									Activar Regiones
								</label>
								<Dropdown
									value={formData.reg_sit}
									onChange={(e) => {
										dispatch(
											setFormData({
												...formData,
												reg_sit: e.value,
											})
										);
									}}
									options={dropdownTipoAliado}
									optionLabel='name'
									placeholder='Seleccione'
								/>
							</div>
							<div className='field col'>
								<label htmlFor='his_reg'>
									Activar Hisrotico
								</label>
								<Dropdown
									value={formData.his_reg}
									onChange={(e) => {
										dispatch(
											setFormData({
												...formData,
												his_reg: e.value,
											})
										);
									}}
									options={dropdownTipoAliado}
									optionLabel='name'
									placeholder='Seleccione'
								/>
							</div>
						</div>
						<div className='formgrid grid'>
							<div className='field col'>
								<label htmlFor='pro_sit'>
									Activar Programacion
								</label>
								<Dropdown
									value={formData.pro_sit}
									onChange={(e) => {
										dispatch(
											setFormData({
												...formData,
												pro_sit: e.value,
											})
										);
									}}
									options={dropdownTipoAliado}
									optionLabel='name'
									placeholder='Seleccione'
								/>
							</div>
							<div className='field col'>
								<label htmlFor='edi_sit'>Edicion Activa</label>
								<Dropdown
									value={formData.edi_sit}
									onChange={(e) => {
										dispatch(
											setFormData({
												...formData,
												edi_sit: e.value,
											})
										);
									}}
									options={dropdownEdiciones}
									optionLabel='name'
									placeholder='Seleccione'
								/>
							</div>
						</div>
						<div className='formgrid grid'>
							<div className='field col-6'>
								<label htmlFor='acr_sit'>
									Activar Acreditaciones
								</label>
								<Dropdown
									value={formData.acr_sit}
									onChange={(e) => {
										dispatch(
											setFormData({
												...formData,
												acr_sit: e.value,
											})
										);
									}}
									options={dropdownTipoAliado}
									optionLabel='name'
									placeholder='Seleccione'
								/>
							</div>
							<div className='field col-6'>
								<label htmlFor=' ley_sit '>
									Leyenda Superior:
								</label>
								<InputText
									id=' ley_sit '
									value={formData.ley_sit}
									onChange={(e) =>
										onInputChange(e, "ley_sit")
									}
								/>
							</div>
						</div>
						<div className='field'>
							<label htmlFor='key_sit'>Plalabras claves:</label>
							<InputTextarea
								id='key_sit'
								value={formData.key_sit}
								onChange={(e) => onInputChange(e, "key_sit")}
								required
								rows={6}
								cols={20}
							/>
						</div>
						<div className='field'>
							<label htmlFor='ana_sit'>Analitycs:</label>
							<InputTextarea
								id='ana_sit'
								value={formData.ana_sit}
								onChange={(e) => onInputChange(e, "ana_sit")}
								required
								rows={6}
								cols={20}
							/>
						</div>
					</Dialog>
					{/* <EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.nom_doc_esp}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/> */}
				</div>
			</div>
		</div>
	);
};
