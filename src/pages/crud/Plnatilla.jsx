import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Column, Toast, Button, Dialog, InputText } from "../../components/crud";
import { Conexion } from "../../service/Conexion";
import { TablaDatos } from "../../components/crud/tabla/TablaDatos";
import { BarraSuperior } from "../../components/crud/tabla/BarraSuperior";
import { EliminarVentana } from "../../components/crud/EliminarVentana";
import { codeBodyTemplate, productDialogFooter, findIndexById } from "../../components/crud/tabla/Funciones";
import { ItemsPlantilla } from './ItemsPlantilla';
import { InputNumber } from 'primereact/inputnumber';

export const Plantilla = () => {
    let emptyProduct = {
        id: null,
        nombre: "",
        factor: "0"
    };
    const TABLA = "plantillas";
    const titulo = "SubPartidas";

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    const [datostabla, setdatostabla] = useState(null);
    const datatable = new Conexion();

    useEffect(() => {
        datatable.gettable(TABLA).then(data => setdatostabla(data));
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
        console.log('guardado de plantilla');
        setSubmitted(true);
        let resultado = "";
        let _products = [...datostabla];
        let _product = { ...product };
        if (product.nombre.trim()) {
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
            resultado.then(value => {
                toast.current.show({
                    severity: "success",
                    summary: "Confirmacion",
                    detail: "Transacción Exitosa",
                    life: 4000
                });
                setProductDialog(false);
                setProduct(emptyProduct);
            });
        }
    };

    const editProduct = (product, id) => {
        setProduct({ ...product });
        datatable.getItem(TABLA, id).then(data => setProduct(data.data));
        setProductDialog(true);
    };

    const confirmDeleteProduct = product => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = datostabla.filter(val => val.id !== product.id);
        setdatostabla(_products);
        let resultado = datatable.getEliminarItem(TABLA, product, product.id);
        resultado.then(value => {
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({
                severity: "success",
                summary: "Confirmacion",
                detail: "Transacción Exitosa",
                life: 4000
            });
        });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const actionBodyTemplate = rowData => {
        return (
            <div
                className="actions"
                style={{
                    display: "flex"
                }}
            >
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData, rowData.id)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

     const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <BarraSuperior openNew={openNew} />
                    <TablaDatos datostabla={datostabla} titulo={titulo} >
                        {/* <Column field="id" header="ID" sortable body={codeBodyTemplate} headerStyle={{ width: "10%", minWidth: "10rem" }}></Column> */}
                        <Column field="nombre" header="Nombre" sortable headerStyle={{ width: "90%", minWidth: "10rem" }}></Column>

                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </TablaDatos>

                    <Dialog visible={productDialog} style={{ width: "75%" }} header="Detalle Subpartida" modal className="p-fluid" footer={productDialogFooter(hideDialog, saveProduct)} onHide={hideDialog}>
                       
                        
                        <div className="formgrid grid">
                             <div className="field col">
                            <label htmlFor="name">Nombre:</label>
                            <InputText
                                id="nombre"
                                value={product.nombre}
                                onChange={e => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !product.nombre
                                })}
                            />
                            {submitted && !product.nombre && <small className="p-invalid">Campo requerido.</small>}
                        </div>
                            <div className="field ">
                                <label htmlFor="factor">Factor</label>
                                <InputNumber id="factor" mode="decimal" maxFractionDigits={2} value={product.factor} onValueChange={e => onInputNumberChange(e, "factor")} />
                            </div>

                        </div>
                        {
                            product?.id >0 &&  <ItemsPlantilla llave={product?.id} />
                        }

{/* <pre>{JSON.stringify(product)}</pre> */}
						
                    </Dialog>
                    <EliminarVentana deleteProductDialog={deleteProductDialog} product={product} hideDeleteProductDialog={hideDeleteProductDialog} deleteProduct={deleteProduct} />
                </div>
            </div>
        </div>
    );
};
