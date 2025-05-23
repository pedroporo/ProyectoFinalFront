<script>
import { mapActions, mapState } from "pinia";
import { usePatientsStore } from "@/stores/patientStore";
import { useUsersStore } from "@/stores/usersStore";
import { useIncomingCallsStore } from "@/stores/incomingCallsStore";

export default {
    data() {
        return {
            llamadasEntrantes: [],
            search: '',
            patients: [],
            sortKey: '',
            sortOrder: 1,
            sortableColumns: ["fecha", "hora", "patient"/* , "operator" */, "type", "description"],
            columnNames: {
                fecha: "Fecha",
                hora: "Hora",
                patient: "Paciente",
                // operator: "Operador",
                type: "Tipo",
                description: "Descripción",
            }
        };
    },
    computed: {
        ...mapState(useIncomingCallsStore, ['tiposLlamada']),
        ...mapState(useUsersStore, ['userNames']),
        filteredIncomingCalls() {
            let filtered = this.llamadasEntrantes.filter(call => {
                const searchLower = this.search.toLowerCase();
                // Filtra por Nombre del paciente, teleoperador, tipo de llamada, fecha, hora y descripción
                return (
                    this.getPatientName(call.patient_id).toLowerCase().includes(searchLower) ||
                    call.timestamp.includes(searchLower) ||
                    this.userNames(call.user_id).includes(searchLower) ||
                    this.translateTipoLlamada(call.type).toLowerCase().includes(searchLower) ||
                    call.description.toLowerCase().includes(searchLower)
                );
            });

            if (this.sortKey) {
                filtered.sort((a, b) => {
                    let valueA, valueB;

                    switch (this.sortKey) {
                        case "fecha":
                            valueA = a.timestamp.split(" ")[0];
                            valueB = b.timestamp.split(" ")[0];
                            break;
                        case "hora":
                            valueA = a.timestamp.split(" ")[1];
                            valueB = b.timestamp.split(" ")[1];
                            break;
                        case "patient":
                            valueA = this.getPatientName(a.patient_id).toLowerCase();
                            valueB = this.getPatientName(b.patient_id).toLowerCase();
                            break;
                        case "operator":
                            valueA = this.userNames(a.user_id).toLowerCase();
                            valueB = this.userNames(b.user_id).toLowerCase();
                            break;
                        case "type":
                            valueA = this.translateTipoLlamada(a.type).toLowerCase();
                            valueB = this.translateTipoLlamada(b.type).toLowerCase();
                            break;
                        case "description":
                            valueA = a.description.toLowerCase();
                            valueB = b.description.toLowerCase();
                            break;
                        default:
                            return 0;
                    }

                    return valueA.localeCompare(valueB) * this.sortOrder;
                });
            }

            return filtered;
        }
    },
    methods: {
        ...mapActions(useIncomingCallsStore, ["getLlamadasEntrantes", 'removeIncomingCall', 'formatDateTime', 'translateTipoLlamada']),
        ...mapActions(usePatientsStore, ['getPatients']),
        deleteCall(id) {
            if (confirm("¿Seguro que quieres borrar esta llamada?")) {
                if (this.removeIncomingCall(id)) {
                    this.llamadasEntrantes = this.llamadasEntrantes.filter(llamada => llamada.id != id);
                }
            }
        },
        edit(id) {
            this.$router.push(`/incomingForm/${id}`);
        },
        sortBy(key) {
            if (this.sortKey === key) {
                if (this.sortOrder === 1) {
                    this.sortOrder = -1;
                } else if (this.sortOrder === -1) {
                    this.sortKey = '';
                    this.sortOrder = 1;
                }
            } else {
                this.sortKey = key;
                this.sortOrder = 1;
            }
        },
        changeIconSortOrder() {
            return (this.sortOrder === 1 ? '^' : (this.sortOrder === -1 ? 'v' : ''));
        },
        getPatientName(id) {
            const patient = this.patients.find(patient => patient.id == id);
            return patient ? patient.name + " " + patient.last_name : "Paciente no encontrado";
        }
    },

    async mounted() {
        document.title = "Listado de Llamadas Entrantes";
        this.llamadasEntrantes = await this.getLlamadasEntrantes();
        this.patients = await this.getPatients();
    }
};
</script>

<template>
    <div class="calls-history">
        <h2>Historial de Llamadas Entrantes</h2>
        <input type="text" v-model="search" class="form-control mb-3" placeholder="Buscar paciente...">
        <button @click="$router.push('/incomingForm')" class="btn btn-primary">+ Llamada Entrante</button>

        <div class="table-responsive">
            <table class="calls-table">
                <thead>
                    <tr>
                        <th v-for="key in sortableColumns" :key="key" @click="sortBy(key)" class="click-order">
                            {{ columnNames[key] }}
                            <span v-if="sortKey === key">
                                <i v-if="changeIconSortOrder() === 'v'" class="bi bi-caret-down-fill"></i>
                                <i v-if="changeIconSortOrder() === '^'" class="bi bi-caret-up-fill"></i>
                            </span>
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="call in filteredIncomingCalls" :key="call.id">
                        <td>{{ formatDateTime(call.timestamp).fecha }}</td>
                        <td>{{ formatDateTime(call.timestamp).hora }}</td>
                        <td>{{ getPatientName(call.patient_id) }}</td>
                        <!-- <td>{{ userNames(call.user_id) }}</td> -->
                        <td>{{ translateTipoLlamada(call.type) }}</td>
                        <td>{{ call.description }}</td>
                        <td>
                            <div class="action-buttons">
                                <button @click="edit(call.id)" class="btn btn-secondary btn-sm">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button @click="deleteCall(call.id)" class="btn btn-danger btn-sm">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
/* Contenedor principal */
.calls-history {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
}

/* Título */
.calls-history h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 2rem;
    color: #333;
}

/* Botón principal */
.btn {
    display: inline-block;
    padding: 10px 15px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
    margin-bottom: 10px;
}

.btn-primary {
    background-color: #007bff;
    color: #fff;
}

.btn-primary:hover {
    background-color: #0056b3;
}

/* Input de búsqueda */
.form-control {
    width: 100%;
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 15px;
}

/* Tabla */
.table-responsive {
    width: 100%;
    overflow-x: auto; /* Scroll horizontal en dispositivos pequeños */
}

.calls-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px; /* Evita que la tabla se reduzca demasiado */
}

.calls-table th,
.calls-table td {
    padding: 12px 15px;
    border: 1px solid #ddd;
    text-align: left;
    font-size: 16px;
}

.calls-table th {
    background-color: #f1f1f1;
    font-weight: bold;
}

.click-order {
    cursor: pointer;
}

.calls-table tr:nth-child(even) {
    background-color: #fafafa;
}

.calls-table tr:hover {
    background-color: #f5f5f5;
}

/* Botones de acción en la tabla */
.action-buttons {
    display: flex;
    gap: 5px;
}

.btn-sm {
    padding: 5px 10px;
    font-size: 14px;
    margin-right: 10px;
}

.btn-secondary {
    background-color: #f0ad4e;
    color: #fff;
}

.btn-secondary:hover {
    background-color: #ec971f;
}

.btn-danger {
    background-color: #d9534f;
    color: #fff;
}

.btn-danger:hover {
    background-color: #c9302c;
}

/* Responsive */
@media (max-width: 768px) {
    .calls-table th,
    .calls-table td {
        padding: 8px 10px;
        font-size: 14px;
    }

    .table-responsive {
        overflow-x: auto; /* Scroll horizontal */
    }
}
</style>
