let pedidos = [];

const form = document.getElementById('form-pedido');
const mensaje = document.getElementById('mensaje');
const filtro = document.getElementById('filtro');
const listaPedidos = document.getElementById('lista-pedidos');
const totalElem = document.getElementById('total');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  mensaje.textContent = '';

  const producto = document.getElementById('producto').value.trim();
  const precio = parseFloat(document.getElementById('precio').value);
  const cantidad = parseInt(document.getElementById('cantidad').value, 10);

  if (!producto) {
    mensaje.textContent = 'El producto no puede estar vacío.';
    return;
  }
  if (isNaN(precio) || precio <= 0) {
    mensaje.textContent = 'El precio debe ser mayor a 0.';
    return;
  }
  if (isNaN(cantidad) || cantidad < 0) {
    mensaje.textContent = 'La cantidad no puede ser negativa.';
    return;
  }

  const nuevoPedido = {
    id: Date.now().toString(),
    producto,
    precio,
    cantidad,
    estado: 'pendiente',
    subtotal() {
      return this.precio * this.cantidad;
    },
    marcarEntregado() {
      this.estado = 'entregado';
    }
  };

  pedidos.push(nuevoPedido);
  form.reset();
  render();
});

function render() {
  listaPedidos.innerHTML = '';
  const estadoFiltro = filtro.value;

  const pedidosFiltrados = pedidos.filter(p => {
    if (estadoFiltro === 'todos') return true;
    return p.estado === estadoFiltro;
  });

  pedidosFiltrados.forEach(p => {
    const li = document.createElement('li');
    if (p.estado === 'entregado') li.classList.add('entregado');

    const spanInfo = document.createElement('span');
    spanInfo.textContent = `${p.producto} x${p.cantidad} - S/ ${p.subtotal().toFixed(2)} [${p.estado}]`;

    const divBotones = document.createElement('div');

    const btnEntregar = document.createElement('button');
    btnEntregar.textContent = 'Entregar';
    btnEntregar.dataset.id = p.id;
    btnEntregar.dataset.accion = 'entregar';

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.dataset.id = p.id;
    btnEliminar.dataset.accion = 'eliminar';

    divBotones.appendChild(btnEntregar);
    divBotones.appendChild(btnEliminar);

    li.appendChild(spanInfo);
    li.appendChild(divBotones);
    listaPedidos.appendChild(li);
  });

  const total = pedidos.reduce((acc, p) => acc + p.subtotal(), 0);
  totalElem.textContent = `Total General: S/ ${total.toFixed(2)}`;
}

listaPedidos.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const id = btn.dataset.id;
  const accion = btn.dataset.accion;

  if (accion === 'entregar') {
    const ped = pedidos.find(p => p.id === id);
    if (ped) ped.marcarEntregado();
  } else if (accion === 'eliminar') {
    pedidos = pedidos.filter(p => p.id !== id);
  }

  render();
});

filtro.addEventListener('change', render);
