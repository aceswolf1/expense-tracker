/**
 * currentMonth: mes en el que se agrega el gasto
 * gestorDeGastos: es el que se encarga de recibir el gasto nuevo y ponerlo en la lista de gastos.
 * así como eliminarlos, o editarlos.
 * gasto: es la unidad
 * 
 */
const fecha = new Date();
const mesEditar = {
    intMes: fecha.getMonth(),
    stringMes: fecha.toLocaleString('default', { month: 'long' })
};

let gastos;

if (localStorage.getItem('gastos')) {
    gastos = gastosAlt;
} else {
    gastos = gastosAlt;
}

const gestor = new GestorGastos(gastos, mesEditar.intMes);
const uiHandler = new UiHandler();
uiHandler.agregarFuncionAdicionarGasto();
uiHandler.agregarFuncionSeleccionarMes(gestor.listaMeses);
uiHandler.agregarFuncionBusqueda();
uiHandler.renderizarInformación(gestor.obtenerGastosDelMesEnEdicion(), gestor.obtenerNombreMesEnEdicion());