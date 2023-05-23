import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'appData',
  initialState: {
    counter : 10,
    loggedIn : false,
    dataSet : [], //todos los datos de la tabla
    idDsataEdit : [], //ID activo para editar
    idDsataDelete : [], //ID activo para Eliminar
    formData : {}, //Objeto con los datos del formulario
    xtoken : '' 
  },
  reducers: {
    increment: (state) => {
      state.counter += 1
    },
    logOff: (state) => {
      state.loggedIn = false
      state.xtoken = ''
      state.dataSet=[]
      state.formData={}
    },
    logInn: (state ,token) => {
      // console.log(token.payload)
      state.loggedIn = true
      state.xtoken = token.payload
      state.formData={}
    },
    setDataSet: (state, data) => {
      // console.log('estamos en setDataSet', state, data)
      if(data.payload===0){
        console.log('memorai algo salio mal');
        state.loggedIn = false
        window.location.replace("#/");
      } else {
        state.dataSet=data.payload
      }
    },
    setFormData: (state, formEmpty) => {
      // console.log('carga info inicial del formulario', formEmpty)
      state.formData=formEmpty.payload
    },
    leerdata : ()=>{
      // console.log(formData)
    }

  },
})

// Action creators are generated for each case reducer function
export const { setFormData, formData ,setDataSet, increment, decrement,  incrementByAmount, logOff, logInn , leerdata} = appSlice.actions

// export default appSlice.reducer