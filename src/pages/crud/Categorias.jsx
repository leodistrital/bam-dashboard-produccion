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

export const Categorias = () => {
	const TABLA = "categorias";
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

	const [valueDropdownEdiciones, setvalueDropdownEdiciones] = useState(null);
	const [
		dropdownplantillaSeleccionado,
		setdropdownplantillaSeleccionado,
	] = useState(null);

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
			.gettable("parametros/ediciones")
			.then((ediciones) => setvalueDropdownEdiciones(ediciones));

		datatable
			.gettable("parametros/parametros/plantillaseleccion")
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
		if (formData.nom_cat?.trim()) {
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
					<TablaDatos datostabla={dataSet} titulo="Categorias">
						<Column
							field="nom_cat"
							header="Titulo"
							sortable
							headerStyle={{ width: "50%", minWidth: "10rem" }}
						></Column>
						<Column
							field="edicion"
							header="Año"
							sortable
							headerStyle={{ width: "20%", minWidth: "10rem" }}
						></Column>
						<Column
							field="ord_cat"
							header="Orden"
							sortable
							headerStyle={{ width: "20%", minWidth: "10rem" }}
						></Column>

						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header="Detalle Categoria"
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
								<div className="field col">
									<label htmlFor="nom_cat">Nombre:</label>
									<InputText
										id="nom_cat"
										value={formData.nom_cat}
										onChange={(e) => onInputChange(e, "nom_cat")}
										required
										autoFocus
										className={classNames({
											"p-invalid": submitted && !formData.nom_cat,
										})}
									/>
									{submitted && !formData.nom_cat && (
										<small className="p-invalid">Campo requerido.</small>
									)}
								</div>

								<div className="field col ">
									<label htmlFor="tit_cat">Titulo Español:</label>
									<InputText
										id="tit_cat"
										value={formData.tit_cat}
										onChange={(e) => onInputChange(e, "tit_cat")}
									/>
								</div>
								<div className="field col">
									<label htmlFor="des_cat">Descripcion español:</label>
									<EditorHtml
										valorinicial={formData.des_cat}
										nombre="des_cat"
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className="formgrid grid">
									<div className="field col-4">
										<label htmlFor="ord_cat">Orden:</label>
										<InputText
											id="ord_cat"
											value={formData.ord_cat}
											onChange={(e) => onInputChange(e, "ord_cat")}
										/>
									</div>
									<div className="field col-4">
										<label htmlFor="eva_cat">Tipo:</label>
										<Dropdown
											value={formData.eva_cat}
											onChange={(e) => {
												dispatch(
													setFormData({ ...formData, eva_cat: e.value })
												);
											}}
											options={dropdownplantillaSeleccionado}
											optionLabel="name"
											placeholder="Seleccione"
										/>
									</div>
									<div className="field col-4">
										<label htmlFor="ord_cac">Edicion:</label>
										<Dropdown
											value={formData.edi_cat}
											onChange={(e) => {
												dispatch(
													setFormData({ ...formData, edi_cat: e.value })
												);
											}}
											options={valueDropdownEdiciones}
											optionLabel="name"
											placeholder="Seleccione"
										/>
									</div>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIingles}>
								<div className="field col">
									<label htmlFor="tit_cat_ing">Titulo ingles:</label>
									<InputText
										id="tit_cat_ing"
										value={formData.tit_cat_ing}
										onChange={(e) => onInputChange(e, "tit_cat_ing")}
									/>
								</div>

								<div className="field col">
									<label htmlFor="des_cat_ing">Descripcion ingles:</label>
									<EditorHtml
										valorinicial={formData.des_cat_ing}
										nombre="des_cat_ing"
										cambiohtml={cambiohtml}
									/>
								</div>
							</TabPanel>
						</TabView>

						{/* </div> */}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.nom_cat}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
