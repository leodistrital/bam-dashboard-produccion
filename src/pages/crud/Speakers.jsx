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

export const Speakers = () => {
	const TABLA = "speakerseventos";
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
	let tituloiter = "Noticias";
	let { grupo } = useParams();
	if (grupo == 0) tituloiter = "Spakers Eventos";
	if (grupo == 1) tituloiter = "Spakers Region";

	// console.log({grupo});

	useEffect(() => {
		//cargar la data total
		setCargando(true);
		dispatch(setFormData(emptyFormData));

		datatable.gettable(TABLA + "/grupo/" + grupo).then((data) => {
			dispatch(setDataSet(data));
			setCargando(false);
		});
	}, [recargar]);

	useEffect(() => {
		datatable
			.gettable("parametros/agendaeventos")
			.then((menu) => setdropdowndropdownEventos(menu));
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
		if (formData.nom_spe?.trim()) {
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
							field='nom_spe'
							header='Nombre'
							sortable
							headerStyle={{
								width: "30%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='tit_ave'
							header='Evento'
							sortable
							headerStyle={{
								width: "60%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='ord_spe'
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
						header='Detalle Seleccionado'
						modal={true}
						className='p-fluid'
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}>
						<TabView>
							<TabPanel
								className='justify-content: flex-end;'
								headerTemplate={tabHeaderIIespanol}>
								<div className='field col'>
									<label htmlFor='tit_ave'>Nombre:</label>
									<InputText
										id='nom_spe'
										value={formData.nom_spe}
										onChange={(e) =>
											onInputChange(e, "nom_spe")
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
									<label htmlFor='per_spe'>Perfil:</label>
									<EditorHtml
										valorinicial={formData.per_spe}
										nombre='per_spe'
										cambiohtml={cambiohtml}
									/>
								</div>

								<div className='field col'>
									<ImagenCampo
										label='Foto'
										formData={formData}
										CampoImagen='img_spe'
										nombreCampo='demo'
										edicampo={formData.img_spe}
										urlupload='/upload/images/site'
									/>
								</div>
								<div className='field col'>
									<label htmlFor='gal_edi'>Evento:</label>
									<Dropdown
										value={formData.cod_ave_spe}
										onChange={(e) => {
											dispatch(
												setFormData({
													...formData,
													cod_ave_spe: e.value,
												})
											);
										}}
										options={dropdownEventos}
										optionLabel='name'
										placeholder='Seleccione'
									/>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className='field col'>
									<label htmlFor='per_spe_ing'>
										Perfil ingles:
									</label>
									<EditorHtml
										valorinicial={formData.per_spe_ing}
										nombre='per_spe_ing'
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
