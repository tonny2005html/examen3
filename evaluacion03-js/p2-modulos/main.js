import { Pedido } from './pedidos.js';
import { renderizarApp } from './ui.js';

let listaPedidos = [
  new Pedido('1', 'Café', 6, 2, { nombre: 'Ana' }),
  new Pedido('2', 'Croissant', 4.5, 0),
  new Pedido('3', 'Jugo', 8)
];

const contenedor = document.getElementById('lista-pedidos');
const total = document.getElementById('total');

renderizarApp(listaPedidos, contenedor, total);
