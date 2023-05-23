import React from "react";
import { Button } from '../index';

export const productDialogFooter = (hideDialog, saveProduct) => (
    <>
        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={hideDialog} />
        <Button label="Guardar" icon="pi pi-check" className="p-button-success" onClick={saveProduct} />
    </>
);

export const codeBodyTemplate = rowData => {
    return (
        <>
            <span className="p-column-title">Code</span>
            {rowData.id}
        </>
    );
};



export const findIndexById = (id, datostabla) => {
    let index = -1;
    for (let i = 0; i < datostabla.length; i++) {
        if (datostabla[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};


