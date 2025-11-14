document.addEventListener("DOMContentLoaded", () => {
    let coleccion = cargarMonedas();

    const btnMostrarForm = document.getElementById("btnMostrarForm");
    const contenedorForm = document.getElementById("contenedorForm");
    const formMoneda = document.getElementById("formMoneda");
    const listaMonedas = document.getElementById("listaMonedas");

    function cargarMonedas() {
        const data = localStorage.getItem("monedas");
        return data ? JSON.parse(data) : [];
    }

    function guardarMonedas(Monedas) {
        localStorage.setItem("monedas", JSON.stringify(Monedas));
    }

    function crearMoneda(pais, anio, edicion, material, valor) {
        return { pais, anio, edicion, material, valor };
    }

    function campoVacio(valor) {
        return valor.trim() === "";
    }

    function abcerrformu() {
        if (contenedorForm.style.display === "none") {
            contenedorForm.style.display = "block";
            btnMostrarForm.textContent = "Cerrar Formulario";
        } else {
            contenedorForm.style.display = "none";
            btnMostrarForm.textContent = "Agregar Moneda";
        }
    }

    btnMostrarForm.addEventListener("click", abcerrformu);

    function mostrarMonedas() {
        listaMonedas.innerHTML = "";

        if (coleccion.length === 0) {
            listaMonedas.innerHTML = "<p>No hay monedas en la colección.</p>";
            return;
        }

        let contador = 1;

        for (const moneda of coleccion) {
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("moneda");

            tarjeta.innerHTML = `
                <p><strong>Moneda ${contador}</strong></p>
                <p>País: ${moneda.pais}</p>
                <p>Año: ${moneda.anio}</p>
                <p>Edición: ${moneda.edicion}</p>
                <p>Material: ${moneda.material}</p>
                <p>Valor: $${moneda.valor}</p>
                <button class="btnEliminar" data-id="${contador - 1}">Eliminar</button>
            `;

            listaMonedas.appendChild(tarjeta);
            contador++;
        }

        
    }

    

    formMoneda.addEventListener("submit", (e) => {
        e.preventDefault();

        const pais = document.getElementById("pais").value;
        const anio = document.getElementById("anio").value;
        const edicion = document.getElementById("edicion").value;
        const material = document.getElementById("material").value;
        const valor = document.getElementById("valor").value;

        if (campoVacio(pais) || campoVacio(anio)) {
            alert("Por favor completa los campos obligatorios Pais y Anio");
            return;
        }

        const nuevaMoneda = crearMoneda(pais, anio, edicion, material, valor);

        coleccion.push(nuevaMoneda);
        guardarMonedas(coleccion);
        mostrarMonedas();

        formMoneda.reset();
        abcerrformu();
    });

    mostrarMonedas();
});
