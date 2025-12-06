let coleccionMonedas = [];

function guardarColeccion() {
    localStorage.setItem("monedas", JSON.stringify(coleccionMonedas));
}

function generarMoneda(pais, anio, edicion, material, valor) {
    return {
        id: Date.now() + Math.random(),
        pais,
        anio,
        edicion,
        material,
        valor,
        vendida: false,
        valorVenta: 0
    };
}

function verificarMoneda(pais, anio, valor) {
    if (!pais.trim() || !anio.trim()) return "País y año obligatorios";
    if (anio < 1000 || anio > 2050) return "Año inválido";
    if (valor < 0) return "Valor negativo no permitido";
    return null;
}

function eliminarMoneda(id) {
    coleccionMonedas = coleccionMonedas.filter(moneda => moneda.id !== id);
    guardarColeccion();
}

async function cargarMonedasDesdeJSON() {
    try {
        const respuesta = await fetch("Monedas/monedas.json");
        const datosMonedas = await respuesta.json();

        coleccionMonedas = datosMonedas.map(moneda => ({
            ...moneda,
            id: Date.now() + Math.random(),
            vendida: false,
            valorVenta: 0
        }));

        guardarColeccion();
    } catch (error) {
        console.error("No se pudo cargar monedas.json");
    }
}

async function inicializarColeccion() {
    const coleccionGuardada = localStorage.getItem("monedas");

    if (coleccionGuardada) {
        const decision = await Swal.fire({
            title: "Datos existentes",
            text: "¿Desea mantener la colección guardada?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No"
        });

        if (decision.isConfirmed) {
            coleccionMonedas = JSON.parse(coleccionGuardada);
        } else {
            localStorage.removeItem("monedas");
            await cargarMonedasDesdeJSON();
        }
    } else {
        await cargarMonedasDesdeJSON();
    }
}
