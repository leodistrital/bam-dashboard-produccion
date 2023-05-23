import React, { useState, useEffect, useRef } from "react";
// import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	OverlayPanel,
	DataTable,
	AutoComplete,
	Dropdown,
	Tag,
	InputText,
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
// import { CapituloBom } from "../../components/bom/CapituloBom";

export const BomPlantilla = ({ codigoBom }) => {
	let emptyProduct = {
		codigoCapitulo: 0,
		codigoSeleccion: 0,
		tipoagregar: 0,
		nombretipo: "",
		codigoBom: codigoBom,
	};
	const TABLA = "plantilla";

	const [productDialog, setProductDialog] = useState(false);
	const [deleteProductDialog, setDeleteProductDialog] = useState(false);
	const [product, setProduct] = useState(emptyProduct);
	const [submitted, setSubmitted] = useState(false);
	const [listaCapitulos, setlistaCapitulos] = useState([]);
	const toast = useRef(null);

	const [datostabla, setdatostabla] = useState(null);
	const datatable = new Conexion();

	/*  datos selectores*/
	const [valueDropdownPartidas, setvalueDropdownPartidas] = useState(null);
	const [filterDropdownPartidas, setfilterDropdownPartidas] = useState();
	const [tableDropdownPartidas, settableDropdownPartidas] = useState();
	const [tableDropdownCapitulos, settableDropdownCapitulos] = useState();

	const [valueDropdownSubPartidas, setvalueDropdownSubPartidas] = useState(
		null
	);
	const [filterDropdownSubPartidas, setfilterSubDropdownPartidas] = useState();
	const [tableDropdownSubPartidas, settableSubDropdownPartidas] = useState();

	const [valueDropdownMateriales, setvalueDropdownMateriales] = useState(null);
	const [filterDropdownMateriales, setfilterDropdownMateriales] = useState();
	const [tableDropdownMateriales, settableDropdownMateriales] = useState();

	const [tipoagregar, settipoagregar] = useState(null);

	const op = useRef(null);

	useEffect(() => {
		// console.log("se consulta todo", product);
		// datatable.gettable(TABLA).then(data => setdatostabla(data));

		if (product.codigoBom) {
			datatable
				.gettable("parametros/capitulos")
				.then((capitulos) => settableDropdownCapitulos(capitulos));
			datatable
				.gettable("partida")
				.then((partidas) => settableDropdownPartidas(partidas));
			datatable
				.gettable("plantillas")
				.then((subpartidas) => settableSubDropdownPartidas(subpartidas));
			datatable
				.gettable("item")
				.then((matertiales) => settableDropdownMateriales(matertiales));

			datatable
				.gettable("parametros/listacapitulosbom/" + codigoBom)
				.then((listacapitulos) => setlistaCapitulos(listacapitulos));
		}
	}, []);

	const searchDropdownPartidas = (event) => {
		setTimeout(() => {
			let filteredData;
			if (!event.query.trim().length) {
				filteredData = [...tableDropdownPartidas];
			} else {
				filteredData = tableDropdownPartidas.filter((country) => {
					return country.nombre
						.toLowerCase()
						.includes(event.query.toLowerCase());
				});
			}
			setfilterDropdownPartidas(filteredData);
		}, 150);
	};

	const searchDropdownSubPartidas = (event) => {
		setTimeout(() => {
			let filteredData;
			if (!event.query.trim().length) {
				filteredData = [...tableDropdownSubPartidas];
			} else {
				filteredData = tableDropdownSubPartidas.filter((country) => {
					return country.nombre
						.toLowerCase()
						.includes(event.query.toLowerCase());
				});
			}
			setfilterSubDropdownPartidas(filteredData);
		}, 150);
	};

	const searchDropdownMateriales = (event) => {
		setTimeout(() => {
			let filteredData;
			if (!event.query.trim().length) {
				filteredData = [...tableDropdownMateriales];
			} else {
				filteredData = tableDropdownMateriales.filter((country) => {
					return country.nombre
						.toLowerCase()
						.includes(event.query.toLowerCase());
				});
			}
			setfilterDropdownMateriales(filteredData);
		}, 150);
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

	const saveProduct = () => {
		console.log("buscando tipo de seleccion");
		setSubmitted(true);
		console.log(submitted, product.tipoagregar);
		console.log(product);
		if (product.tipoagregar > 0) {
			// console.log(product);
			// console.log(datosEnvio, 'obj final');

			const resultado = datatable.getCrearItem("cabezotebomdetalle", product);

			resultado.then((value) => {
				// console.log(value.resp.codigo);
				// let newitem = {
				// 	id: value.resp.codigo,
				// 	codigoplantilla: llave,
				// 	codigoitem: _product.id,
				// 	nombreitem: _product.descripcion,
				// };
				// debugger;
				// _products.push(newitem);
				// debugger
				// setdatostabla([..._products]);
				// console.log(newitem, 'objeto despuesta de llagar' );
				toast.current.show({
					severity: "success",
					summary: "Confirmacion",
					detail: "Transacción Exitosa",
					life: 4000,
				});
				// setvalueDropdown1(emptyProduct);
				setProductDialog(false);
				setProduct(emptyProduct);
			});
			// if (product.id == null) {
			// 	resultado = datatable.getCrearItem(TABLA, product);
			// 	_products = [...datostabla];
			// 	_product = { ...product };
			// 	_products.push(_product);
			// 	setdatostabla(_products);
			// } else {
			// 	resultado = datatable.getEditarItem(TABLA, product, product.id);
			// 	const index = findIndexById(product.id, datostabla);
			// 	_products[index] = _product;
			// }
			// resultado.then((value) => {
			// 	toast.current.show({
			// 		severity: "success",
			// 		summary: "Confirmacion",
			// 		detail: "Transacción Exitosa",
			// 		life: 4000,
			// 	});
			// 	setProductDialog(false);
			// 	setProduct(emptyProduct);
			// });
		}
	};

	const editProduct = (product, id) => {
		setProduct({ ...product });
		datatable.getItem(TABLA, id).then((data) => setProduct({ ...data }));
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

	const StatusValues = [
		{ name: "Partidas", value: 1 },
		{ name: "Subpartidas", value: 2 },
		{ name: "Materiales", value: 3 },
	];

	const actionBodyTemplate = (rowData) => {
		const products = [];
		return (
			<div
				className="actions"
				style={{
					display: "flex",
				}}
			>
				<Button
					className="p-button-success mr-2"
					type="button"
					icon="pi pi-search"
					onClick={(e) => op.current.toggle(e)}
					aria-haspopup
				/>

				<OverlayPanel
					ref={op}
					showCloseIcon
					id="overlay_panel"
					style={{ width: "450px" }}
				>
					<DataTable
						value={products}
						size="small"
						showGridlines
						resizableColumns
						scrollable
						scrollHeight="400px"
						responsiveLayout="scroll"
					>
						<Column field="name" header="Name" sortable />
						<Column header="Unidades" field="Factor" />
						<Column header="Costo" field="Factor" />
						<Column field="Total" header="Total" sortable />
					</DataTable>
				</OverlayPanel>

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
				<Toast ref={toast} />
				<BarraSuperior openNew={openNew} />

				<div className="accordion-demo">
					<h3>Lista de Capítulos</h3>
					<pre>{JSON.stringify(listaCapitulos)} </pre>
					<pre>{typeof StatusValues} </pre>
{/* 
					{listaCapitulos.map((capitulo, index) => (
						<CapituloBom key={index} capitulo={capitulo} />
					))} */}
				</div>

				<Dialog
					visible={productDialog}
					style={{ width: "50%" }}
					header="Agregar Items"
					modal
					className="p-fluid"
					footer={productDialogFooter(hideDialog, saveProduct)}
					onHide={hideDialog}
				>
					{/* <pre>{JSON.stringify(product)} </pre>
					<pre>{JSON.stringify(StatusValues)} </pre>
					<pre>{JSON.stringify(tableDropdownCapitulos)} </pre> */}
					<div className="field col">
						<label>Capítulo:</label>
						<Dropdown
							value={product.codigoCapitulo}
							onChange={(e) => {
								setProduct({
									...product,
									codigoCapitulo: e.value,
								});
							}}
							options={tableDropdownCapitulos}
							optionLabel="name"
							placeholder="Seleccione"
						/>
					</div>
					<div className="field col">
						<label htmlFor="quantity">Tipo:</label>
						<Dropdown
							value={product.codigoSeleccion}
							onChange={(e) => {
								settipoagregar(e.value);
								setProduct({
									...product,
									codigoSeleccion: e.value,
									tipoagregar: 0,
									nombretipo: "",
								});
							}}
							options={StatusValues}
							optionLabel="name"
							placeholder="Seleccione"
						/>
					</div>
					{tipoagregar === 1 && (
						<div className="field col">
							<label htmlFor="name">Partidas:</label>
							<AutoComplete
								value={valueDropdownPartidas}
								suggestions={filterDropdownPartidas}
								completeMethod={searchDropdownPartidas}
								field="nombre"
								dropdown
								name="codigoPartida"
								id="codigoPartida"
								onChange={(e) => {
									setvalueDropdownPartidas(e.value);
									setProduct({
										...product,
										tipoagregar: e.value.id,
										nombretipo: "partidas",
									});
								}}
							/>
						</div>
					)}

					{tipoagregar === 2 && (
						<div className="field col">
							<label htmlFor="name">Subpartidas:</label>
							<AutoComplete
								value={valueDropdownSubPartidas}
								suggestions={filterDropdownSubPartidas}
								completeMethod={searchDropdownSubPartidas}
								field="nombre"
								dropdown
								name="codigosubpartida"
								id="codigosubpartida"
								onChange={(e) => {
									setvalueDropdownSubPartidas(e.value);
									setProduct({
										...product,
										tipoagregar: e.value.id,
										nombretipo: "subpartidas",
									});
								}}
							/>
						</div>
					)}

					{tipoagregar === 3 && (
						<div className="field col">
							<label htmlFor="name">Materiales:</label>
							<AutoComplete
								value={valueDropdownMateriales}
								suggestions={filterDropdownMateriales}
								completeMethod={searchDropdownMateriales}
								field="dataselector"
								dropdown
								name="codigoMaterial"
								id="codigoMaterial"
								onChange={(e) => {
									setvalueDropdownMateriales(e.value);
									setProduct({
										...product,
										tipoagregar: e.value.id,
										nombretipo: "materiales",
									});
								}}
							/>
						</div>
					)}

					{submitted && product.tipoagregar === 0 && (
						<Tag
							className="p-mr-6"
							style={{ fontSize: "1.0rem" }}
							icon="pi pi-times"
							severity="danger"
							value="No hay Opción seleccionada"
						></Tag>
					)}

					<div className="field col-2">
						<label htmlFor="cantidad">Cantidad:</label>
						<InputText
							id="cantidad"
							
							onChange={(e) => onInputChange(e, "cantidad")}
							autoFocus
						/>
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
	);
};
