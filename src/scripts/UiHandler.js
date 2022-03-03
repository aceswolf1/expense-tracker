class UiHandler {
    mostrarGastos = (arregloGastos, nombreMes) => {
        const tablaMesCuerpoEl = document.getElementById('tabla-mes-cuerpo');
        const mesSeleccionadoEl = document.getElementById('mes-seleccionado-texto');

        tablaMesCuerpoEl.innerHTML = '';
        mesSeleccionadoEl.innerText = nombreMes;

        if (arregloGastos.length === 0) {
            tablaMesCuerpoEl.innerHTML =
                `   
                <p class="has-text-weight-bold has-text-centered">No hay gastos en este mes</p>
            `;
        } else {
            arregloGastos.forEach(activity => {
                const tableRow = document.createElement('tr');
                tableRow.dataset.rowId = `${activity.id}`;
                tableRow.innerHTML =
                    `
                <th class="row-id">
                    <p>${activity.id}</p>
                </th>
                <td class="row-name">
                    <p>${activity.description}</p>
                </td>
                <td class="row-value">
                    <p>$${addComasToNumber(stringToNum(activity.value))}</p>
                </td>
                <td>
                    <button data-activity-id="${activity.id}" class="edit-button button is-small is-warning">
                        <span class="icon is-small">
                            <i class="fas fa-edit"></i>
                        </span>
                    </button>
                </td>
                <td>
                    <button data-activity-id="${activity.id}" class="delete-button button is-small is-danger">
                        <span class="icon is-small">
                            <i class="far fa-trash-alt"></i>
                        </span>
                    </button>
                </td>
                `;

                tablaMesCuerpoEl.appendChild(tableRow);
            });
        }

    }

    mostrarValores = (arregloGastos) => {
        const gastoTotalDelMesEl = document.getElementById('gastos-totales-el');
        const promedioGastosMesEl = document.getElementById('promedio-total-el');
        const medianaGastosMesEl = document.getElementById('mediana-total-el');
        const mayorGastosMesEl = document.getElementById('gasto-costoso-el');

        if (arregloGastos.length !== 0) {
            const cifrasDeLosGastos = arregloGastos.map(gasto => {
                return stringToNum(gasto.value);
            });
            const sortedValues = sortValuesLowToHigh(cifrasDeLosGastos);

            gastoTotalDelMesEl.innerText = `$${addComasToNumber(gastoTotalValores(cifrasDeLosGastos))}`;
            promedioGastosMesEl.innerText = `$${addComasToNumber(promedioTotalValores(cifrasDeLosGastos))}`;
            medianaGastosMesEl.innerText = `$${addComasToNumber(medianaTotalValores(cifrasDeLosGastos))}`;
            mayorGastosMesEl.innerText = `$${addComasToNumber(sortedValues[sortedValues.length - 1])}`;
        } else {
            gastoTotalDelMesEl.innerText = `No hay gastos este mes`;
            promedioGastosMesEl.innerText = `No hay gastos este mes`;
            medianaGastosMesEl.innerText = `No hay gastos este mes`;
            mayorGastosMesEl.innerText = `No hay gastos este mes`;
        }
    }

    agregarFuncionEliminarGasto() {
        const deleteActivityEls = document.querySelectorAll('.delete-button');

        deleteActivityEls.forEach(btn => {
            btn.addEventListener('click', () => {
                const gastoId = btn.closest('tr').dataset.rowId;
                gestor.eliminarGasto(gastoId);
                this.renderizarInformación(gestor.obtenerGastosDelMesEnEdicion(), gestor.obtenerNombreMesEnEdicion());
            });
        })
    }

    agregarFuncionAdicionarGasto() {
        const newNameExpEl = document.getElementById('nombre-gasto-nuevo');
        const newValueExpEl = document.getElementById('gasto-nuevo');
        const addNewExpBtnEl = document.getElementById('agregar-gasto-btn');

        newValueExpEl.addEventListener('input', (e) => {
            if (e.target.value === '') {
                newValueExpEl.value = '';
            } else {
                newValueExpEl.value = `$${addComasToNumber(stringToNum(e.target.value))}`;
            }
        });

        addNewExpBtnEl.addEventListener('click', () => {
            let newDescription;
            let newValue;
            let newDate;

            const errorMessagesels = document.querySelectorAll('.error-message');

            if (errorMessagesels.length !== 0) {
                newValueExpEl.classList.remove('is-danger');
                newNameExpEl.classList.remove('is-danger');
                errorMessagesels.forEach(el => {
                    el.remove();
                });
            }

            const newExpName = newNameExpEl.value;
            const newExpValue = newValueExpEl.value;

            if ((newExpName === '' || newExpName === undefined) || (newExpValue === '' || newExpValue === undefined)) {
                const errorMessage = document.createElement('p');
                errorMessage.style.color = 'red';
                errorMessage.innerText = 'El gasto debe tener un nombre';
                errorMessage.classList.add('is-size-7');
                errorMessage.classList.add('error-message');
                newNameExpEl.classList.add('is-danger');
                document.getElementById('gasto-nuevo-input-contenedor').appendChild(errorMessage);

                const errorMessage2 = document.createElement('p');
                errorMessage2.style.color = 'red';
                errorMessage2.innerText = 'El gasto debe tener un valor';
                errorMessage2.classList.add('is-size-7');
                errorMessage2.classList.add('error-message');
                newValueExpEl.classList.add('is-danger');
                document.getElementById('gasto-nuevo-valor-input-contenedor').appendChild(errorMessage2);
            } else {
                newDescription = newExpName;
                newValue = stringToNum(newExpValue);
                newDate = new Date();
                newDate.setMonth(gestor.obtenerMesEnEdicion());
                newNameExpEl.value = '';
                newValueExpEl.value = '';
                gestor.agregarGasto(newDescription, newValue, newDate);
                uiHandler.renderizarInformación(gestor.obtenerGastosDelMesEnEdicion(), gestor.obtenerNombreMesEnEdicion());
            }
        });
    }

    agregarFuncionEdicionGasto() {
        const editActivityBtnEls = document.querySelectorAll('.edit-button');

        editActivityBtnEls.forEach(btn => {
            btn.addEventListener('click', () => {
                const activityId = btn.dataset.activityId;

                document.querySelectorAll('.edit-button').forEach(btn => {
                    btn.classList.remove('is-hidden');
                });

                btn.classList.add('is-hidden');

                if (document.getElementById('in-editing-btns') !== null) {
                    document.getElementById('in-editing-btns').remove();
                    document.querySelectorAll('.new-input').forEach(input => {
                        input.remove();
                    })

                    document.querySelectorAll('.row-name p').forEach(row => {
                        row.style.display = 'inherit';
                    });

                    document.querySelectorAll('.row-value p').forEach(row => {
                        row.style.display = 'inherit';
                    });
                }

                const fatherElement = btn.closest('td');
                const cellContainer = btn.closest('tr');

                const editDeleteBtnContainer = document.createElement('div');
                const onEditOkayBtnEl = document.createElement('button');
                const onEditCancelBtnEl = document.createElement('button');

                const newNameInput = document.createElement('input');
                const newValueInput = document.createElement('input');

                const nameCell = cellContainer.querySelector('.row-name');
                const valueCell = cellContainer.querySelector('.row-value');

                const nameCellValue = nameCell.querySelector('p');
                const valueCellValue = valueCell.querySelector('p');

                newNameInput.classList.add('input');
                newNameInput.classList.add('new-input');
                newNameInput.id = 'new-input';
                newNameInput.type = 'text';

                newValueInput.classList.add('input');
                newValueInput.classList.add('new-input');
                newValueInput.id = 'new-value';
                newValueInput.type = 'text';

                editDeleteBtnContainer.id = 'in-editing-btns';

                onEditOkayBtnEl.classList.add('on-edit-btn-ok');
                onEditOkayBtnEl.classList.add('is-small');
                onEditOkayBtnEl.classList.add('button');
                onEditOkayBtnEl.classList.add('is-success');
                onEditOkayBtnEl.innerHTML =
                    `
                    <span class="icon is-small">
                        <i class="fas fa-check"></i>
                    </span>
                `
                    ;
                onEditCancelBtnEl.classList.add('on-edit-btn-ok');
                onEditCancelBtnEl.classList.add('is-small');
                onEditCancelBtnEl.classList.add('button');
                onEditCancelBtnEl.classList.add('is-danger');
                onEditCancelBtnEl.innerHTML =
                    `
                    <span class="icon is-small">
                        <i class="fas fa-times"></i>
                    </span>
                `
                    ;
                onEditOkayBtnEl.addEventListener('click', () => {
                    let newName;
                    let newValue;
                    let ActivityId = activityId;
                    const newNameExpEl = document.getElementById('new-input');
                    const newValueExpEl = document.getElementById('new-value');
                    const errorMessagesels = document.querySelectorAll('.error-message-edit');

                    if (errorMessagesels.length !== 0) {
                        newValueExpEl.classList.remove('is-danger');
                        newNameExpEl.classList.remove('is-danger');
                        errorMessagesels.forEach(el => {
                            el.remove();
                        });
                    }

                    const newExpName = newNameExpEl.value;
                    const newExpValue = newValueExpEl.value;

                    if ((newExpName === '' || newExpName === undefined) || (newExpValue === '' || newExpValue === undefined)) {
                        const errorMessage = document.createElement('p');
                        errorMessage.style.color = 'red';
                        errorMessage.innerText = 'El gasto debe tener un nombre';
                        errorMessage.classList.add('is-size-7');
                        errorMessage.classList.add('error-message-edit');
                        newNameExpEl.classList.add('is-danger');
                        document.getElementById('new-name').appendChild(errorMessage);

                        const errorMessage2 = document.createElement('p');
                        errorMessage2.style.color = 'red';
                        errorMessage2.innerText = 'El gasto debe tener un valor';
                        errorMessage2.classList.add('is-size-7');
                        errorMessage2.classList.add('error-message-edit');
                        newValueExpEl.classList.add('is-danger');
                        document.getElementById('new-value').appendChild(errorMessage2);
                    } else {
                        newName = newExpName;
                        newValue = addComasToNumber(stringToNum(newExpValue));
                        newNameExpEl.value = '';
                        newValueExpEl.value = '';
                        gestor.editarGasto(activityId, newName, newValue);
                        this.renderizarInformación(gestor.obtenerGastosDelMesEnEdicion(), gestor.obtenerNombreMesEnEdicion());
                    }
                });

                onEditCancelBtnEl.addEventListener('click', () => {
                    btn.classList.remove('is-hidden');
                    editDeleteBtnContainer.remove();
                    newNameInput.remove();
                    newValueInput.remove();
                    nameCellValue.style.display = 'inherit';
                    valueCellValue.style.display = 'inherit';
                });

                editDeleteBtnContainer.appendChild(onEditOkayBtnEl);
                editDeleteBtnContainer.appendChild(onEditCancelBtnEl);
                fatherElement.appendChild(editDeleteBtnContainer);

                newNameInput.value = nameCellValue.innerText;
                newValueInput.value = valueCellValue.innerText;

                nameCellValue.style.display = 'none';
                valueCellValue.style.display = 'none';

                nameCell.appendChild(newNameInput);
                valueCell.appendChild(newValueInput);

                newValueInput.addEventListener('input', (e) => {
                    if (e.target.value === '') {
                        newValueInput.value = '';
                    } else {
                        newValueInput.value = `$${addComasToNumber(stringToNum(e.target.value))}`;
                    }
                });
            });
        });
    }

    agregarFuncionSeleccionarMes(arregloMeses) {
        const dropDownSeleccionMesEl = document.getElementById('seleccion-mes');

        arregloMeses.forEach(month => {
            const listElement = document.createElement('a');
            listElement.dataset.id = `${month.id}`;
            listElement.classList.add('dropdown-item');
            listElement.innerText = `${month.name}`;

            listElement.addEventListener('click', () => {
                selectorMesesBtn.closest(".selector-mes").classList.remove('is-active');
                /**
                 * Esta parte del código se debe mejorar, 
                 * una clase está usando métodos de la otra
                 * para dibujar el doom.
                 */
                gestor.definirMesEnEdicion(month.id);
                this.renderizarInformación(gestor.obtenerGastosDelMesEnEdicion(), gestor.obtenerNombreMesEnEdicion());
            });

            dropDownSeleccionMesEl.appendChild(listElement);
        });

    }

    agregarFuncionBusqueda(arregloMeses) {
        const searchEl = document.getElementById('busqueda');

        searchEl.addEventListener('keyup', (e) => {
            const searchResults = gestor.obtenerGastosPorBusqueda(searchEl.value);
            uiHandler.renderizarInformación(searchResults, 'Búsqueda');
        });
    }

    renderizarInformación(arregloGastos, nombreMes) {
        this.mostrarGastos(arregloGastos, nombreMes);
        this.mostrarValores(arregloGastos);
        this.agregarFuncionEliminarGasto();
        this.agregarFuncionEdicionGasto();
    }
}