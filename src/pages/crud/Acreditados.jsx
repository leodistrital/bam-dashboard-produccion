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
	InputTextarea,
	TabView,
	TabPanel,
	tabHeaderIIespanol,
	tabHeaderIIResumen,
	tabHeaderIIingles,
	EditorHtml,
	tabHeaderIIPaso1,
	tabHeaderIIPaso2,
	tabHeaderIIPaso3,
	tabHeaderIIPaso4,
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

export const Acreditados = () => {
	const TABLA = "acr_registo";
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
	const [valueDropMenueventos, setvalueDropMenueventos] = useState(null);
	const [dropdownasistencia, setdropdownasistencia] = useState(null);
	const [dropdowtipodocumento, setdropdowtipodocumento] = useState(null);
	const [dropdowpaises, setddropdowpaises] = useState(null);
	const [dropdowlocalidades, setdropdowlocalidades] = useState(null);
	const [dropdowestratos, setdropdowestratos] = useState(null);
	const [dropdowsexo, setdropdowsexo] = useState(null);
	const [dropdowidentidadgen, setdropdowidentidadgen] = useState(null);
	const [dropdowetnia, setdropdowetnia] = useState(null);

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
			.gettable("parametros/tarifasacreditacion")
			.then((menu) => setvalueDropMenueventos(menu));
		datatable
			.gettable("parametros/parametros/estadoacreditacion")
			.then((datos) => {
				setdropdownasistencia(datos);
			});
		datatable.gettable("parametros/parametros/tipodoc").then((datos) => {
			setdropdowtipodocumento(datos);
		});

		datatable.gettable("parametros/parametros/paises").then((datos) => {
			setddropdowpaises(datos);
		});

		datatable.gettable("parametros/parametros/localidad").then((datos) => {
			setdropdowlocalidades(datos);
		});
		datatable.gettable("parametros/parametros/estratos").then((datos) => {
			setdropdowestratos(datos);
		});
		datatable.gettable("parametros/parametros/sexo").then((datos) => {
			setdropdowsexo(datos);
		});

		datatable
			.gettable("parametros/parametros/identidadgen")
			.then((datos) => {
				setdropdowidentidadgen(datos);
			});

		datatable.gettable("parametros/parametros/etnia").then((datos) => {
			setdropdowetnia(datos);
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
		if (formData.nom_reg?.trim()) {
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

	return (
		<div className='grid'>
			<div className='col-12'>
				<div className='card'>
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos datostabla={dataSet} titulo='Acreditados'>
						<Column
							field='nom_reg'
							header='Nombre'
							sortable
							headerStyle={{
								width: "30%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='ape_reg'
							header='Apellidos'
							sortable
							headerStyle={{
								width: "50%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='mai_reg'
							header='Correo'
							sortable
							headerStyle={{
								width: "15%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='finacreditacion'
							header='Status'
							sortable
							headerStyle={{
								width: "15%",
								minWidth: "10rem",
							}}></Column>

						<Column
							header='Acciones'
							body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header='Detalle Acreditado'
						modal={true}
						className='p-fluid'
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}>
						<TabView>
							<TabPanel
								className='justify-content: flex-end;'
								headerTemplate={tabHeaderIIResumen}>
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='nom_reg'>Nomre:</label>
										<InputText
											id='nom_reg'
											value={formData.nom_reg}
											onChange={(e) =>
												onInputChange(e, "nom_reg")
											}
											required
											autoFocus
											className={classNames({
												"p-invalid":
													submitted &&
													!formData.nom_reg,
											})}
										/>
										{submitted && !formData.nom_reg && (
											<small className='p-invalid'>
												Campo requerido.
											</small>
										)}
									</div>
									<div className='field col-6'>
										<label htmlFor='fape_regec_ave'>
											Apellido:
										</label>
										<InputText
											id='ape_reg'
											value={formData.ape_reg}
											onChange={(e) =>
												onInputChange(e, "ape_reg")
											}
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='mai_reg'>
											Usuario:
										</label>
										<InputText
											id='mai_reg'
											value={formData.mai_reg}
											onChange={(e) =>
												onInputChange(e, "mai_reg")
											}
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='finacreditacion'>
											Estado:
										</label>
										<Dropdown
											value={formData.finacreditacion}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														finacreditacion:
															e.value,
													})
												);
											}}
											options={dropdownasistencia}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='ord_cac'>
											Valor Asignado:
										</label>
										<Dropdown
											value={formData.cod_reg_ave}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														cod_reg_ave: e.value,
													})
												);
											}}
											options={valueDropMenueventos}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='finacreditacion'>
											Estado:
										</label>
										<Dropdown
											value={formData.finacreditacion}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														finacreditacion:
															e.value,
													})
												);
											}}
											options={dropdownasistencia}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>

								<div className='field col'>
									<label htmlFor='not_ave'>Nota:</label>
									<InputText
										id='not_ave'
										value={formData.not_ave}
										onChange={(e) =>
											onInputChange(e, "not_ave")
										}
									/>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIPaso1}>
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='nombre'>Nombre:</label>
										<InputText
											id='nombre'
											value={formData.nombre}
											onChange={(e) =>
												onInputChange(e, "nombre")
											}
										/>
									</div>
									<div className='field col-6'>
										<label htmlFor='apellido'>
											Apellido:
										</label>
										<InputText
											id='apellido'
											value={formData.apellido}
											onChange={(e) =>
												onInputChange(
													e,
													"aapellidope_reg"
												)
											}
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='finacreditacion'>
											Tipo Documento:
										</label>
										<Dropdown
											value={formData.finacreditacion}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														finacreditacion:
															e.value,
													})
												);
											}}
											options={dropdowtipodocumento}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
									<div className='field col-6'>
										<label htmlFor='numdocumento'>
											Numero Documento:
										</label>
										<InputText
											id='numdocumento'
											value={formData.numdocumento}
											onChange={(e) =>
												onInputChange(
													e,
													"aapenumdocumentollidope_reg"
												)
											}
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='finacreditacion'>
											Pais de Residencia:
										</label>
										<Dropdown
											value={formData.finacreditacion}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														finacreditacion:
															e.value,
													})
												);
											}}
											options={dropdowpaises}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
									<div className='field col-6'>
										<label htmlFor='numdocumento'>
											Ciudad:
										</label>
										<InputText
											id='numdocumento'
											value={formData.numdocumento}
											onChange={(e) =>
												onInputChange(
													e,
													"aapenumdocumentollidope_reg"
												)
											}
										/>
									</div>
								</div>
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='numdocumento'>
											Direccion:
										</label>
										<InputText
											id='numdocumento'
											value={formData.numdocumento}
											onChange={(e) =>
												onInputChange(
													e,
													"aapenumdocumentollidope_reg"
												)
											}
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='finacreditacion'>
											Nacionalidad:
										</label>
										<Dropdown
											value={formData.finacreditacion}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														finacreditacion:
															e.value,
													})
												);
											}}
											options={dropdowpaises}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='finacreditacion'>
											Localidad:
										</label>
										<Dropdown
											value={formData.finacreditacion}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														finacreditacion:
															e.value,
													})
												);
											}}
											options={dropdowlocalidades}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='finacreditacion'>
											Estrato:
										</label>
										<Dropdown
											value={formData.finacreditacion}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														finacreditacion:
															e.value,
													})
												);
											}}
											options={dropdowestratos}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='finacreditacion'>
											Sexo:
										</label>
										<Dropdown
											value={formData.finacreditacion}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														finacreditacion:
															e.value,
													})
												);
											}}
											options={dropdowsexo}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='finacreditacion'>
											Identidad de Genero:
										</label>
										<Dropdown
											value={formData.finacreditacion}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														finacreditacion:
															e.value,
													})
												);
											}}
											options={dropdowidentidadgen}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='numdocumento'>
											Fecha Nacimiento:
										</label>
										<InputText
											id='numdocumento'
											value={formData.numdocumento}
											onChange={(e) =>
												onInputChange(
													e,
													"aapenumdocumentollidope_reg"
												)
											}
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='finacreditacion'>
											Grupo Etnico:
										</label>
										<Dropdown
											value={formData.finacreditacion}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														finacreditacion:
															e.value,
													})
												);
											}}
											options={dropdowetnia}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIPaso2}>
								<div className='field col'>
									<label htmlFor='tit_ave_ing'>
										Titulo ingles:
									</label>
									<InputText
										id='tit_ave_ing'
										value={formData.tit_ave_ing}
										onChange={(e) =>
											onInputChange(e, "tit_ave_ing")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='des_ave_ing'>
										Descripcion ingles:
									</label>
									<EditorHtml
										valorinicial={formData.des_ave_ing}
										nombre='des_ave_ing'
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className='field col'>
									<label htmlFor='nor_ave_ing'>
										Nota ingles:
									</label>
									<InputText
										id='nor_ave_ing'
										value={formData.nor_ave_ing}
										onChange={(e) =>
											onInputChange(e, "nor_ave_ing")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='pre_ave_ing'>
										Prerequistos ingles:
									</label>
									<InputText
										id='pre_ave_ing'
										value={formData.pre_ave_ing}
										onChange={(e) =>
											onInputChange(e, "pre_ave_ing")
										}
									/>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIPaso3}>
								<div className='field col'>
									<label htmlFor='tit_ave_ing'>
										Titulo ingles:
									</label>
									<InputText
										id='tit_ave_ing'
										value={formData.tit_ave_ing}
										onChange={(e) =>
											onInputChange(e, "tit_ave_ing")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='des_ave_ing'>
										Descripcion ingles:
									</label>
									<EditorHtml
										valorinicial={formData.des_ave_ing}
										nombre='des_ave_ing'
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className='field col'>
									<label htmlFor='nor_ave_ing'>
										Nota ingles:
									</label>
									<InputText
										id='nor_ave_ing'
										value={formData.nor_ave_ing}
										onChange={(e) =>
											onInputChange(e, "nor_ave_ing")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='pre_ave_ing'>
										Prerequistos ingles:
									</label>
									<InputText
										id='pre_ave_ing'
										value={formData.pre_ave_ing}
										onChange={(e) =>
											onInputChange(e, "pre_ave_ing")
										}
									/>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIPaso4}>
								<div className='field col'>
									<label htmlFor='tit_ave_ing'>
										Titulo ingles:
									</label>
									<InputText
										id='tit_ave_ing'
										value={formData.tit_ave_ing}
										onChange={(e) =>
											onInputChange(e, "tit_ave_ing")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='des_ave_ing'>
										Descripcion ingles:
									</label>
									<EditorHtml
										valorinicial={formData.des_ave_ing}
										nombre='des_ave_ing'
										cambiohtml={cambiohtml}
									/>
								</div>
								<div className='field col'>
									<label htmlFor='nor_ave_ing'>
										Nota ingles:
									</label>
									<InputText
										id='nor_ave_ing'
										value={formData.nor_ave_ing}
										onChange={(e) =>
											onInputChange(e, "nor_ave_ing")
										}
									/>
								</div>

								<div className='field col'>
									<label htmlFor='pre_ave_ing'>
										Prerequistos ingles:
									</label>
									<InputText
										id='pre_ave_ing'
										value={formData.pre_ave_ing}
										onChange={(e) =>
											onInputChange(e, "pre_ave_ing")
										}
									/>
								</div>
							</TabPanel>
						</TabView>

						{/* </div> */}
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.tit_ave}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
