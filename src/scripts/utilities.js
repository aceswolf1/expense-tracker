const gastoTotalValores = (valoresAnuales) => valoresAnuales.reduce((a, b) => a + b);
const promedioTotalValores = (valoresAnuales) => gastoTotalValores(valoresAnuales) / valoresAnuales.length;
const medianaTotalValores = (valoresAnuales) => {

    const esPar = valoresAnuales.length % 2 === 0;
    const mitad = parseInt(valoresAnuales.length / 2);

    if (esPar) {
        const elemento1 = valoresAnuales[mitad - 1];
        const elemento2 = valoresAnuales[mitad];

        return (elemento1 + elemento2) / 2;
    } else {
        return valoresAnuales[mitad];
    }
}

const stringToNum = (string) => {
    const sanitazeValue = string.replace(/[^0-9.]*/g, '');
    const numberValue = parseFloat(sanitazeValue);

    return numberValue;
}

const addComasToNumber = (number) => {
    return number.toLocaleString();
}

const sortValuesLowToHigh = (arrayValues) => {
    return arrayValues.sort((a, b) => a - b);
}

const hasLetterAndOthercharacter = (string) => {
    const reg = /^[0-9]+$/;
    return string.search(reg);
}

const selectorMesesBtn = document.querySelector('.selector-mes-btn');

selectorMesesBtn.addEventListener('click', () => {
    selectorMesesBtn.closest(".selector-mes").classList.toggle('is-active');
})