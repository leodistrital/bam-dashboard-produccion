import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProductService } from "../../service/ProductService";
import { Dropdown } from "primereact/dropdown";
import { Conexion } from "../../service/Conexion";

///****** aca van las cosas  */
import { useDispatch, useSelector } from "react-redux";
import { setDataSet, setFormData } from "../../store/appSlice"; 


export const Cotizacion = () => {
	let emptyProduct = {
		id: null,
		name: "",
		image: null,
		description: "",
		category: null,
		price: 0,
		quantity: 0,
		rating: 0,
		inventoryStatus: "INSTOCK",
	};

	let emptyFormData = {
		id: null,
		name: "",
		image: null,
		description: "",
		category: null,
		price: 0,
		quantity: 0,
		rating: 0,
		inventoryStatus: "INSTOCK",
	};
	const TABLA = "cliente";
	const datatable = new Conexion();
	const { dataSet } = useSelector((state) => state.appsesion);
	

	// const [datostabla, setdatostabla] = useState(null);
	const dispatch = useDispatch();


	const [products, setProducts] = useState(null);
	const [productDialog, setProductDialog] = useState(false);
	const [deleteProductDialog, setDeleteProductDialog] = useState(false);
	const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
	const [product, setProduct] = useState(emptyProduct);
	const [selectedProducts, setSelectedProducts] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [globalFilter, setGlobalFilter] = useState(null);
	const toast = useRef(null);
	const dt = useRef(null);
	const [dropdownValue, setDropdownValue] = useState(null);


	

	useEffect(() => {
		//Carga todos los Items de la tabla
		dispatch(setFormData(emptyFormData));
		datatable.gettable(TABLA).then(data => {
			// console.log('¿llego la data',data)
			dispatch(setDataSet(data))
			console.log(dataSet);
			// setProducts(dataSet);
		});
		


		const productService = new ProductService();
		productService.getProducts().then((data) => {
			setProducts(data);
		});
	}, []);



	const formatCurrency = (value) => {
		return value.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		});
	};

	const openNew = () => {
		setProduct(emptyProduct);
		setSubmitted(false);
		setProductDialog(true);
		console.log('nuevo registro')
	};

	const hideDialog = () => {
		setSubmitted(false);
		setProductDialog(false);
	};

	const hideDeleteProductDialog = () => {
		setDeleteProductDialog(false);
	};

	const hideDeleteProductsDialog = () => {
		setDeleteProductsDialog(false);
	};

	const saveProduct = () => {
		setSubmitted(true);

		if (product.name.trim()) {
			let _products = [...products];
			let _product = { ...product };
			if (product.id) {
				const index = findIndexById(product.id);

				_products[index] = _product;
				toast.current.show({
					severity: "success",
					summary: "Confirmacion",
					detail: "Transacción Exitosa",
					life: 3000,
				});
			} else {
				_product.id = createId();
				_product.image = "product-placeholder.svg";
				_products.push(_product);
				toast.current.show({
					severity: "success",
					summary: "Confirmacion",
					detail: "Transacción Exitosa",
					life: 3000,
				});
			}

			setProducts(_products);
			setProductDialog(false);
			setProduct(emptyProduct);
		}
	};

	const editProduct = (product) => {
		setProduct({ ...product });
		setProductDialog(true);
	};

	const confirmDeleteProduct = (product) => {
		setProduct(product);
		setDeleteProductDialog(true);
	};

	const deleteProduct = () => {
		let _products = products.filter((val) => val.id !== product.id);
		setProducts(_products);
		setDeleteProductDialog(false);
		setProduct(emptyProduct);
		toast.current.show({
			severity: "success",
			summary: "Confirmacion",
			detail: "Transacción Exitosa",
			life: 3000,
		});
	};

	const findIndexById = (id) => {
		let index = -1;
		for (let i = 0; i < products.length; i++) {
			if (products[i].id === id) {
				index = i;
				break;
			}
		}

		return index;
	};

	const createId = () => {
		let id = "";
		let chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (let i = 0; i < 5; i++) {
			id += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return id;
	};

	const exportCSV = () => {
		dt.current.exportCSV();
	};

	const confirmDeleteSelected = () => {
		setDeleteProductsDialog(true);
	};

	const deleteSelectedProducts = () => {
		let _products = products.filter((val) => !selectedProducts.includes(val));
		setProducts(_products);
		setDeleteProductsDialog(false);
		setSelectedProducts(null);
		toast.current.show({
			severity: "success",
			summary: "Successful",
			detail: "Products Deleted",
			life: 3000,
		});
	};

	const onCategoryChange = (e) => {
		let _product = { ...product };
		_product["category"] = e.value;
		setProduct(_product);
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

	const leftToolbarTemplate = () => {
		return (
			<React.Fragment>
				<div className="my-2">
					<Button
						label="Agregar"
						icon="pi pi-plus"
						style={{
							fontSize: "1.3rem",
						}}
						className="p-button-success mr-2"
						onClick={openNew}
					/>
					{/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
				</div>
			</React.Fragment>
		);
	};

	const rightToolbarTemplate = () => {
		return (
			<>
				{/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
			</>
		);
	};

	const codeBodyTemplate = (rowData) => {
		return (
			<>
				<span className="p-column-title">Code</span>
				{rowData.id}
			</>
		);
	};

	const nameBodyTemplate = (rowData) => {
		return (
			<>
				<span className="p-column-title">Name</span>
				{rowData.name}
			</>
		);
	};

	// const imageBodyTemplate = rowData => {
	// 	return (
	// 		<>
	// 			<span className="p-column-title">Image</span>
	// 			<img
	// 				src={`assets/demo/images/product/${rowData.image}`}
	// 				alt={rowData.image}
	// 				className="shadow-2"
	// 				width="100"
	// 			/>
	// 		</>
	// 	);
	// };

	const priceBodyTemplate = (rowData) => {
		return (
			<>
				<span className="p-column-title">Price</span>
				{formatCurrency(rowData.price)}
			</>
		);
	};

	const categoryBodyTemplate = (rowData) => {
		return (
			<>
				<span className="p-column-title">Category</span>
				{rowData.category}
			</>
		);
	};

	// const ratingBodyTemplate = rowData => {
	// 	return (
	// 		<>
	// 			<span className="p-column-title">Reviews</span>
	// 			<Rating value={rowData.rating} readonly cancel={false} />
	// 		</>
	// 	);
	// };

	// const statusBodyTemplate = rowData => {
	// 	return (
	// 		<>
	// 			<span className="p-column-title">Status</span>
	// 			<span
	// 				className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}
	// 			>
	// 				{rowData.inventoryStatus}
	// 			</span>
	// 		</>
	// 	);
	// };

	const actionBodyTemplate = (rowData) => {
		// console.log(rowData);

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
					onClick={() => editProduct(rowData)}
				/>
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-warning mr-2"
					onClick={() => confirmDeleteProduct(rowData)}
				/>
			</div>
		);
	};

	const header = (
		<div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
			<h5 className="m-0">Items</h5>
			<span className="block mt-2 md:mt-0 p-input-icon-left">
				<i className="pi pi-search" />
				<InputText
					type="search"
					onInput={(e) => setGlobalFilter(e.target.value)}
					placeholder="Buscar..."
				/>
			</span>
		</div>
	);

	const productDialogFooter = (
		<>
			<Button
				label="Cancelar"
				icon="pi pi-times"
				className="p-button-secondary"
				onClick={hideDialog}
			/>
			<Button
				label="Guardar"
				icon="pi pi-check"
				className="p-button-success"
				onClick={saveProduct}
			/>
		</>
	);
	const deleteProductDialogFooter = (
		<>
			<Button
				label="Cancelar"
				icon="pi pi-times"
				className="p-button-raised p-button-info p-button-text"
				onClick={hideDeleteProductDialog}
			/>

			<Button
				label="Borrar"
				icon="pi pi-check"
				className="p-button-raised p-button-danger p-button-text"
				onClick={deleteProduct}
			/>
		</>
	);

	const dropdownValues = [
		{ name: "Metro Lineal", code: "ML" },
		{ name: "Metro Cuadrado", code: "M3" },
		{ name: "Unidades", code: "UN" },
	];

	return (
		<div className="grid">
			<div className="col-12">
				<div className="card">
					<Toast ref={toast} />
					<Toolbar
						className="mb-4"
						left={leftToolbarTemplate}
						right={rightToolbarTemplate}
					></Toolbar>

					<DataTable
						ref={dt}
						value={products}
						selection={selectedProducts}
						onSelectionChange={(e) => setSelectedProducts(e.value)}
						dataKey="id"
						paginator
						rows={15}
						rowsPerPageOptions={[10, 15, 25, 50]}
						className="datatable-responsive"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
						currentPageReportTemplate="{first} de {last},  Total: {totalRecords} registros"
						globalFilter={globalFilter}
						emptyMessage="No products found."
						header={header}
						responsiveLayout="scroll"
					>
						<Column
							field="id"
							header="Codigo"
							sortable
							body={codeBodyTemplate}
							headerStyle={{ width: "10%", minWidth: "10rem" }}
						></Column>
						<Column
							field="name****"
							header="Cliente"
							sortable
							body={nameBodyTemplate}
							headerStyle={{ width: "35%", minWidth: "10rem" }}
						></Column>

						<Column
							field="price"
							header="Status"
							body={priceBodyTemplate}
							sortable
							headerStyle={{ width: "20%", minWidth: "8rem" }}
						></Column>
						<Column
							field="category"
							header="Fecha"
							sortable
							body={categoryBodyTemplate}
							headerStyle={{ width: "25%", minWidth: "10rem" }}
						></Column>

						<Column header="Acciones" body={actionBodyTemplate}></Column>
					</DataTable>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header="Detalle  del Item"
						modal
						className="p-fluid"
						footer={productDialogFooter}
						onHide={hideDialog}
					>
						{product.image && (
							<img
								src={`assets/demo/images/product/${product.image}`}
								alt={product.image}
								width="150"
								className="mt-0 mx-auto mb-5 block shadow-2"
							/>
						)}
						<div className="field">
							<label htmlFor="name">Nombre</label>
							<InputText
								id="name"
								value={product.name}
								onChange={(e) => onInputChange(e, "name")}
								required
								autoFocus
								className={classNames({
									"p-invalid": submitted && !product.name,
								})}
							/>
							{submitted && !product.name && (
								<small className="p-invalid">Name is required.</small>
							)}
						</div>
						<div className="field">
							<label htmlFor="description">Descripcion</label>
							<InputTextarea
								id="description"
								value={product.description}
								onChange={(e) => onInputChange(e, "description")}
								required
								rows={3}
								cols={20}
							/>
						</div>

						<div className="formgrid grid">
							<div className="field col">
								<label htmlFor="price">Margen %</label>
								<InputNumber
									id="price"
									mode="decimal"
									minFractionDigits={2}
									maxFractionDigits={2}
									value={product.price}
									onValueChange={(e) => onInputNumberChange(e, "price")}
								/>
							</div>
							<div className="field col">
								<label htmlFor="price">Comision RP %</label>
								<InputNumber
									id="price"
									mode="decimal"
									minFractionDigits={2}
									maxFractionDigits={2}
									value={product.price}
									onValueChange={(e) => onInputNumberChange(e, "price")}
								/>
							</div>
							<div className="field col">
								<label htmlFor="price">Matenimiento %</label>
								<InputNumber
									id="price"
									mode="decimal"
									minFractionDigits={2}
									maxFractionDigits={2}
									value={product.price}
									onValueChange={(e) => onInputNumberChange(e, "price")}
								/>
							</div>
						</div>
					</Dialog>

					<Dialog
						visible={deleteProductDialog}
						style={{ width: "450px" }}
						header="Confirm"
						modal
						footer={deleteProductDialogFooter}
						onHide={hideDeleteProductDialog}
					>
						<div className="p-button-danger flex align-items-center justify-content-center">
							<i
								className="pi pi-exclamation-triangle mr-3"
								style={{ fontSize: "2rem" }}
							/>
							{product && (
								<span>
									Esta Segurodo de eliminar el registro, <b>{product.name}</b>?
								</span>
							)}
						</div>
					</Dialog>
				</div>
			</div>
		</div>
	);
};
