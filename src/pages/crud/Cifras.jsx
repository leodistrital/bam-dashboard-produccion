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

export const Cifras = () => {
	const TABLA = "cifras";
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
		datatable.gettable("parametros/parametros/cifraplantilla").then((datos) => {
			setdropdownTipoAliado(datos);
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
		if (formData.tit_cif?.trim()) {
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
					<TablaDatos datostabla={dataSet} titulo="Cifras">
						<Column
							field="tit_cif"
							header="Titulo"
							sortable
							headerStyle={{ width: "60%", minWidth: "10rem" }}
						></Column>
						<Column
							field="ord_cif"
							header="Orden"
							sortable
							headerStyle={{ width: "30%", minWidth: "10rem" }}
						></Column>

						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header="Detalle"
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
										<label htmlFor="tit_cif">Titulo español:</label>
										<InputText
											id="tit_cif"
											value={formData.tit_cif}
											onChange={(e) => onInputChange(e, "tit_cif")}
											required
											autoFocus
											className={classNames({
												"p-invalid": submitted && !formData.tit_cif,
											})}
										/>
										{submitted && !formData.tit_cif && (
											<small className="p-invalid">Campo requerido.</small>
										)}
									</div>
								</div>

								<div className="formgrid grid">
									<div className="field col-6">
										<label htmlFor="dat_cif">Dato:</label>
										<InputText
											id="dat_cif"
											value={formData.dat_cif}
											onChange={(e) => onInputChange(e, "dat_cif")}
										/>
									</div>
									<div className="field col-6">
										<label htmlFor="ord_cif">Orden:</label>
										<InputText
											id="ord_cif"
											value={formData.ord_cif}
											onChange={(e) => onInputChange(e, "ord_cif")}
										/>
									</div>
								</div>
								<div className="formgrid grid">
									<div className="field col-6">
										<label htmlFor="tip_cif">Plantilla</label>
										<Dropdown
											value={formData.tip_cif}
											onChange={(e) => {
												dispatch(
													setFormData({ ...formData, tip_cif: e.value })
												);
											}}
											options={dropdownTipoAliado}
											optionLabel="name"
											placeholder="Seleccione"
										/>
									</div>
								</div>
							</TabPanel>
							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className="field col">
									<label htmlFor="tit_cif_ing">Titulo ingles:</label>
									<InputText
										id="tit_cif_ing"
										value={formData.tit_cif_ing}
										onChange={(e) => onInputChange(e, "tit_cif_ing")}
									/>
								</div>
							</TabPanel>
						</TabView>
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.tit_cif}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
