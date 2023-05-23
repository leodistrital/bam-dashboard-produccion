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

export const Contenidos = () => {
	const TABLA = "contenidos";
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
		if (formData.tit_con_esp?.trim()) {
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
					<TablaDatos datostabla={dataSet} titulo='Secciones'>
						<Column
							field='tit_con_esp'
							header='Titulo'
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
						header='Detalle'
						modal={true}
						className='p-fluid'
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}>
						<TabView>
							<TabPanel
								className='justify-content: flex-end;'
								headerTemplate={tabHeaderIIespanol}>
								{/* <div className="formgrid grid"> */}
								<div className='field col'>
									{/* <pre>{JSON.stringify(formData,2)}</pre> */}
									<label htmlFor='tit_con_esp'>
										Titulo español:
									</label>
									<InputText
										id='tit_con_esp'
										value={formData.tit_con_esp}
										onChange={(e) =>
											onInputChange(e, "tit_con_esp")
										}
										required
										autoFocus
										className={classNames({
											"p-invalid":
												submitted &&
												!formData.tit_con_esp,
										})}
									/>
									{submitted && !formData.tit_con_esp && (
										<small className='p-invalid'>
											Campo requerido.
										</small>
									)}
								</div>
								<div className='field col'>
									<label htmlFor='des_con_esp'>
										Descripcion español:
									</label>
									<EditorHtml
										valorinicial={formData.des_con_esp}
										nombre='des_con_esp'
										cambiohtml={cambiohtml}
									/>
									{/* <InputTextarea
										id="des_con_esp"
										value={formData.des_con_esp}
										onChange={(e) => onInputChange(e, "des_con_esp")}
										rows={6}
										cols={20}
									/> */}
								</div>
								<div className='field col'>
									<ImagenCampo
										label='Imagen'
										formData={formData}
										CampoImagen='img_con'
										nombreCampo='demo'
										edicampo={formData.img_con}
										urlupload='/upload/images/site'
									/>
								</div>
								<div className='field col'>
									<ImagenCampo
										label='Logos'
										formData={formData}
										CampoImagen='img2_con_esp'
										nombreCampo='demo'
										edicampo={formData.img2_con_esp}
										urlupload='/upload/images/site'
									/>
								</div>
								<div className='field col'>
									<label htmlFor='gal_edi'>
										Galeria de fotos
									</label>
									<Dropdown
										value={formData.cod_gal_con}
										onChange={(e) => {
											dispatch(
												setFormData({
													...formData,
													cod_gal_con: e.value,
												})
											);
										}}
										options={dropdownGalerias}
										optionLabel='name'
										placeholder='Seleccione'
									/>
								</div>
							</TabPanel>

							{/* </div> */}

							{/* <div className="formgrid grid"> */}
							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className='field col'>
									<label htmlFor='tit_con_ing'>
										Titulo ingles:
									</label>
									<InputText
										id='tit_con_ing'
										value={formData.tit_con_ing}
										onChange={(e) =>
											onInputChange(e, "tit_con_ing")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='des_con_ing'>
										Descripcion ingles:
									</label>
									<EditorHtml
										valorinicial={formData.des_con_ing}
										nombre='des_con_ing'
										cambiohtml={cambiohtml}
									/>
								</div>
							</TabPanel>
						</TabView>

						{/* </div> */}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.tit_not}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
