const btnMostrarForm = document.getElementById("btnMostrarForm");
const btnVaciar = document.getElementById("btnVaciar");
const contenedorForm = document.getElementById("contenedorForm");
const formMoneda = document.getElementById("formMoneda");
const listaMonedas = document.getElementById("listaMonedas");

btnMostrarForm.onclick = () => {
    const visible = contenedorForm.style.display === "block";
    contenedorForm.style.display = visible ? "none" : "block";
    btnMostrarForm.textContent = visible ? "Agregar Moneda" : "Cerrar formulario";
};

function actualizarResumen() {
    const inversionTotal = coleccion.reduce((acc, m) => acc + parseFloat(m.valor), 0);
    const monedasVendidas = coleccion.filter(m => m.vendida);
    const inversionVendidas = monedasVendidas.reduce((acc, m) => acc + parseFloat(m.valor), 0);
    const totalVendidas = monedasVendidas.reduce((acc, m) => acc + parseFloat(m.valorVenta), 0);
    const ganancia = monedasVendidas.reduce((acc, m) => acc + (parseFloat(m.valorVenta) - parseFloat(m.valor)), 0);

    document.getElementById("inversionTotal").textContent = inversionTotal.toFixed(2);
    document.getElementById("inversionVendidas").textContent = inversionVendidas.toFixed(2);
    document.getElementById("totalVendidas").textContent = totalVendidas.toFixed(2);
    document.getElementById("gananciaTotal").textContent = ganancia.toFixed(2);
}

function mostrarMonedas() {
    listaMonedas.innerHTML = "";
    if (coleccion.length === 0) { listaMonedas.innerHTML = "<p>No hay monedas en la colección.</p>"; return; }

    coleccion.map(moneda => {
        const card = document.createElement("div");
        card.classList.add("moneda");
        if (moneda.vendida) card.classList.add("vendida");
        card.innerHTML = `
            <p><strong>${moneda.pais} (${moneda.anio})</strong></p>
            <p>Edición: ${moneda.edicion}</p>
            <p>Material: ${moneda.material}</p>
            <p>Valor: $${moneda.valor}</p>
            <button class="btnEliminar" id="del-${moneda.id}">Eliminar</button>
            <button class="btnVendida" id="vend-${moneda.id}" ${moneda.vendida ? 'disabled' : ''}>${moneda.vendida ? 'Vendida' : 'Marcar Vendida'}</button>
        `;
        listaMonedas.appendChild(card);

        document.getElementById(`del-${moneda.id}`).onclick = () => {
            coleccion = coleccion.filter(m => m.id !== moneda.id);
            localStorage.setItem("monedas", JSON.stringify(coleccion));
            mostrarMonedas();
            actualizarResumen();
        };

        document.getElementById(`vend-${moneda.id}`).onclick = async () => {
            const { value: valorVenta } = await Swal.fire({
                title: 'Valor de venta',
                input: 'number',
                inputLabel: 'Ingrese el valor de venta de la moneda',
                inputAttributes: { min: 0 },
                showCancelButton: true
            });
            if (!valorVenta || valorVenta <= 0) return Swal.fire('Error', 'Valor de venta inválido', 'error');
            moneda.vendida = true;
            moneda.valorVenta = parseFloat(valorVenta);
            localStorage.setItem("monedas", JSON.stringify(coleccion));
            mostrarMonedas();
            actualizarResumen();
        };
    });
}

formMoneda.onsubmit = e => {
    e.preventDefault();
    const pais = document.getElementById("pais").value;
    const anio = parseInt(document.getElementById("anio").value);
    const edicion = document.getElementById("edicion").value;
    const material = document.getElementById("material").value;
    const valor = parseFloat(document.getElementById("valor").value);

    if (!pais.trim() || !anio) return Swal.fire('Error', 'País y Año son obligatorios', 'error');
    if (anio < 1000 || anio > 2050) return Swal.fire('Error', 'El año ingresado no es válido', 'error');
    if (valor < 0) return Swal.fire('Error', 'El valor no puede ser negativo', 'error');
    if (edicion === "") return Swal.fire('Error', 'Debe seleccionar una edición.', 'error');

    const nueva = { id: Date.now() + Math.random(), pais, anio, edicion, material, valor, vendida: false, valorVenta: 0 };
    coleccion.push(nueva);
    localStorage.setItem("monedas", JSON.stringify(coleccion));
    mostrarMonedas();
    actualizarResumen();
    formMoneda.reset();
    btnMostrarForm.click();
};

btnVaciar.onclick = () => {
    Swal.fire({
        title: '¿Desea vaciar toda la colección?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            localStorage.removeItem('monedas');
            coleccion.length = 0;
            mostrarMonedas();
            actualizarResumen();
            Swal.fire('Colección vaciada', '', 'success');
        }
    });
};

async function iniciarUI() {
    try {
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
                await cargarMonedasDesdeJSON();
            }
        } else {
            await cargarMonedasDesdeJSON();
        }
        mostrarMonedas();
        actualizarResumen();
    } catch {
        Swal.fire('Error', 'No se pudieron cargar las monedas.', 'error');
    }
}

async function cargarMonedasDesdeJSON() {
    try {
        const res = await fetch('Monedas/monedas.json');
        if (!res.ok) throw new Error();
        const data = await res.json();
        coleccion = data.map(m => ({ ...m, id: Date.now() + Math.random(), vendida: false, valorVenta: 0 }));
        localStorage.setItem("monedas", JSON.stringify(coleccion));
    } catch {
        Swal.fire('Error', 'No se pudo cargar el archivo monedas.json', 'error');
    }
}

iniciarUI();
