let coleccion = [];

function guardarMonedas() { 
    localStorage.setItem("monedas", JSON.stringify(coleccion)); 
}

function crearMoneda(pais, anio, edicion, material, valor) {
    return { id: Date.now() + Math.random(), pais, anio, edicion, material, valor, vendida: false, valorVenta: 0 };
}

async function cargarMonedasPrecargadas() {
    try {
        const res = await fetch('Monedas/monedas.json');
        if (!res.ok) throw new Error();
        const data = await res.json();
        coleccion = data.map(m => ({
            ...m,
            id: Date.now() + Math.random(),
            vendida: false,
            valorVenta: 0
        }));
        guardarMonedas();
    } catch (err) { console.error(err); }
}

async function inicializarColeccion() {
    if (localStorage.getItem("monedas")) {
        const { isConfirmed } = await Swal.fire({
            title: 'Datos existentes',
            text: 'Se encontraron datos preexistentes en el local storage. ¿Desea continuar con ellos?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        });
        if (isConfirmed) {
            coleccion = JSON.parse(localStorage.getItem("monedas"));
        } else {
            localStorage.removeItem("monedas");
            await cargarMonedasPrecargadas();
        }
    } else {
        await cargarMonedasPrecargadas();
    }
}
