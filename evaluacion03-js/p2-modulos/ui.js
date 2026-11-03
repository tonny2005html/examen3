import { resumen, calcularTotal } from './pedidos.js';

export function renderizarApp(pedidos, contenedorLista, elementoTotal) {
  contenedorLista.innerHTML = '';
  
  pedidos.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${resumen(p)} - Subtotal: S/ ${p.subtotal.toFixed(2)}`;
    contenedorLista.appendChild(li);
  });

  const totalConIGV = calcularTotal(pedidos);
  elementoTotal.textContent = `Total con IGV (18%): S/ ${totalConIGV.toFixed(2)}`;
}
