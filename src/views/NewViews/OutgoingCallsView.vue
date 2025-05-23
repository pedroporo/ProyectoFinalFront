<script>
import { mapActions, mapState } from "pinia";
import { useAlarmsStore } from "@/stores/alarmsStore";
import { useUsersStore } from "@/stores/usersStore";
import { usePatientsStore } from "@/stores/patientStore";
import { useOutgoingCallsStore } from "@/stores/outgoingCallsStore";
import { useIncomingCallsStore } from "@/stores/incomingCallsStore";
export default {
    data() {
        return {
            llamadasSalientes: [],
            patients: [],
            search: '',
            sortKey: '',
            sortOrder: 1,
            sortableColumns: ["fecha", "hora", "patient", "type", "description"],
            columnNames: {
                fecha: "Fecha",
                hora: "Hora",
                patient: "Paciente",
                type: "Tipo",
                description: "Descripción",
            }

        };
    },
    computed: {
        ...mapState(useUsersStore, ['userNames']),
        ...mapState(useAlarmsStore, ['getAlarmName']),
        filteredOutgoingCalls() {
            let filtered = this.llamadasSalientes.filter(call => {
                const searchLower = this.search.toLowerCase();
                return (
                    this.getPatientName(call.patient_id).toLowerCase().includes(searchLower) ||
                    call.timestamp.includes(searchLower) ||
                    this.getAlarmName(call.alarm_id).toLowerCase().includes(searchLower) ||
                    call.description.toLowerCase().includes(searchLower) ||
                    this.getType(call.type).toLowerCase().includes(searchLower)
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
                        case "type":
                            valueA = this.getType(a.type).toLowerCase();
                            valueB = this.getType(b.type).toLowerCase();
                            break;
                        case "description":
                            valueA = a.description.toLowerCase();
                            valueB = b.description.toLowerCase();
                            break;
                        /* case "alarm":
                            valueA = this.getAlarmName(a.alarm_id).toLowerCase();
                            valueB = this.getAlarmName(b.alarm_id).toLowerCase();
                            break;*/
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
        ...mapActions(useOutgoingCallsStore, ['fetchCalls', 'deleteCall']),
        ...mapActions(useIncomingCallsStore, ['formatDateTime']),
        ...mapActions(usePatientsStore, ['getPatients']),
        deleteOutgoingCall(id) {
            if (confirm("¿Seguro que quieres borrar esta llamada?")) {
                if (this.deleteCall(id)) {
                    this.llamadasSalientes = this.llamadasSalientes.filter(llamada => llamada.id != id);
                }
            }
        },

        edit(id) {
            this.$router.push(`/outgoingForm/${id}`);
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
        document.title = 'Historial de Llamadas Salientes'
        this.llamadasSalientes = await this.fetchCalls();
        this.patients = await this.getPatients();
    },

};
</script>

<template>
    <div class="calls-history">
        <h2>Historial de Llamadas Salientes</h2>
        <input type="text" v-model="search" class="form-control mb-3" placeholder="Buscar paciente...">
        <button @click="$router.push('/outgoingForm')" class="btn btn-primary">+ Llamada Saliente</button>
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
                    <tr v-for="call in filteredOutgoingCalls" :key="call.id">
                        <td>{{ formatDateTime(call.timestamp).fecha }}</td>
                        <td>{{ formatDateTime(call.timestamp).hora }}</td>
                        <td>{{ getPatientName(call.patient_id) }}</td>
                        <td>{{ call.is_planned == 0 ? 'Planificada' : 'No planificada' }}</td>
                        <td>{{ call.description }}</td>
                        <!-- <td>{{ getAlarmName(call.alarm_id) }}</td> -->
                        <td>
                            <div class="action-buttons">
                                <button @click="edit(call.id)" class="btn btn-secondary btn-sm">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button @click="deleteOutgoingCall(call.id)" class="btn btn-danger btn-sm">
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
.action-buttons {
    display: flex;
    gap: 5px;
    /* Espacio entre botones */
}

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
.calls-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
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
    background-color: #c9302f;
}


/* Ajustes para pantallas pequeñas */
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
