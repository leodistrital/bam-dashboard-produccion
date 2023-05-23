import React, { useState, useEffect, useRef } from "react";
import {
	Column,
	Toast,
	Button,
	InputTextarea,
	Dialog,
	InputText,
	AutoComplete,
	Calendar,
	Dropdown,
	TabView,
	TabPanel,
	Editor,
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
import { BomPlantilla } from "./BomPlantilla";

export const Bom = () => {
	let emptyProduct = {
		id: null,
		cod_cli_bom: "",
		proyecto: "",
		fecha: null,
		status: "En Proceso",
		description: "",
	};
	const TABLA = "bom";
	const titulo = "BOM";

	const [productDialog, setProductDialog] = useState(false);
	const [deleteProductDialog, setDeleteProductDialog] = useState(false);
	const [product, setProduct] = useState(emptyProduct);
	const [submitted, setSubmitted] = useState(false);
	const toast = useRef(null);

	const [datostabla, setdatostabla] = useState(null);
	const datatable = new Conexion();
	const datatableaux = new Conexion();

	const [clienteDropdown, setclienteDropdown] = useState(null);
	const [tableDropdownCliente, settableDropdownCliente] = useState();
	const [filterDropdownCliente, setfilterDropdownCliente] = useState();

	useEffect(() => {
		datatable.gettable(TABLA).then((data) => setdatostabla(data));
		datatableaux
			.gettable("cliente")
			.then((lista) => settableDropdownCliente(lista));
		setclienteDropdown(datatable.cliente);
		// console.log(datostabla);
		// debugger;
		// console.log(datatable);
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

		// console.log(product);
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
			setclienteDropdown(null);
		});
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

	const onInputChangeClinetes = (e, name) => {
		setclienteDropdown(e.value);
		// debugger;
		const val = (e.target && e.target.value) || "";
		let _product = { ...product, cod_cli_bom: e.value.id };
		_product[`${name}`] = val.nombre;
		setProduct(_product);
	};

	const onInputChangeHtml = (e, name) => {
		// console.log(e.htmlValue);
		// setText1(e.htmlValue);
		// setclienteDropdown(e.value);
		const val = e.htmlValue || "";
		let _product = { ...product };
		_product[`${name}`] = val;
		// console.log(_product,'despues');
		setProduct(_product);
	};

	const onInputChange = (e, name) => {
		// console.log(e, "target");
		const val = (e.target && e.target.value) || "";
		let _product = { ...product };
		_product[`${name}`] = val;

		setProduct(_product);
		// console.log(_product);
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

	const searchDropdownCliente = (event) => {
		setTimeout(() => {
			let filteredData;
			if (!event.query.trim().length) {
				filteredData = [...tableDropdownCliente];
			} else {
				filteredData = tableDropdownCliente.filter((country) => {
					return country.nombre
						.toLowerCase()
						.includes(event.query.toLowerCase());
				});
			}

			setfilterDropdownCliente(filteredData);
		}, 250);
	};

	const StatusValues = [
		{ name: "En Proceso", value: "En Proceso" },
		{ name: "Completo", value: "Completo" },
		// { name: "Terminado", code: "Terminado" }
	];

	return (
		<div className="grid">
			<div className="col-12">
				<div className="card">
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos datostabla={datostabla} titulo={titulo}>
						<Column
							field="id"
							header="ID"
							sortable
							body={codeBodyTemplate}
							headerStyle={{ width: "2%", minWidth: "5rem" }}
						></Column>
						<Column
							field="cliente"
							header="Cliente"
							sortable
							headerStyle={{ width: "35%", minWidth: "10rem" }}
						></Column>
						<Column
							field="proyecto"
							header="Proyecto"
							sortable
							headerStyle={{ width: "35%", minWidth: "10rem" }}
						></Column>

						<Column
							field="status"
							header="Estado"
							sortable
							headerStyle={{ width: "20%", minWidth: "10rem" }}
						></Column>
						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "80%", height: "90%" }}
						header="BOM"
						modal
						className="p-fluid"
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}
					>
						<TabView className="tabview-custom">
							<TabPanel header="Datos Principales" leftIcon="pi px-2  pi-id-card">
								<div className="formgrid grid">
									<div className="field col">
										<label htmlFor="name">Cliente:</label>
										<AutoComplete
											value={product.cliente}
											suggestions={filterDropdownCliente}
											completeMethod={searchDropdownCliente}
											field="nombre"
											dropdown
											name="cliente"
											id="cliente"
											onChange={(e) => onInputChangeClinetes(e, "cliente")}
										/>
									</div>

									<div className="field col">
										<label htmlFor="quantity">Status:</label>
										<Dropdown
											value={product.status}
											onChange={(e) => {
												setProduct({ ...product, status: e.value });
											}}
											options={StatusValues}
											optionLabel="name"
											placeholder="Seleccione"
										/>
									</div>
								</div>
								<div className="field">
									<label htmlFor="name">Nombre Proyecto:</label>
									<InputText
										value={product.proyecto}
										id="nombreproyecto"
										name="nombreproyecto"
										onChange={(e) => onInputChange(e, "proyecto")}
										autoFocus
									/>
								</div>
								{/* <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="quantity">Codigo</label>
                                        <InputText id="codigo" value={product.codigo} onChange={e => onInputChange(e, "codigo")} />
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="price">Fecha:</label>
                                        <Calendar showIcon showButtonBar value={new Date(product.fecha)} name="fecha" id="fecha" onChange={e => onInputChange(e, "fecha")} monthNavigator={true} yearNavigator={true} yearRange="2022:2025" dateFormat="dd/mm/yy"></Calendar>
                                    </div>
                                </div> */}
								<div className="field">
									<label htmlFor="description">Description:</label>
									<InputTextarea
										id="description"
										value={product.description}
										onChange={(e) => onInputChange(e, "description")}
										rows={3}
										cols={20}
									/>
								</div>

								<pre>{JSON.stringify(product)} </pre>

								<div className="formgrid grid">
									{/* <div className="field col">
                                        <label htmlFor="price">Margen % :</label>
                                        <InputText id="margen" value={product.margen} onChange={e => onInputChange(e, "margen")} />
                                    </div> */}
									{/* <div className="field col">
                                        <label htmlFor="quantity">Status:</label>
                                        <Dropdown value={product.status} onChange={e => setProduct({ ...product, status: e.value })} options={StatusValues} optionLabel="name" placeholder="Seleccione" />
                                    </div> */}
								</div>
							</TabPanel>

							{product.id && (
								<TabPanel header="Lista de Partidas" leftIcon="pi px-3 pi-list">
									<BomPlantilla codigoBom={product?.id} />
								</TabPanel>
							)}

							<TabPanel header="Observaciones" leftIcon="pi pi-copy">
								{/* <TabPanel header="Lista de Partidas" leftIcon="pi pi-list">
                                        <BomPlantilla />
                                </TabPanel> */}
								{/* <div className="field">
                                        <label htmlFor="name">Notas:</label>
                                            <Editor style={{ height: "520px" }} value={product.notas} name="notas" onTextChange={e => onInputChangeHtml(e, "notas")} />
                                    </div> */}
							</TabPanel>
						</TabView>
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
