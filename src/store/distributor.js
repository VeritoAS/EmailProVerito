export const distributorProfile = {
  commercialName: 'Comercial Norte',
  email: 'contacto@comercialnorte.com',
  fiscalProfileComplete: false,
  clabeRegistered: false,
  svrMonthlyCost: 12,
}

export const distributorClients = [
  { id: 1, commercialName: 'Grupo Horizonte', responsible: 'Mariana Soto', email: 'mariana@horizonte.com', fiscalProfile: 'Pendiente', accountStatus: 'Confirmada' },
  { id: 2, commercialName: 'Soluciones del Centro', responsible: 'Eduardo Ruiz', email: 'eduardo@solucionescentro.com', fiscalProfile: 'Pendiente', accountStatus: 'Pendiente' },
  { id: 3, commercialName: 'Transportes del Valle', responsible: 'Lucía Lara', email: 'lucia@transportesvalle.com', fiscalProfile: 'Completa', accountStatus: 'Confirmada' },
]

export const distributorDomains = [
  { id: 1, clientId: 1, name: 'grupohorizonte.com', expirationDate: '21 ago. 2027', maxActiveMailboxes: 10, activeMailboxes: 3, monthlyPrice: 18, paymentEligible: true, status: 'Activo' },
  { id: 2, clientId: 1, name: 'horizonte.mx', expirationDate: '21 ago. 2027', maxActiveMailboxes: 5, activeMailboxes: 1, monthlyPrice: 17, paymentEligible: true, status: 'Activo' },
  { id: 3, clientId: 2, name: 'solucionescentro.com', expirationDate: '20 ago. 2027', maxActiveMailboxes: 8, activeMailboxes: 2, monthlyPrice: 19, status: 'Activo' },
]

export const distributorPayments = [
  { id: 1, domainId: 1, paidAt: '21 ago. 2026', payment_term_id: 'Mensual', mailbox_quantity: 10, gross_amount: 180, previous_expires_at: '21 ago. 2026', new_expires_at: '21 sep. 2026', invoiceStatus: 'generated', period: 'Mensual', capacity: 10, customerUnitPrice: 18, customerTotal: 180, svrUnitCost: 12, svrTotal: 120, distributorDifference: 60, newExpirationDate: '21 sep. 2026' },
  { id: 2, domainId: 1, paidAt: '21 jul. 2026', payment_term_id: 'Mensual', mailbox_quantity: 10, gross_amount: 180, previous_expires_at: '21 jul. 2026', new_expires_at: '21 ago. 2026', invoiceStatus: 'pending', period: 'Mensual', capacity: 10, customerUnitPrice: 18, customerTotal: 180, svrUnitCost: 12, svrTotal: 120, distributorDifference: 60, newExpirationDate: '21 ago. 2026' },
  { id: 3, domainId: 2, paidAt: '21 ago. 2026', payment_term_id: 'Trimestral', mailbox_quantity: 5, gross_amount: 255, previous_expires_at: '21 ago. 2026', new_expires_at: '21 nov. 2026', invoiceStatus: 'generated', period: 'Trimestral', capacity: 5, customerUnitPrice: 17, customerTotal: 255, svrUnitCost: 12, svrTotal: 180, distributorDifference: 75, newExpirationDate: '21 nov. 2026' },
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
