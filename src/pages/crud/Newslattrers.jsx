import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	InputText,
	InputTextarea,
	Dropdown,
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

// leonardo

export const Newslattrers = () => {
	const TABLA = "prensa";
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
	const [dropdowntipoprensa, setdropdowntipoprensa] = useState(null);
	let tituloiter = "Newsletters";
	let { grupo } = useParams();
	if (grupo == 1) tituloiter = "Noticias";
	if (grupo == 3) tituloiter = "Recomendaciones";
	if (grupo == 2) tituloiter = "Destacados";
	// console.log({ grupo }, { tituloiter });

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
		datatable.gettable("parametros/parametros/tipoprensa").then((datos) => {
			setdropdowntipoprensa(datos);
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

	/*eventos*/

	/**operacion transacciones */
	const saveProduct = () => {
		setSubmitted(true);
		if (formData.tip_pre?.trim()) {
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
		_product[`${"tip_not"}`] = grupo; //solo para guardar noticias
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
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-warning mr-2"
					onClick={() => confirmDeleteProduct(rowData)}
				/>
			</div>
		);
	};

	return (
		<div className="grid">
			<div className="col-12">
				<div className="card">
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos datostabla={dataSet} titulo={tituloiter}>
						<Column
							field="tit_pre"
							header="Titulo"
							sortable
							headerStyle={{ width: "60%", minWidth: "10rem" }}
						></Column>
						<Column
							field="fec_pre"
							header="Fecha"
							sortable
							headerStyle={{ width: "30%", minWidth: "10rem" }}
						></Column>

						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header={"Detalle " + tituloiter}
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
								<div className="formgrid grid col">
									<div className="field col">
										{/* <pre>{JSON.stringify(formData,2)}</pre> */}
										<label htmlFor="tit_pre">Titulo español:</label>
										<InputText
											id="tit_pre"
											value={formData.tit_pre}
											onChange={(e) => onInputChange(e, "tit_pre")}
											required
											autoFocus
											className={classNames({
												"p-invalid": submitted && !formData.tit_pre,
											})}
										/>
										{submitted && !formData.tit_pre && (
											<small className="p-invalid">Campo requerido.</small>
										)}
									</div>
								</div>
								<div className="col formgrid grid">
									<div className="field col">
										<label htmlFor="sti_pre">Subtitulo:</label>
										<InputText
											id="sti_pre"
											value={formData.sti_pre}
											onChange={(e) => onInputChange(e, "sti_pre")}
										/>
									</div>
								</div>

								<div className="formgrid grid col">
									<div className="field col">
										<label htmlFor="des_pre">Descripcion:</label>
										<InputTextarea
											id="des_pre"
											value={formData.des_pre}
											onChange={(e) => onInputChange(e, "des_pre")}
											rows={6}
											cols={20}
										/>
									</div>
								</div>

								<div className="col formgrid grid">
									<div className="field col ">
										<label htmlFor="lin_pre">Link:</label>
										<InputText
											id="lin_pre"
											value={formData.lin_pre}
											onChange={(e) => onInputChange(e, "lin_pre")}
										/>
									</div>
								</div>

								<div className="formgrid grid col">
									<div className="field col">
										<label htmlFor="fec_pre">Fecha:</label>
										<InputText
											id="fec_pre"
											value={formData.fec_pre}
											onChange={(e) => onInputChange(e, "fec_pre")}
										/>
									</div>
									<div className="field col">
										<label htmlFor="tip_pre">Tipo:</label>
										<Dropdown
											value={formData.tip_pre}
											onChange={(e) => {
												dispatch(
													setFormData({ ...formData, tip_pre: e.value })
												);
											}}
											options={dropdowntipoprensa}
											optionLabel="name"
											placeholder="Seleccione"
										/>
									</div>
								</div>
							</TabPanel>
							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className="field col">
									<label htmlFor="tit_pre_ing">Titulo ingles:</label>
									<InputText
										id="tit_pre_ing"
										value={formData.tit_pre_ing}
										onChange={(e) => onInputChange(e, "tit_pre_ing")}
									/>
								</div>
								<div className="field col">
									<label htmlFor="sti_pre_ing">Subtitulo ingles:</label>
									<InputText
										id="sti_pre_ing"
										value={formData.sti_pre_ing}
										onChange={(e) => onInputChange(e, "sti_pre_ing")}
									/>
								</div>
								<div className="field col">
									<label htmlFor="des_pre_ing">Descripcion ingles:</label>
									<InputTextarea
										id="des_pre_ing"
										value={formData.des_pre_ing}
										onChange={(e) => onInputChange(e, "des_pre_ing")}
										required
										rows={6}
										cols={20}
									/>
								</div>
							</TabPanel>
						</TabView>
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.tit_pre}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
