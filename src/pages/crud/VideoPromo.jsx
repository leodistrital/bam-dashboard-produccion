import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	InputText,
	TabView,
	TabPanel,
	tabHeaderIIespanol,
	tabHeaderIIingles,
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

export const VideoPromo = () => {
	const TABLA = "videohome";
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
	let tituloiter = "Noticias";
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
		if (formData.tit_vid?.trim()) {
			console.log(formData);
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
				className="actions"
				style={{
					display: "flex",
				}}
			>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-success mr-2"
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
		<div className="grid">
			<div className="col-12">
				<div className="card">
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					{/* <BarraSuperior openNew={openNew} /> */}
					<TablaDatos datostabla={dataSet} titulo="Video Promocional">
						<Column
							field="tit_vid"
							header="Titulo"
							sortable
							headerStyle={{ width: "90%", minWidth: "10rem" }}
						></Column>

						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header="Detalle Video"
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
								<div className="formgrid grid">
									<div className="field col">
										{/* <pre>{JSON.stringify(formData,2)}</pre> */}
										<label htmlFor="tit_vid">Titulo español:</label>
										<InputText
											id="tit_vid"
											value={formData.tit_vid}
											onChange={(e) => onInputChange(e, "tit_vid")}
											required
											autoFocus
											className={classNames({
												"p-invalid": submitted && !formData.tit_vid,
											})}
										/>
										{submitted && !formData.tit_not && (
											<small className="p-invalid">Campo requerido.</small>
										)}
									</div>
								</div>

								<div className="formgrid grid">
									<div className="field col">
										<label htmlFor="sti_vid">Subtitulo español:</label>
										<InputText
											id="sti_vid"
											value={formData.sti_vid}
											onChange={(e) => onInputChange(e, "sti_vid")}
										/>
									</div>
								</div>

								<div className="formgrid grid">
									<div className="field col">
										<label htmlFor="ent_not">Entradilla español:</label>
										<InputText
											id="ent_not"
											value={formData.ent_not}
											onChange={(e) => onInputChange(e, "ent_not")}
										/>
									</div>
								</div>

								<div className="formgrid grid">
									<div className="field col-6">
										<label htmlFor="you_vid">Youtube:</label>
										<InputText
											id="you_vid"
											value={formData.you_vid}
											onChange={(e) => onInputChange(e, "you_vid")}
										/>
									</div>
								</div>

								<div className="formgrid grid">
									<div className="field col hidden ">
										<label htmlFor="grupo">grupo:</label>
										<InputText id="grupo" value={grupo} />
									</div>
								</div>

								<div className="field">
									<ImagenCampo
										label="Imagen"
										formData={formData}
										CampoImagen="img_vid"
										nombreCampo="demo"
										edicampo={formData.img_vid}
										urlupload="/upload/images/site"
									/>
								</div>
							</TabPanel>
							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className="field col">
									<label htmlFor="tit_vid_ing">Titulo ingles:</label>
									<InputText
										id="tit_vid_ing"
										value={formData.tit_vid_ing}
										onChange={(e) => onInputChange(e, "tit_vid_ing")}
									/>
								</div>
								<div className="field col">
									<label htmlFor="sti_vid_ing">Subtitulo ingles:</label>
									<InputText
										id="sti_vid_ing"
										value={formData.sti_vid_ing}
										onChange={(e) => onInputChange(e, "sti_vid_ing")}
									/>
								</div>
								<div className="field col">
									<label htmlFor="ent_not_ing">Entradilla ingles:</label>
									<InputText
										id="ent_not_ing"
										value={formData.ent_not_ing}
										onChange={(e) => onInputChange(e, "ent_not_ing")}
									/>
								</div>
							</TabPanel>
						</TabView>
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
