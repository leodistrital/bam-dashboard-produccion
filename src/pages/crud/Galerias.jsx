import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	InputText,
	Divider,
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

export const Galerias = () => {
	const TABLA = "galeriaimagenes";
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
	const [products, setProducts] = useState([]);
	let tituloiter = "Galeria";
	let { grupo } = useParams();

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
		// console.log("mi efecto detalle galeria", formData);
		saveImagenDetalle();
	}, [formData]);

	/*eventos*/
	const openNew = () => {
		dispatch(setFormData(emptyFormData));
		setProducts([]);
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
		datatable
			.gettable("parametros/galeriaimagenesdetalle/" + id)
			.then((datos) => {
				// console.table(datos);
				setProducts(datos);
				setCargando(false);
			});
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
		if (formData.nom_gal?.trim()) {
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

	const saveImagenDetalle = () => {
		// console.log("entro a insertar detalle");
		setSubmitted(true);
		if (formData.img_detalle?.trim()) {
			setCargando(true);
			if (formData.id) {
				//nuevo registro
				datatable
					.getCrearItem("galeriaimagenesdetalle", formData)
					.then((data) => {
						setCargando(false);
						// console.log("llego al final");

						datatable
							.gettable(
								"parametros/galeriaimagenesdetalle/" +
									formData.id
							)
							.then((datos) => {
								// console.table(datos);
								// console.log(datos.length);
								setProducts(datos);
								setCargando(false);
							});
					});
			}
		}
	};

	const deleteProduct = () =>
		datatable
			.getEliminarItem(TABLA, formData, formData.id)
			.then((data) => trasaccionExitosa("borrar"));

	// const deleteIamgen = (id) =>
	// 	datatable
	// 		.getEliminarItem("galeriaimagenesdetalle", formData, id)
	// 		.then((data) => trasaccionExitosa("borrar"));
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
				className='actions'
				style={{
					display: "flex",
				}}>
				<Button
					icon='pi pi-pencil'
					className='p-button-rounded p-button-success mr-2'
					onClick={() => editProduct(rowData.id)}
				/>
				<Button
					icon='pi pi-trash'
					className='p-button-rounded p-button-warning mr-2'
					onClick={() => confirmDeleteProduct(rowData)}
				/>
			</div>
		);
	};

	const responsiveOptions = [
		{
			breakpoint: "480px",
			numVisible: 2,
			numScroll: 2,
		},
		{
			breakpoint: "480px",
			numVisible: 2,
			numScroll: 2,
		},
		{
			breakpoint: "480px",
			numVisible: 1,
			numScroll: 1,
		},
	];
	const productTemplate = (product) => {
		// console.log(product);
		return (
			<div className='product-item'>
				<div className='product-item-content'>
					<div className='mb-1'>
						<img
							src={`${product.img_dal}`}
							onError={(e) =>
								(e.target.src =
									"https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
							}
							alt={product.name}
							className='product-image'
						/>
					</div>
					<div>
						<div className='car-buttons mt-2'>
							<Button
								icon='pi pi-trash'
								className='p-button p-button-rounded mr-2'
								onClick={() => borrarImagen(product.cod_dga)}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const borrarImagen = (idImagen) => {
		setCargando(true);
		setProducts([]);
		datatable
			.getEliminarItem("galeriaimagenesdetalle", formData, idImagen)
			.then((data) =>
				datatable
					.gettable(
						"parametros/galeriaimagenesdetalle/" + formData.id
					)
					.then((datos) => {
						// console.table(datos);
						// console.log(datos.length);
						setProducts(datos);
						setCargando(false);
					})
			);
	};

	return (
		<div className='grid'>
			<div className='col-12'>
				<div className='card'>
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos datostabla={dataSet} titulo={tituloiter}>
						<Column
							field='nom_gal'
							header='Nombre'
							sortable
							headerStyle={{
								width: "90%",
								minWidth: "10rem",
							}}></Column>

						<Column
							header='Acciones'
							body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header={"Detalle " + tituloiter}
						modal={true}
						className='p-fluid'
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}>
						<div className='formgrid grid'>
							<div className='field col'>
								{/* <pre>{JSON.stringify(formData, 2)}</pre> */}
								<label htmlFor='tit_not'>Nombre:</label>
								<InputText
									id='nom_gal'
									value={formData.nom_gal}
									onChange={(e) =>
										onInputChange(e, "nom_gal")
									}
									required
									autoFocus
									className={classNames({
										"p-invalid":
											submitted && !formData.nom_gal,
									})}
								/>
								{submitted && !formData.nom_gal && (
									<small className='p-invalid'>
										Campo requerido.
									</small>
								)}
							</div>
						</div>

						<div className='field'>
							{formData?.id && (
								<ImagenCampo
									label='Imagen'
									formData={formData}
									CampoImagen='img_detalle'
									nombreCampo='demo'
									// edicampo={formData.img_not}
									urlupload='/upload/images/galeria'
								/>
							)}
						</div>
						<Divider />
						{products.length > 0 && (
							<div className='carousel-demo'>
								<div className='card'>
									<Carousel
										value={products}
										numVisible={2}
										numScroll={1}
										responsiveOptions={responsiveOptions}
										itemTemplate={productTemplate}
										circular={true}
									/>
								</div>
							</div>
						)}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.nom_gal}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
