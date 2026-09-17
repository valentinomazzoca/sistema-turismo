const API_URL = "http://localhost:3000/api";
const RESERVAS_URL = `${API_URL}/reservas`;

const form = document.getElementById("reservaForm");
const mensaje = document.getElementById("mensaje");
const resultado = document.getElementById("resultado");
const catalogo = document.getElementById("catalogo");
const clientesLista = document.getElementById("clientesLista");

const renderActividades = (actividades) => {
    if (!catalogo) return;

    if (!Array.isArray(actividades) || actividades.length === 0) {
        catalogo.innerHTML = "<p>No hay actividades disponibles.</p>";
        return;
    }

    catalogo.innerHTML = actividades
        .map(
            (actividad) => `
                <article class="card">
                    <h3>${actividad.nombre}</h3>
                    <p>${actividad.descripcion || "Sin descripción"}</p>
                    <p><strong>Duración:</strong> ${actividad.duracion || "-"}</p>
                    <p><strong>Precio base:</strong> $${Number(actividad.precio_base || 0).toLocaleString()}</p>
                </article>
            `
        )
        .join("");
};

const renderClientes = (clientes) => {
    if (!clientesLista) return;

    if (!Array.isArray(clientes) || clientes.length === 0) {
        clientesLista.innerHTML = "<p>No hay clientes cargados.</p>";
        return;
    }

    clientesLista.innerHTML = clientes
        .slice(0, 6)
        .map(
            (cliente) => `
                <article class="item">
                    <h3>${cliente.nombre} ${cliente.apellido || ""}</h3>
                    <p><strong>Email:</strong> ${cliente.email || "-"}</p>
                    <p><strong>Teléfono:</strong> ${cliente.telefono || "-"}</p>
                </article>
            `
        )
        .join("");
};

const cargarCatalogo = async () => {
    try {
        const [actividadesRes, clientesRes] = await Promise.all([
            fetch(`${API_URL}/actividades`),
            fetch(`${API_URL}/clientes`)
        ]);

        const actividades = actividadesRes.ok ? await actividadesRes.json() : [];
        const clientes = clientesRes.ok ? await clientesRes.json() : [];

        renderActividades(actividades);
        renderClientes(clientes);
    } catch (error) {
        console.error("Error cargando catálogo:", error);
        if (catalogo) catalogo.innerHTML = "<p>No se pudo cargar el catálogo.</p>";
        if (clientesLista) clientesLista.innerHTML = "<p>No se pudo cargar la lista de clientes.</p>";
    }
};

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const datos = {
            empresa_id: Number(document.getElementById("empresa_id").value),
            cliente_id: Number(document.getElementById("cliente_id").value),
            observaciones: document.getElementById("observaciones").value || null,
            pasajeros: [
                {
                    nombre: document.getElementById("nombre").value,
                    apellido: document.getElementById("apellido").value,
                    dni: document.getElementById("dni").value || null
                }
            ],
            servicios: [
                {
                    salida_id: Number(document.getElementById("salida_id").value),
                    cantidad: Number(document.getElementById("cantidad").value),
                    precio: Number(document.getElementById("precio").value),
                    requiere_transfer:
                        document.getElementById("requiere_transfer").checked
                }
            ]
        };

        try {
            const respuesta = await fetch(RESERVAS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.error || "No se pudo crear la reserva");
            }

            mensaje.textContent = `Reserva creada correctamente. ID: ${data.reserva.id}`;
            mensaje.className = "exito";
            document.getElementById("reservaId").value = data.reserva.id;
        } catch (error) {
            mensaje.textContent = error.message;
            mensaje.className = "error";
        }
    });
}

document.getElementById("consultarBtn")?.addEventListener("click", async () => {
    const id = document.getElementById("reservaId").value;

    if (!id) {
        resultado.textContent = "Ingrese un ID de reserva";
        return;
    }

    const respuesta = await fetch(`${RESERVAS_URL}/${id}`);
    const data = await respuesta.json();

    resultado.textContent = JSON.stringify(data, null, 2);
});

document.getElementById("cancelarBtn")?.addEventListener("click", async () => {
    const id = document.getElementById("reservaId").value;

    if (!id) {
        resultado.textContent = "Ingrese un ID de reserva";
        return;
    }

    const respuesta = await fetch(`${RESERVAS_URL}/${id}/cancelar`, {
        method: "PATCH"
    });

    const data = await respuesta.json();
    resultado.textContent = JSON.stringify(data, null, 2);
});

cargarCatalogo();