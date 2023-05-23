import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	InputTextarea,
	InputNumber,
	Dialog,
	InputText,
	Dropdown,
} from "../../components/crud";
import { Conexion } from "../../service/Conexion";
import { TablaDatos } from "../../components/crud/tabla/TablaDatos";
import { BarraSuperior } from "../../components/crud/tabla/BarraSuperior";
import { EliminarVentana } from "../../components/crud/EliminarVentana";

import {
	codeBodyTemplate,
	productDialogFooter,
	findIndexById,
} from "../../components/crud/tabla/Funciones";

export const Items = () => {
	let emptyProduct = {
		id: null,
		codigo: "",
		nombre: "",
		descripcion: "",
		unidad: "",
		factor: 1,
		proveedor: "",
	};
	const TABLA = "item";
	const titulo = "Materiales";

	const [productDialog, setProductDialog] = useState(false);
	const [deleteProductDialog, setDeleteProductDialog] = useState(false);
	const [product, setProduct] = useState(emptyProduct);
	const [submitted, setSubmitted] = useState(false);
	const toast = useRef(null);

	const [datostabla, setdatostabla] = useState(null);
	const [dropdownValues, setdropdownValues] = useState(null);
	const datatable = new Conexion();

	useEffect(() => {
		datatable.gettable(TABLA).then((data) => setdatostabla(data));
		datatable.gettable("parametros/unidades").then((unidades) => {
			setdropdownValues(unidades);
		});
	}, [productDialog]);

	const openNew = () => {
		setProduct(emptyProduct);
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

	const saveProduct = () => {
		setSubmitted(true);
		let resultado = "";
		let _products = [...datostabla];
		let _product = { ...product };
		console.log(_product);
		// return false;
		if (product.descripcion.trim()) {
			if (product.id == null) {
				resultado = datatable.getCrearItem(TABLA, product);
				_products = [...datostabla];
				_product = { ...product };
				_products.push(_product);
				setdatostabla(_products);
			} else {
				resultado = datatable.getEditarItem(TABLA, product, product.id);
				const index = findIndexById(product.id, datostabla);
				_products[index] = _product;
			}
			resultado.then((value) => {
				toast.current.show({
					severity: "success",
					summary: "Confirmacion",
					detail: "Transacción Exitosa",
					life: 4000,
				});
				setProductDialog(false);
				setProduct(emptyProduct);
			});
		}
	};

	const editProduct = (product, id) => {
		// console.log(product, id, 'edit-pro');
		setProduct({ ...product });
		datatable.getItem(TABLA, id).then((data) => setProduct(data.data));
		// console.log(product, 'consulta');
		setProductDialog(true);
	};

	const confirmDeleteProduct = (product) => {
		setProduct(product);
		setDeleteProductDialog(true);
	};

	const deleteProduct = () => {
		let _products = datostabla.filter((val) => val.id !== product.id);
		setdatostabla(_products);
		let resultado = datatable.getEliminarItem(TABLA, product, product.id);
		resultado.then((value) => {
			setDeleteProductDialog(false);
			setProduct(emptyProduct);
			toast.current.show({
				severity: "success",
				summary: "Confirmacion",
				detail: "Transacción Exitosa",
				life: 4000,
			});
		});
	};

	const onInputChange = (e, name) => {
		const val = (e.target && e.target.value) || "";
		let _product = { ...product };
		_product[`${name}`] = val;

		setProduct(_product);
	};

	const onInputNumberChange = (e, name) => {
		const val = e.value || 0;
		let _product = { ...product };
		_product[`${name}`] = val;

		setProduct(_product);
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
					onClick={() => editProduct(rowData, rowData.id)}
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
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos datostabla={datostabla} titulo={titulo}>
						{/* <Column field="id" header="ID" sortable body={codeBodyTemplate} headerStyle={{ width: "10%", minWidth: "10rem" }}></Column> */}
						<Column
							field="serial"
							header="Codigo"
							sortable
							headerStyle={{ width: "20%", minWidth: "10rem" }}
						></Column>

						<Column
							field="descripcion"
							header="Descripcion"
							sortable
							headerStyle={{ width: "50%", minWidth: "8rem" }}
						></Column>
						<Column
							field="nomunidad"
							header="Unidad"
							sortable
							headerStyle={{ width: "15%", minWidth: "10rem" }}
						></Column>

						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "80%" }}
						header="Detalle  del Item"
						modal
						className="p-fluid"
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}
					>
						<div className="field">
							<label htmlFor="name">Código</label>
							<InputText
								id="serial"
								value={product.serial}
								onChange={(e) => onInputChange(e, "serial")}
								required
								autoFocus
								className={classNames({
									"p-invalid": submitted && !product.serial,
								})}
							/>
							{submitted && !product.serial && (
								<small className="p-invalid">Campo requerido.</small>
							)}
						</div>
						<div className="field">
							<label htmlFor="description">Nombre</label>
							<InputTextarea
								id="description"
								value={product.descripcion}
								onChange={(e) => onInputChange(e, "descripcion")}
								required
								rows={3}
								cols={20}
							/>
						</div>

						<div className="formgrid grid">
							<div className="field col">
								<label htmlFor="precio">Precio</label>
								<InputNumber
									id="precio"
									mode="decimal"
									maxFractionDigits={2}
									value={product.precio}
									onValueChange={(e) => onInputNumberChange(e, "precio")}
								/>
							</div>

							<div className="field col">
								<label htmlFor="quantity">Unidad de Medida</label>
								<Dropdown
									value={product.unidad}
									onChange={(e) => {
										setProduct({ ...product, unidad: e.value });
									}}
									options={dropdownValues}
									optionLabel="name"
									placeholder="Seleccione"
								/>
							</div>
							
						</div>

						<div className="formgrid grid">
							<div className="field col">
								<label htmlFor="proveedor">Proveedor</label>
								<InputText
									id="proveedor"
									value={product.proveedor}
									onChange={(e) => onInputChange(e, "proveedor")}
								/>
							</div>
						</div>
						{/* <pre>{JSON.stringify(product)}</pre> */}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={product}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
