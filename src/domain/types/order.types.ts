export type OrderStatus =
    | 'pending' // Recién llegado, necesita revisión
    | 'in_process' // Aceptado, separando productos
    | 'delivered' // Paquete armado, listo para entrega
    | 'canceled' // Proceso completado exitosamente
    | 'completed' // No aceptado con motivo
    | 'rejected'; // No completado por diversos motivos
