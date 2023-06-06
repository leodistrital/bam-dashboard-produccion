import { useState, useEffect, useRef } from "react";

import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	InputText,
	Dropdown,
	TabView,
	TabPanel,
	tabHeaderIIespanol,
	tabHeaderIIingles,
	EditorHtml,
	InputTextarea,
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

export const Aliadosacreditaciones = () => {
	const TABLA = "aliadosacreditacion";
	let emptyFormData = {};
	const { dataSet, formData } = useSelector((state) => state.appsesion); //datos el storage redux
	const dispatch = useDispatch();
	const [productDialog, setProductDialog] = useState(false);
	const [deleteProductDialog, setDeleteProductDialog] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const toast = useRef(null);
	const [recargar, setrecargar] = useState(0);
	const [cargando, setCargando] = useState(false);
	const [valueDropMenueventos, setvalueDropMenueventos] = useState(null);
	const datatable = new Conexion();

	// const [valueDropdownEdiciones, setvalueDropdownEdiciones] = useState(null);
	// const [
	// 	dropdownplantillaSeleccionado,
	// 	setdropdownplantillaSeleccionado,
	// ] = useState(null);

	useEffect(() => {
		datatable
			.gettable("parametros/tarifasacreditacion")
			.then((menu) => setvalueDropMenueventos(menu));
	}, []);

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
		if (formData.nom_alc?.trim()) {
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
					<TablaDatos datostabla={dataSet} titulo='Aliados'>
						<Column
							field='nom_alc'
							header='Titulo'
							sortable
							headerStyle={{
								width: "80%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='nit_alc'
							header='NIT'
							sortable
							headerStyle={{
								width: "20%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='cup_alc'
							header='Cupos'
							sortable
							headerStyle={{
								width: "20%",
								minWidth: "10rem",
							}}></Column>

						<Column
							header='Acciones'
							body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header='Detalle Aliados'
						modal={true}
						className='p-fluid'
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}>
						<TabView>
							<TabPanel
								className='justify-content: flex-end;'
								headerTemplate={tabHeaderIIespanol}>
								<div className='formgrid grid col'>
									<div className='field col-6'>
										<label htmlFor='nom_alc'>Nombre:</label>
										<InputText
											id='nom_alc'
											value={formData.nom_alc}
											onChange={(e) =>
												onInputChange(e, "nom_alc")
											}
											required
											autoFocus
											className={classNames({
												"p-invalid":
													submitted &&
													!formData.nom_alc,
											})}
										/>
										{submitted && !formData.nom_alc && (
											<small className='p-invalid'>
												Campo requerido.
											</small>
										)}
									</div>
									<div className='field col-6'>
										<label htmlFor='onit_alcrd_par'>
											Nit:
										</label>
										<InputText
											id='nit_alc'
											value={formData.nit_alc}
											onChange={(e) =>
												onInputChange(e, "nit_alc")
											}
										/>
									</div>
								</div>

								<div className='formgrid grid col'>
									<div className='field col-6'>
										<label htmlFor='tar_alc'>
											Valor Asignado:
										</label>
										<Dropdown
											value={formData.tar_alc}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														tar_alc: e.value,
													})
												);
											}}
											options={valueDropMenueventos}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
									<div className='field col-6'>
										<label htmlFor='cup_alc'>Cupos:</label>
										<InputText
											id='cup_alc'
											value={formData.cup_alc}
											onChange={(e) =>
												onInputChange(e, "cup_alc")
											}
										/>
									</div>
								</div>
								<div className='formgrid grid col'>
									<div className='field col-2'>
										<label htmlFor='cup_alc'>Cupos:</label>

										<InputTextarea
											value={formData.listacodigos}
											rows={12}
											cols={5}
										/>
									</div>
								</div>
							</TabPanel>
						</TabView>

						{/* </div> */}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.tit_par}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
