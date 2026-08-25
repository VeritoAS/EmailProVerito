export const distributorProfile = {
  commercialName: 'Comercial Norte',
  email: 'contacto@comercialnorte.com',
  fiscalProfileComplete: false,
  clabeRegistered: false,
}

export const distributorClients = [
  { id: 1, commercialName: 'Grupo Horizonte', responsible: 'Mariana Soto', email: 'mariana@horizonte.com', fiscalProfile: 'Pendiente', accountStatus: 'Confirmada' },
  { id: 2, commercialName: 'Soluciones del Centro', responsible: 'Eduardo Ruiz', email: 'eduardo@solucionescentro.com', fiscalProfile: 'Pendiente', accountStatus: 'Pendiente' },
  { id: 3, commercialName: 'Transportes del Valle', responsible: 'Lucía Lara', email: 'lucia@transportesvalle.com', fiscalProfile: 'Completa', accountStatus: 'Confirmada' },
]

export const distributorDomains = [
  { id: 1, clientId: 1, name: 'grupohorizonte.com', expirationDate: '21 ago. 2027', maxActiveMailboxes: 10, activeMailboxes: 3, status: 'Activo' },
  { id: 2, clientId: 1, name: 'horizonte.mx', expirationDate: '21 ago. 2027', maxActiveMailboxes: 5, activeMailboxes: 1, status: 'Activo' },
  { id: 3, clientId: 2, name: 'solucionescentro.com', expirationDate: '20 ago. 2027', maxActiveMailboxes: 8, activeMailboxes: 2, status: 'Activo' },
]

export const distributorMailboxes = [
  { id: 1, domainId: 1, localPart: 'ventas', status: 'Activa' },
  { id: 2, domainId: 1, localPart: 'soporte', status: 'Activa' },
  { id: 3, domainId: 1, localPart: 'mariana', status: 'Activa' },
  { id: 4, domainId: 2, localPart: 'contacto', status: 'Activa' },
  { id: 5, domainId: 3, localPart: 'admin', status: 'Activa' },
]

export const clientProfile = {
  clientId: 1,
  commercialName: 'Grupo Horizonte',
  responsible: 'Mariana Soto',
  email: 'mariana@horizonte.com',
  fiscalProfileComplete: false,
}
