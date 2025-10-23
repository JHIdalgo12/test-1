let coleccion = [];
let recolectando = true;

function agregarMoneda() {
    coleccion.push({ pais: '', anio: '', edicion: '', material: '', valor: '' });
    let i = coleccion.length - 1;

    coleccion[i].pais = prompt(`Ingresa el país de  origen de la moneda ${i + 1}:`);
    coleccion[i].anio = prompt(`Ingresa el año de la moneda ${i + 1}:`);
    coleccion[i].edicion = prompt(`Ingresa la edición de la moneda ${i + 1}:`);
    coleccion[i].material = prompt(`Ingresa el material de la moneda ${i + 1}:`);
    coleccion[i].valor = prompt(`Ingresa el valor en $ de la moneda ${i + 1}:`);

    console.log("✅ Moneda agregada a la colección.");
}

while (recolectando) {
    let respuesta = prompt("¿Quieres coleccionar una moneda? (sí/no)").toLowerCase();

    switch (respuesta) {
        case 'si':
            agregarMoneda();
            recolectando = true;
            break;

        case 'no':
            recolectando = false;
            break;

        default:
            alert("❌ Respuesta inválida. Por favor responde 'sí' o 'no'.");
            recolectando = true;
    }
}

console.log("📀 Monedas coleccionadas:");
console.log(coleccion);

if (coleccion.length > 0) {
    console.log(`💰 Las monedas coleccionadas al momento son:`);
    for (let i = 0; i < coleccion.length; i++) {
        let moneda = coleccion[i];
        console.log(
            "La Moneda " + (i + 1) + ": Es del país " + moneda.pais + ", del año " + moneda.anio + ", de la edición " + moneda.edicion + ", hecha del material " + moneda.material + " y con un valor en $ de  " + moneda.valor + "."
        );
    }
} else {
    console.log("No se coleccionaron monedas.");
}
