const API_URL = "http://localhost:3000/api/reservas";

const form = document.getElementById("reservaForm");
const mensaje = document.getElementById("mensaje");
const resultado = document.getElementById("resultado");

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
        const respuesta = await fetch(API_URL, {
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

document.getElementById("consultarBtn").addEventListener("click", async () => {
    const id = document.getElementById("reservaId").value;

    if (!id) {
        resultado.textContent = "Ingrese un ID de reserva";
        return;
    }

    const respuesta = await fetch(`${API_URL}/${id}`);
    const data = await respuesta.json();

    resultado.textContent = JSON.stringify(data, null, 2);
});

document.getElementById("cancelarBtn").addEventListener("click", async () => {
    const id = document.getElementById("reservaId").value;

    if (!id) {
        resultado.textContent = "Ingrese un ID de reserva";
        return;
    }

    const respuesta = await fetch(`${API_URL}/${id}/cancelar`, {
        method: "PATCH"
    });

    const data = await respuesta.json();
    resultado.textContent = JSON.stringify(data, null, 2);
});