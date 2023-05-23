import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	InputText,
	
} from "../../components/crud";
import { Conexion } from "../../service/Conexion";
import {
	TablaDatos,
	BarraSuperior,
	EliminarVentana,
	productDialogFooter
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { setDataSet, setFormData } from "../../store/appSlice";
import { Cargando } from "../../components/crud/Cargando";
import { AdjuntoCampo } from "../../components/crud/AdjuntoCampo";

export const MenuPrincipal = () => {
	const TABLA = "menuprincipal";
	let emptyFormData = {};
	const { dataSet, formData } = useSelector(state => state.appsesion); //datos el storage redux
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
		datatable.gettable(TABLA).then(data => {
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

	const editProduct = id => {
		setCargando(true);
		datatable
			.getItem(TABLA, id)
			.then(data => dispatch(setFormData({ ...data.data })));
		setProductDialog(true);
		setCargando(false);
	};

	const confirmDeleteProduct = fila => {
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
			life: 4000
		});
	};

	/*eventos*/

	/**operacion transacciones */
	const saveProduct = () => {
		setSubmitted(true);
		if (formData.nom_mep?.trim()) {
			setCargando(true);
			if (formData.id == null) {
				//nuevo registro
				datatable
					.getCrearItem(TABLA, formData)
					.then(data => trasaccionExitosa());
			} else {
				//editar registro
				datatable
					.getEditarItem(TABLA, formData, formData.id)
					.then(data => trasaccionExitosa());
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

	const actionBodyTemplate = rowData => {
		return (
			<div
				className="actions"
				style={{
					display: "flex"
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
					<TablaDatos datostabla={dataSet} titulo="Menu Principal">
						<Column
							field="nom_mep"
							header="Nombre"
							sortable
							headerStyle={{ width: "90%", minWidth: "10rem" }}
						></Column>

						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header="Detalle Menu"
						modal={true}
						className="p-fluid"
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}
					>
						
						
						<div className="formgrid grid">
						<div className="field col">
							<label htmlFor="nom_mep">Nombre español:</label>
							<InputText
								id="nom_mep"
								value={formData.nom_mep}
								onChange={e => onInputChange(e, "nom_mep")}
							/>
						</div>
						<div className="field col" >
							<label htmlFor="tel_sit">Nombre ingles:</label>
							<InputText
								id="nom_mep_ing"
								value={formData.nom_mep_ing}
								onChange={e => onInputChange(e, "nom_mep_ing")}
							/>
						</div>
						</div>
						<div className="formgrid grid">
							<div className="field col-6">
								<label htmlFor="ord_mep">Orden:</label>
								<InputText
									id="ord_mep"
									value={formData.ord_mep}
									onChange={e => onInputChange(e, "ord_mep")}
								/>
							</div>
							
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
