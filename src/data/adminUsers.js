import { ref } from 'vue'

export const currentAdminUserId = 1

export const adminUsers = ref([
  { id: 1, firstName: 'Admin', lastName: 'EmailPro', secondLastName: '', fullName: 'Admin EmailPro', email: 'admin@emailpro.com', role: 'Super Admin', status: 'Activa', isCurrentUser: true },
  { id: 2, firstName: 'Andrea', lastName: 'Ramírez', secondLastName: 'López', fullName: 'Andrea Ramírez López', email: 'andrea.ramirez@emailpro.com', role: 'Super Admin', status: 'Activa', isCurrentUser: false },
  { id: 3, firstName: 'Diego', lastName: 'Martínez', secondLastName: '', fullName: 'Diego Martínez', email: 'diego.martinez@emailpro.com', role: 'Operador', status: 'Activa', isCurrentUser: false },
  { id: 4, firstName: 'Sofía', lastName: 'Herrera', secondLastName: 'Gómez', fullName: 'Sofía Herrera Gómez', email: 'sofia.herrera@emailpro.com', role: 'Operador', status: 'Inactiva', isCurrentUser: false },
  { id: 5, firstName: 'Luis', lastName: 'Ortega', secondLastName: '', fullName: 'Luis Ortega', email: 'luis.ortega@emailpro.com', role: 'Operador', status: 'Pendiente', isCurrentUser: false },
])
