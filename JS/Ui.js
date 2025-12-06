const botonMostrarFormulario = document.getElementById("btnMostrarForm");
const botonVaciarColeccion = document.getElementById("btnVaciar");
const contenedorFormulario = document.getElementById("contenedorForm");
const formularioMoneda = document.getElementById("formMoneda");
const listaMonedas = document.getElementById("listaMonedas");

botonMostrarFormulario.onclick = () => {
    const visible = contenedorFormulario.style.display === "block";
    contenedorFormulario.style.display = visible ? "none" : "block";
    botonMostrarFormulario.textContent = visible ? "Agregar Moneda" : "Cerrar formulario";
};

function actualizarResumenFinanciero() {
    const inversionTotal = coleccionMonedas.reduce((total, moneda) => total + Number(moneda.valor), 0);
    const monedasVendidas = coleccionMonedas.filter(moneda => moneda.vendida);
    const inversionVendidas = monedasVendidas.reduce((total, moneda) => total + Number(moneda.valor), 0);
    const totalVendidas = monedasVendidas.reduce((total, moneda) => total + Number(moneda.valorVenta), 0);
    const ganancia = monedasVendidas.reduce((total, moneda) => total + (moneda.valorVenta - moneda.valor), 0);

    document.getElementById("inversionTotal").textContent = inversionTotal.toFixed(2);
    document.getElementById("inversionVendidas").textContent = inversionVendidas.toFixed(2);
    document.getElementById("totalVendidas").textContent = totalVendidas.toFixed(2);
    document.getElementById("gananciaTotal").textContent = ganancia.toFixed(2);
}

function mostrarColeccion() {
    listaMonedas.innerHTML = "";

    if (coleccionMonedas.length === 0) {
        listaMonedas.innerHTML = "<p>No hay monedas en la colección.</p>";
        return;
    }

    for (const moneda of coleccionMonedas) {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("moneda");
        if (moneda.vendida) tarjeta.classList.add("vendida");

        tarjeta.innerHTML = `
            <p><strong>${moneda.pais} (${moneda.anio})</strong></p>
            <p>Edición: ${moneda.edicion}</p>
            <p>Material: ${moneda.material}</p>
            <p>Valor: $${moneda.valor}</p>
            <button class="btnEliminar" id="eliminar-${moneda.id}">Eliminar</button>
            <button class="btnVendida" id="vender-${moneda.id}" ${moneda.vendida ? "disabled" : ""}>
                ${moneda.vendida ? "Vendida" : "Marcar Vendida"}
            </button>
        `;

        listaMonedas.appendChild(tarjeta);

        document.getElementById(`eliminar-${moneda.id}`).onclick = () => {
            eliminarMoneda(moneda.id);
            mostrarColeccion();
            actualizarResumenFinanciero();
        };

        document.getElementById(`vender-${moneda.id}`).onclick = async () => {
            const venta = await Swal.fire({
                title: "Valor de venta",
                input: "number",
                inputLabel: "Ingrese el valor de venta",
                showCancelButton: true
            });

            if (!venta.value || venta.value <= 0) return;

            moneda.vendida = true;
            moneda.valorVenta = Number(venta.value);

            guardarColeccion();
            mostrarColeccion();
            actualizarResumenFinanciero();
        };
    }
}

formularioMoneda.onsubmit = evento => {
    evento.preventDefault();

    const pais = document.getElementById("pais").value;
    const anio = document.getElementById("anio").value;
    const edicion = document.getElementById("edicion").value;
    const material = document.getElementById("material").value;
    const valor = document.getElementById("valor").value;

    if (!pais.trim() || !anio.trim()) return Swal.fire("Error", "País y año obligatorios", "error");
    if (anio < 1000 || anio > 2050) return Swal.fire("Error", "Año inválido", "error");
    if (valor < 0) return Swal.fire("Error", "Valor negativo", "error");
    if (edicion === "") return Swal.fire("Error", "Seleccione una edición", "error");

    const nuevaMoneda = generarMoneda(pais, anio, edicion, material, valor);

    coleccionMonedas.push(nuevaMoneda);
    guardarColeccion();
    mostrarColeccion();
    actualizarResumenFinanciero();

    formularioMoneda.reset();
    botonMostrarFormulario.click();
};

botonVaciarColeccion.onclick = () => {
    Swal.fire({
        title: "¿Vaciar colección?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar"
    }).then(decision => {
        if (decision.isConfirmed) {
            coleccionMonedas = [];
            guardarColeccion();
            mostrarColeccion();
            actualizarResumenFinanciero();
        }
    });
};

async function iniciarInterfaz() {
    await inicializarColeccion();
    mostrarColeccion();
    actualizarResumenFinanciero();
}

iniciarInterfaz();
