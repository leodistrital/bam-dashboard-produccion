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

export const Banners = () => {
	const TABLA = "banners";
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

	let { grupo } = useParams();
	// console.log({grupo});

	useEffect(() => {
		//cargar la data total
		setCargando(true);
		dispatch(setFormData(emptyFormData));

		datatable.gettable(TABLA + "/grupo/" + grupo).then((data) => {
			dispatch(setDataSet(data));
			setCargando(false);
		});
	}, [recargar, grupo]);

	useEffect(() => {
		//solo para que se ejecute una vez al inicio
		/** setting parametros dropdowns u otros objetos independientes */
		// datatable.gettable("parametros/parametros/tipo_perfil").then((datos) => {
		// 	setdropdownTipoAliado(datos);
		// });
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
		if (formData.nom_ban?.trim()) {
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
		_product[`${"tip_ban"}`] = grupo; //solo para guardar banners
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
					<TablaDatos datostabla={dataSet} titulo='Banner'>
						<Column
							field='nom_ban'
							header='Nombre'
							sortable
							headerStyle={{
								width: "60%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='ord_ban'
							header='Orden'
							sortable
							headerStyle={{
								width: "30%",
								minWidth: "10rem",
							}}></Column>

						<Column
							header='Acciones'
							body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header='Detalle Banner'
						modal={true}
						className='p-fluid'
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}>
						<div className='field'>
							{/* <pre>{JSON.stringify(formData,2)}</pre> */}
							<label htmlFor='nom_ban'>Nombre:</label>
							<InputText
								id='nom_ban'
								value={formData.nom_ban}
								onChange={(e) => onInputChange(e, "nom_ban")}
								required
								autoFocus
								className={classNames({
									"p-invalid": submitted && !formData.nom_ban,
								})}
							/>
							{submitted && !formData.nom_ban && (
								<small className='p-invalid'>
									Campo requerido.
								</small>
							)}
						</div>

						{grupo == 2 && (
							<div className='formgrid grid'>
								<div className='field col'>
									<label htmlFor='txt_ban'>
										Texto español:
									</label>
									<InputTextarea
										id='txt_ban'
										value={formData.txt_ban}
										onChange={(e) =>
											onInputChange(e, "txt_ban")
										}
										rows={6}
										cols={20}
									/>
								</div>
								<div className='field col'>
									<label htmlFor='txt_ban_ing'>
										Texto ingles:
									</label>
									<InputTextarea
										id='txt_ban_ing'
										value={formData.txt_ban_ing}
										onChange={(e) =>
											onInputChange(e, "txt_ban_ing")
										}
										required
										rows={6}
										cols={20}
									/>
								</div>
							</div>
						)}

						<div className='formgrid grid col'>
							<div className='field col-6'>
								<label htmlFor='ord_ban'>Orden:</label>
								<InputText
									id='ord_ban'
									value={formData.ord_ban}
									onChange={(e) =>
										onInputChange(e, "ord_ban")
									}
								/>
							</div>
							<div className='field col hidden '>
								<label htmlFor='grupo'>grupo:</label>
								<InputText id='grupo' value={grupo} />
							</div>
						</div>

						{grupo == 1 && (
							<>
								<div className='field col'>
									<label htmlFor='lin_bam'>Link:</label>
									<InputText
										id='lin_bam'
										value={formData.lin_bam}
										onChange={(e) =>
											onInputChange(e, "lin_bam")
										}
									/>
									<div className='field col'>
										<ImagenCampo
											label='Imagen'
											formData={formData}
											CampoImagen='img_ban'
											nombreCampo='demo'
											edicampo={formData.img_ban}
											urlupload='/upload/images/banners'
										/>
									</div>
								</div>
							</>
						)}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.nom_ban}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
