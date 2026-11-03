export const IGV = 0.18;

export class Pedido {
  constructor(id, producto, precio, cantidad = 1, cliente = null, estado = 'pendiente') {
    this.id = id;
    this.producto = producto;
    this.precio = precio;
    this.cantidad = cantidad ?? 1;
    this.cliente = cliente;
    this.estado = estado;
  }

  get subtotal() {
    return this.precio * this.cantidad;
  }
}

export const calcularTotal = (pedidos) => {
  const subtotal = pedidos.reduce((total, p) => total + p.subtotal, 0);
  return subtotal + (subtotal * IGV);
};

export const resumen = (pedido) => {
  const clienteNombre = pedido.cliente?.nombre ?? "Anónimo";
  return `Pedido de ${clienteNombre}: ${pedido.producto} x${pedido.cantidad}`;
};
