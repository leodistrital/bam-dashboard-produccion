import React, { useState, useEffect, useRef } from "react";
// import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	AutoComplete,
} from "../../components/crud";
import { Conexion } from "../../service/Conexion";
import { TablaDatos } from "../../components/crud/tabla/TablaDatos";
import { BarraSuperior } from "../../components/crud/tabla/BarraSuperior";
import { EliminarVentana } from "../../components/crud/EliminarVentana";
import {
	productDialogFooter,
} from "../../components/crud/tabla/Funciones";

export const DetalleSubpartidas = ({ llave }) => {
	let emptyProduct = {
		id: null,
		nombre: "",
	};
	const TABLA = "subpartidaitem/" + llave;
	const titulo = "Subpartidas";

	const [productDialog, setProductDialog] = useState(false);
	const [deleteProductDialog, setDeleteProductDialog] = useState(false);
	const [product, setProduct] = useState(emptyProduct);
	const [submitted, setSubmitted] = useState(false);
	const toast = useRef(null);

	const [datostabla, setdatostabla] = useState(null);
	const datatable = new Conexion();

	const [valueDropdown1, setvalueDropdown1] = useState(null);
	const [tableDropdown1, settableDropdown1] = useState();
	const [filterDropdown1, setfilterDropdown1] = useState();

	useEffect(() => {
		datatable.gettable(TABLA).then((data) => setdatostabla(data));
		datatable.gettable("plantillas").then((lista) => settableDropdown1(lista));
	}, []);

	const searchDropdown1 = (event) => {
		
		setTimeout(() => {
			let filteredData;
			if (!event.query.trim().length) {
				filteredData = [...tableDropdown1];
			} else {
				filteredData = tableDropdown1.filter((country) => {
					return country.nombre?.toLowerCase()
						.includes(event.query?.toLowerCase());
				});
			}

			setfilterDropdown1(filteredData);
		}, 0);
	};

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

	const onInputChange = (e, name) => {
		setvalueDropdown1(e.value);
		// debugger
		const val = (e.target && e.target.value) || "";
		let _product = { ...product };
		_product[`${name}`] = val;

		setProduct(_product);
		// console.log(_product);
	};

	const saveProductPlantilla = () => {
		// console.log(datostabla, 'guardado de plantilla imtesss');
		// console.log(valueDropdown1, 'gaurdando');
		// console.log(datostabla, 'tabla completa');
		let resultado = "";
		let _products = [...datostabla];
		let _product = { ...valueDropdown1 };
		// console.log(_product, 'dato del search');
		//  _products.push(_product);
		// setdatostabla([..._products]);
		// console.log(datostabla,'despues', _products);
		let datosEnvio = {
			idSubpartida: _product.id,
			idPartida: llave,
		};

		// console.log(datosEnvio, 'obj final');

		resultado = datatable.getCrearItem("subpartidaitem", datosEnvio);

		resultado.then((value) => {
			// console.log(value.resp.codigo);
			let newitem = {
				id: value.resp.codigo,
				codigoplantilla: llave,
				codigoitem: _product.id,
				nombsubpartida: _product.nombre,
			};
			_products.push(newitem);
			// debugger
			setdatostabla([..._products]);
			// console.log(newitem, 'objeto despuesta de llagar' );
			toast.current.show({
				severity: "success",
				summary: "Confirmacion",
				detail: "Transacción Exitosa",
				life: 4000,
			});
			setvalueDropdown1(emptyProduct);
			setProductDialog(false);
			setProduct(emptyProduct);
		});
	};

	const confirmDeleteProduct = (product) => {
		console.log(product, "por confirmar");
		setProduct(product);
		setDeleteProductDialog(true);
	};

	const deleteProduct = () => {
		let _products = datostabla.filter((val) => val.id !== product.id);
		setdatostabla(_products);

		let resultado = datatable.getEliminarItem(
			"subpartidaitem",
			product,
			product.id
		);
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

	const actionBodyTemplate = (rowData) => {
		return (
			<div
				className="actions"
				style={{
					display: "flex",
				}}
			>
				{/* <Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-success mr-2"
					onClick={() => editProduct(rowData, rowData.id)}
				/> */}
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-warning mr-2"
					onClick={() => confirmDeleteProduct(rowData)}
                    
                    />
			</div>
		);
	};

	return (
		<div className="grid ">
			<div className="col-12">
				<div className="card">
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos
						datostabla={datostabla}
						titulo={titulo}
						buscador={false}
						paginator={false}
					>
						{/* <Column
							field="id"
							header="ID"
							sortable
							body={codeBodyTemplate}
							headerStyle={{ width: "10%", minWidth: "10rem" }}
						></Column> */}
						<Column
							field="nombsubpartida"
							header="Nombre"
							sortable
							headerStyle={{ width: "90%", minWidth: "10rem" }}
						></Column>

						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "33rem" }}
						// header="Item:"
						modal
						className="p-fluid"
						footer={productDialogFooter(hideDialog, saveProductPlantilla)}
						onHide={hideDialog}
					>
						<div className="field">
							<label htmlFor="name">Subpartida:</label>

							<AutoComplete
								value={valueDropdown1}
								suggestions={filterDropdown1}
								completeMethod={searchDropdown1}
								field="nombre"
								dropdown
								name="itemsubpartida"
								id="itemsubpartida"
                                autoFocus
								onChange={(e) => onInputChange(e, "itemproducto")}
							/>

							{submitted && !product.nombre && (
								<small className="p-invalid">Campo requerido.</small>
							)}
						</div>
					
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
