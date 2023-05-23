import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	InputTextarea,
	Divider,
	Dialog,
	InputText,
	Dropdown,
	TabView,
	TabPanel,
	tabHeaderIIespanol,
	tabHeaderIIingles,
	tabHeaderIIPrograciones,
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
// import { EditorHtml } from "../../components/crud/EditorHtml";
import { ImagenCampo } from "../../components/crud/ImagenCampo";
import { AdjuntoCampo } from "../../components/crud/AdjuntoCampo";

export const Ediciones = () => {
	const TABLA = "ediciones";
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
	const [dropdownGalerias, setdropdownGalerias] = useState(null);

	useEffect(() => {
		//cargar la data total
		setCargando(true);
		dispatch(setFormData(emptyFormData));
		datatable.gettable(TABLA).then((data) => {
			// console.log(data, 'en aliadops')
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
	/*eventos*/

	/**operacion transacciones */
	const saveProduct = () => {
		setSubmitted(true);
		if (formData.ano_edi?.trim()) {
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

	const cambiohtml = (x, name) => {
		let _product = { ...formData };
		_product[`${name}`] = x;
		dispatch(setFormData(_product));
	};

	return (
		<div className='grid'>
			<div className='col-12'>
				<div className='card'>
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos datostabla={dataSet} titulo='Ediciones'>
						<Column
							field='ano_edi'
							header='Año'
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
						header='Detalle Edicion'
						modal={true}
						className='p-fluid'
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}>
						<TabView>
							<TabPanel
								className='justify-content: flex-end;'
								headerTemplate={tabHeaderIIespanol}>
								<div className='field'>
									<label htmlFor='ano_edi'>Año:</label>
									<InputText
										id='ano_edi'
										value={formData.ano_edi}
										onChange={(e) =>
											onInputChange(e, "ano_edi")
										}
										required
										autoFocus
										className={classNames({
											"p-invalid":
												submitted && !formData.ano_edi,
										})}
									/>
									{submitted && !formData.nom_ali && (
										<small className='p-invalid'>
											Campo requerido.
										</small>
									)}
								</div>
								<div className='field'>
									<label htmlFor='tit_edi'>Titulo:</label>
									<InputText
										id='tit_edi'
										value={formData.tit_edi}
										onChange={(e) =>
											onInputChange(e, "tit_edi")
										}
										required
										autoFocus
									/>
								</div>
								<div className='field'>
									<label htmlFor='sti_edi'>Subtitulo:</label>
									<InputText
										id='sti_edi'
										value={formData.sti_edi}
										onChange={(e) =>
											onInputChange(e, "sti_edi")
										}
										required
										autoFocus
									/>
								</div>

								<div className='field'>
									<label htmlFor='des_edi'>
										Descripción:
									</label>
									<EditorHtml
										valorinicial={formData.des_edi}
										nombre='des_edi'
										cambiohtml={cambiohtml}
									/>
									{/* <p>{JSON.stringify(formData.des_edi)}</p> */}
								</div>
								<div className='field col'>
									<label htmlFor='gal_edi'>
										Galeria de fotos
									</label>
									<Dropdown
										value={formData.gal_edi}
										onChange={(e) => {
											dispatch(
												setFormData({
													...formData,
													gal_edi: e.value,
												})
											);
										}}
										options={dropdownGalerias}
										optionLabel='name'
										placeholder='Seleccione'
									/>
								</div>

								<div className='field'>
									<ImagenCampo
										label='Imagen'
										formData={formData}
										CampoImagen='img_edi'
										nombreCampo='demo'
										edicampo={formData.img_edi}
										urlupload='/upload/images/site'
									/>
								</div>
							</TabPanel>
							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className='field'>
									<label htmlFor='tit_edi_ing'>
										Titulo ingles:
									</label>
									<InputText
										id='tit_edi_ing'
										value={formData.tit_edi_ing}
										onChange={(e) =>
											onInputChange(e, "tit_edi_ing")
										}
										required
										autoFocus
									/>
								</div>
								<div className='field'>
									<label htmlFor='sti_edi_ing'>
										Subtitulo:
									</label>
									<InputText
										id='sti_edi_ing'
										value={formData.sti_edi_ing}
										onChange={(e) =>
											onInputChange(e, "sti_edi_ing")
										}
										required
										autoFocus
									/>
								</div>

								<div className='field'>
									<label htmlFor='des_edi_ing'>
										Descripción ingles:
									</label>
									<EditorHtml
										valorinicial={formData.des_edi_ing}
										nombre='des_edi_ing'
										cambiohtml={cambiohtml}
									/>
									{/* <InputTextarea
										id="des_edi_ing"
										value={formData.des_edi_ing}
										onChange={(e) => onInputChange(e, "des_edi_ing")}
										required
										rows={6}
										cols={20}
									/> */}
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIPrograciones}>
								<div className='formgrid grid'>
									<div className='field col-6'>
										<AdjuntoCampo
											label='Programacion Adjunto 1'
											formData={formData}
											CampoImagen='ad1_edi'
											nombreCampo='demo'
											edicampo={formData.ad1_edi}
											urlupload='/upload/docs'
										/>
									</div>

									<div className='field col-6'>
										<ImagenCampo
											label='Imagen'
											formData={formData}
											CampoImagen='im1_edi'
											nombreCampo='demo'
											edicampo={formData.im1_edi}
											urlupload='/upload/images/site'
										/>
									</div>
								</div>
								<Divider />

								<div className='formgrid grid'>
									<div className='field col-6'>
										<AdjuntoCampo
											label='Programacion Adjunto 2'
											formData={formData}
											CampoImagen='ad2_edi'
											nombreCampo='demo'
											edicampo={formData.ad2_edi}
											urlupload='/upload/docs'
										/>
									</div>

									<div className='field col-6'>
										<ImagenCampo
											label='Imagen'
											formData={formData}
											CampoImagen='im2_edi'
											nombreCampo='demo'
											edicampo={formData.im2_edi}
											urlupload='/upload/images/site'
										/>
									</div>
								</div>
								<Divider />

								<div className='formgrid grid'>
									<div className='field col-6'>
										<AdjuntoCampo
											label='Programacion Adjunto 3'
											formData={formData}
											CampoImagen='ad3_edi'
											nombreCampo='demo'
											edicampo={formData.ad3_edi}
											urlupload='/upload/docs'
										/>
									</div>

									<div className='field col-6'>
										<ImagenCampo
											label='Imagen'
											formData={formData}
											CampoImagen='im3_edi'
											nombreCampo='demo'
											edicampo={formData.im3_edi}
											urlupload='/upload/images/site'
										/>
									</div>
								</div>
								<Divider />

								<div className='formgrid grid'>
									<div className='field col-6'>
										<AdjuntoCampo
											label='Programacion Adjunto 4'
											formData={formData}
											CampoImagen='ad4_edi'
											nombreCampo='demo'
											edicampo={formData.ad4_edi}
											urlupload='/upload/docs'
										/>
									</div>

									<div className='field col-6'>
										<ImagenCampo
											label='Imagen'
											formData={formData}
											CampoImagen='im4_edi'
											nombreCampo='demo'
											edicampo={formData.im4_edi}
											urlupload='/upload/images/site'
										/>
									</div>
								</div>
								<Divider />
								<div className='formgrid grid'>
									<div className='field col-6'>
										<AdjuntoCampo
											label='Programacion Adjunto 5'
											formData={formData}
											CampoImagen='ad5_edi'
											nombreCampo='demo'
											edicampo={formData.pro_edi}
											urlupload='/upload/docs'
										/>
									</div>

									<div className='field col-6'>
										<ImagenCampo
											label='Imagen'
											formData={formData}
											CampoImagen='im5_edi'
											nombreCampo='demo'
											edicampo={formData.im5_edi}
											urlupload='/upload/images/site'
										/>
									</div>
								</div>
							</TabPanel>
						</TabView>
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.nom_ali}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
