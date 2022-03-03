class GestorGastos {
    gastos;
    mesEnEdicion;
    gastosDelMesEnEdicion;

    listaMeses = [
        { id: 0, name: 'Enero' },
        { id: 1, name: 'Febrero' },
        { id: 2, name: 'Marzo' },
        { id: 3, name: 'Abril' },
        { id: 4, name: 'Mayo' },
        { id: 5, name: 'Junio' },
        { id: 6, name: 'Julio' },
        { id: 7, name: 'Agosto' },
        { id: 8, name: 'Septiembre' },
        { id: 9, name: 'Octubre' },
        { id: 10, name: 'Noviembre' },
        { id: 11, name: 'Diciembre' }
    ];

    constructor(gastos, mesEnEdicion) {
        this.gastos = gastos;
        this.mesEnEdicion = mesEnEdicion || new Date().getMonth();
        this.gastosDelMesEnEdicion = this.obtenerGastosDelMesEnEdicion()
    }

    definirMesEnEdicion(intMes) {
        this.mesEnEdicion = intMes;
    }

    obtenerMesEnEdicion() {
        return this.mesEnEdicion;
    }

    obtenerNombreMesEnEdicion() {
        const mesEnEdicionObj = this.listaMeses.find( mes => mes.id === this.mesEnEdicion);
        return mesEnEdicionObj.name;
    }

    obtenerGastosDelMesEnEdicion() {
        return this.gastos.filter(mes => {
            const fechaMes = new Date(mes.date).getMonth();
            return fechaMes === this.mesEnEdicion;
        });
    }

    obtenerGastosPorBusqueda(string) {
        return this.gastos.filter( gasto => gasto.description.indexOf(string) !== -1);
    }

    eliminarGasto(gastoId) {
        this.gastos.splice(this.gastos.findIndex(gasto => gasto.id === parseInt(gastoId)), 1);
        this.guardarEnLocal();
    }

    agregarGasto(description, value, date) {
        const newId = Date.now();
        this.gastos.push({
            id: newId,
            description: description,
            value: addComasToNumber(value),
            date: date.toString()
        });
        this.guardarEnLocal();
    }

    editarGasto(gastoId, newDescription, newValue) {
        const indiceGastoAEditar = this.gastos.findIndex(gasto => gasto.id === stringToNum(gastoId));
        this.gastos[indiceGastoAEditar].description = newDescription;
        this.gastos[indiceGastoAEditar].value =  newValue;
        this.guardarEnLocal();
    }

    guardarEnLocal() {
        localStorage.setItem('gastos', JSON.stringify(this.gastos));
    }
}