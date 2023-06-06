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
	Chip,
	ListBox,
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
import { AdjuntoCampo } from "../../components/crud/AdjuntoCampo";

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
	const [dropdowidioma, setdropdowidioma] = useState(null);
	const [dropdowsino, setdropdowsino] = useState(null);
	const [dropdowciudadparticipo, setdropdowciudadparticipo] = useState(null);
	const [dropdowprofecional, setdropdowprofecional] = useState(null);
	const [dropdowformaparticipacion, setdropdowformaparticipacion] = useState(
		null
	);
	let intereses = null;

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

		datatable.gettable("parametros/parametros/idioma").then((datos) => {
			setdropdowidioma(datos);
		});

		datatable.gettable("parametros/parametros/sino").then((datos) => {
			setdropdowsino(datos);
		});

		datatable
			.gettable("parametros/parametros/ciudadparticipo")
			.then((datos) => {
				setdropdowciudadparticipo(datos);
			});

		datatable
			.gettable("parametros/parametros/profesional")
			.then((datos) => {
				setdropdowprofecional(datos);
			});

		datatable
			.gettable("parametros/parametros/formaparticipacion")
			.then((datos) => {
				setdropdowformaparticipacion(datos);
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
		console.log(formData);
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
				{/* <Button
					icon='pi pi-trash'
					className='p-button-rounded p-button-warning mr-2'
					onClick={() => confirmDeleteProduct(rowData)}
				/> */}
			</div>
		);
	};

	// if (intereses) {
	// console.log(intereses);
	// }

	return (
		<div className='grid'>
			<div className='col-12'>
				<div className='card'>
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					{/* <BarraSuperior openNew={openNew} /> */}
					<TablaDatos datostabla={dataSet} titulo='Acreditados'>
						<Column
							field='nom_reg'
							header='Nombre'
							sortable
							headerStyle={{
								width: "20%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='ape_reg'
							header='Apellidos'
							sortable
							headerStyle={{
								width: "20%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='tipoacreditacion'
							header='Tipo'
							sortable
							headerStyle={{
								width: "3015%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='mai_reg'
							header='Correo'
							sortable
							headerStyle={{
								width: "10%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='estado'
							header='Status'
							sortable
							headerStyle={{
								width: "10%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='fregistro'
							header='Fecha R'
							sortable
							headerStyle={{
								width: "10%",
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
									{/* <div className='field col-6'>
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
									</div> */}

									<div className='field col-6'>
										<label htmlFor='formPart'>
											Forma de participación en el BAM:
										</label>
										<Dropdown
											value={formData.formPart}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														formPart: e.value,
													})
												);
											}}
											options={dropdowformaparticipacion}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
									<div className='field col-6'>
										<label htmlFor='partifiporegiones'>
											¿Participó en ediciones anteriores
											de BAM Regiones?::
										</label>
										<Dropdown
											value={formData.partifiporegiones}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														partifiporegiones:
															e.value,
													})
												);
											}}
											options={dropdowsino}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
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
									<div className='field col-6'>
										<label htmlFor='valorasi'>
											Valor Asignado:
										</label>
										<Dropdown
											value={formData.valorasi}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														valorasi: e.value,
													})
												);
											}}
											options={valueDropMenueventos}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>

								<div className='field col'>
									<label htmlFor='nota'>Nota:</label>
									<InputText
										id='nota'
										value={formData.nota}
										onChange={(e) =>
											onInputChange(e, "nota")
										}
									/>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='nom_reg'>
											Transacción Wompi: {formData.wompi}
										</label>
									</div>
									<div className='field col-6'>
										<label htmlFor='fape_regec_ave'>
											Código de Descuento:
											{formData.sec_coa}
										</label>
									</div>
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
										<label htmlFor='tipodocumento'>
											Tipo Documento:
										</label>
										<Dropdown
											value={formData.tipodocumento}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														tipodocumento: e.value,
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
											País de Residencia:
										</label>
										<Dropdown
											value={formData.paisresidencia}
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
										<label htmlFor='ciudadresidencia'>
											Ciudad:
										</label>
										<InputText
											id='numdocumento'
											value={formData.ciudadresidencia}
											onChange={(e) =>
												onInputChange(
													e,
													"ciudadresidencia"
												)
											}
										/>
									</div>
								</div>
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='dirresidencia'>
											Direccion:
										</label>
										<InputText
											id='dirresidencia'
											value={formData.dirresidencia}
											onChange={(e) =>
												onInputChange(
													e,
													"dirresidencia"
												)
											}
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='nacionalidad'>
											Nacionalidad:
										</label>
										<Dropdown
											value={formData.nacionalidad}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														nacionalidad: e.value,
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
										<label htmlFor='localidad'>
											Localidad:
										</label>
										<Dropdown
											value={formData.localidad}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														localidad: e.value,
													})
												);
											}}
											options={dropdowlocalidades}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='estrato'>
											Estrato:
										</label>
										<Dropdown
											value={formData.estrato}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														estrato: e.value,
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
										<label htmlFor='sexo'>Sexo:</label>
										<Dropdown
											value={formData.sexo}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														sexo: e.value,
													})
												);
											}}
											options={dropdowsexo}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='identidad'>
											Identidad de Genero:
										</label>
										<Dropdown
											value={formData.identidad}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														identidad: e.value,
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
										<label htmlFor='nacimientofecha'>
											Fecha Nacimiento:
										</label>
										<InputText
											id='nacimientofecha'
											value={formData.nacimientofecha}
											onChange={(e) =>
												onInputChange(
													e,
													"nacimientofecha"
												)
											}
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='grupoetnia'>
											Grupo Etnico:
										</label>
										<Dropdown
											value={formData.grupoetnia}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														grupoetnia: e.value,
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
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='indicativo'>
											Indicativo:
										</label>
										<Dropdown
											value={formData.indicativo}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														indicativo: e.value,
													})
												);
											}}
											options={dropdowpaises}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='telefono'>
											Teléfono:
										</label>
										<InputText
											id='telefono'
											value={formData.telefono}
											onChange={(e) =>
												onInputChange(e, "telefono")
											}
										/>
									</div>
								</div>
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='mailcontacto'>
											Correo Contacto:
										</label>
										<InputText
											id='mailcontacto'
											value={formData.mailcontacto}
											onChange={(e) =>
												onInputChange(e, "mailcontacto")
											}
										/>
									</div>
									<div className='field col-6'>
										<label htmlFor='idioma'>Idioma:</label>
										<Dropdown
											value={formData.idioma}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														idioma: e.value,
													})
												);
											}}
											options={dropdowidioma}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='partifiporegiones'>
											¿Participó en ediciones anteriores
											de BAM Regiones?::
										</label>
										<Dropdown
											value={formData.partifiporegiones}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														partifiporegiones:
															e.value,
													})
												);
											}}
											options={dropdowsino}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
									<div className='field col-6'>
										<label htmlFor='ciudadparticipo'>
											Ciudad:
										</label>
										<Dropdown
											value={formData.ciudadparticipo}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														ciudadparticipo:
															e.value,
													})
												);
											}}
											options={dropdowciudadparticipo}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='indicativopublicacion'>
											Indicativo Publicaciones:
										</label>
										<Dropdown
											value={
												formData.indicativopublicacion
											}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														indicativopublicacion:
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
										<label htmlFor='telefonopublicacion'>
											Teléfono Publicaciones:
										</label>
										<InputText
											id='telefonopublicacion'
											value={formData.telefonopublicacion}
											onChange={(e) =>
												onInputChange(
													e,
													"telefonopublicacion"
												)
											}
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='correopublicacion'>
											Correo Publicaciones:
										</label>
										<InputText
											id='correopublicacion'
											value={formData.correopublicacion}
											onChange={(e) =>
												onInputChange(
													e,
													"correopublicacion"
												)
											}
										/>
									</div>
									<div className='field col-6'>
										<label htmlFor='sectoractividad'>
											Activiadad Profesional:
										</label>
										<Dropdown
											value={formData.sectoractividad}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														sectoractividad:
															e.value,
													})
												);
											}}
											options={dropdowprofecional}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-12'>
										<label htmlFor='correopublicacion'>
											Intereses y objetivos de su
											participación
										</label>
										<ListBox
											optionLabel='name'
											options={formData.interebam}
										/>
									</div>
								</div>
								<div className='field col'>
									<label htmlFor='webempresa'>
										Otros intereses:
									</label>
									<InputText
										id='webempresa'
										value={formData.otrointeres}
										onChange={(e) =>
											onInputChange(e, "webempresa")
										}
									/>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-12'>
										<label htmlFor='correopublicacion'>
											Territorios de interés
										</label>
										<ListBox
											optionLabel='name'
											options={formData.territoriosbam}
										/>
									</div>
								</div>

								<div className='field col'>
									<label htmlFor='webempresa'>
										Otros Territorios:
									</label>
									<InputText
										id='webempresa'
										value={formData.perfilinteres}
										onChange={(e) =>
											onInputChange(e, "webempresa")
										}
									/>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIPaso3}>
								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='nombreempresa'>
											Nombre Empresa:
										</label>
										<InputText
											id='nombreempresa'
											value={formData.nombreempresa}
											onChange={(e) =>
												onInputChange(
													e,
													"nombreempresa"
												)
											}
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='nit'>Nit:</label>
										<InputText
											id='nit'
											value={formData.nit}
											onChange={(e) =>
												onInputChange(e, "nit")
											}
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='cargoempresa'>
											Cargo:
										</label>
										<InputText
											id='cargoempresa'
											value={formData.cargoempresa}
											onChange={(e) =>
												onInputChange(e, "cargoempresa")
											}
										/>
									</div>

									<div className='field col-6'>
										<label htmlFor='direccionempresa'>
											Direccion Empresa:
										</label>
										<InputText
											id='direccionempresa'
											value={formData.nit}
											onChange={(e) =>
												onInputChange(
													e,
													"direccionempresa"
												)
											}
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='indicativoempresa'>
											Indicativo Empresa:
										</label>
										<Dropdown
											value={formData.indicativoempresa}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														indicativoempresa:
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
										<label htmlFor='telefonoempresa'>
											Teléfono Empresa:
										</label>
										<InputText
											id='telefonoempresa'
											value={formData.telefonoempresa}
											onChange={(e) =>
												onInputChange(
													e,
													"telefonoempresa"
												)
											}
										/>
									</div>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='correoempresa'>
											Correo Empresa:
										</label>
										<InputText
											id='correoempresa'
											value={formData.correoempresa}
											onChange={(e) =>
												onInputChange(
													e,
													"correoempresa"
												)
											}
										/>
									</div>
									<div className='field col-6'>
										<label htmlFor='paisempresa'>
											País Empresa:
										</label>
										<Dropdown
											value={formData.paisempresa}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														paisempresa: e.value,
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
										<label htmlFor='ciudadempresa'>
											Ciudad Empresa:
										</label>
										<InputText
											id='ciudadempresa'
											value={formData.ciudadempresa}
											onChange={(e) =>
												onInputChange(
													e,
													"ciudadempresa"
												)
											}
										/>
									</div>
								</div>
								<div className='field col'>
									<label htmlFor='webempresa'>
										Página, redes sociales:
									</label>
									<InputText
										id='webempresa'
										value={formData.webempresa}
										onChange={(e) =>
											onInputChange(e, "webempresa")
										}
									/>
								</div>

								<div className='col formgrid grid'>
									<div className='field col-12'>
										<label htmlFor='correopublicacion'>
											Activodades de la Empresa
										</label>
										<ListBox
											optionLabel='name'
											options={
												formData.actividadempresabam
											}
										/>
									</div>
								</div>
								<div className='field col'>
									<label htmlFor='webempresa'>
										Otras Actividades:
									</label>
									<InputText
										id='webempresa'
										value={formData.otraactividad}
										onChange={(e) =>
											onInputChange(e, "webempresa")
										}
									/>
								</div>
							</TabPanel>

							<TabPanel headerTemplate={tabHeaderIIPaso4}>
								<div className='formgrid grid'>
									<div className='field col-6'>
										<AdjuntoCampo
											label='Fotografia'
											formData={formData}
											CampoImagen='ad1_edi'
											nombreCampo='demo'
											edicampo={formData.fotoacreditacion}
											urlupload='/upload/docs'
										/>
									</div>
								</div>
								<div className='formgrid grid'>
									<div className='field col-6'>
										<AdjuntoCampo
											label='Certificado Vinculo'
											formData={formData}
											CampoImagen='ad1_edi'
											nombreCampo='demo'
											edicampo={
												formData.certificadovinculo
											}
											urlupload='/upload/docs'
										/>
									</div>
								</div>
								<div className='formgrid grid'>
									<div className='field col-6'>
										<AdjuntoCampo
											label='Certificado Existencia'
											formData={formData}
											CampoImagen='ad1_edi'
											nombreCampo='demo'
											edicampo={
												formData.certificadoexistencia
											}
											urlupload='/upload/docs'
										/>
									</div>
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
