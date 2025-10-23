// promociones.js
document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del formulario
  const productSelect = document.getElementById("product");
  const quantityInput = document.getElementById("quantity");
  const promoSelect = document.getElementById("promo-select");
  const calculateBtn = document.getElementById("calculate-btn");

  // Referencias a contenedores donde se muestran los resultados
  const totalRawEl = document.getElementById("total-raw");
  const discountAmountEl = document.getElementById("discount-amount");
  const totalFinalEl = document.getElementById("total-final");
  const savingsEl = document.getElementById("savings");

  // Si faltan elementos esenciales, no ejecutar la lógica
  if (!productSelect || !quantityInput || !promoSelect || !calculateBtn) {
    console.warn(
      "promociones.js: elementos del formulario no encontrados. Revisar IDs en HTML."
    );
    return;
  }
  if (!totalRawEl || !discountAmountEl || !totalFinalEl || !savingsEl) {
    console.warn(
      "promociones.js: elementos de resultados no encontrados. Revisar IDs en HTML."
    );
    return;
  }

  // Extrae el precio desde el atributo data-price de una opción
  function parsePriceFromOption(opt) {
    const price = Number(
      opt.dataset.price || opt.getAttribute("data-price") || 0
    );
    return isNaN(price) ? 0 : price;
  }

  // Formatea números como moneda local (Argentina)
  function formatCurrency(num) {
    return "$" + Number(num).toLocaleString("es-AR");
  }

  // Calcula totales y descuentos según la promoción seleccionada
  function calculate() {
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const unitPrice = parsePriceFromOption(selectedOption);
    let qty = Number(quantityInput.value) || 0;
    if (qty < 0) qty = 0;

    const promo = promoSelect.value;

    const totalRaw = unitPrice * qty;
    let discount = 0;
    let note = "";

    if (promo === "half_second") {
      // Por cada par, el segundo tiene 50% de descuento
      const pairs = Math.floor(qty / 2);
      discount = pairs * unitPrice * 0.5;
      note = `Se aplicó 50% en ${pairs} producto(s) (segundos de cada par).`;
    } else if (promo === "three_for_two") {
      // Por cada 3, se cobra solo 2 (1 gratis)
      const trios = Math.floor(qty / 3);
      discount = trios * unitPrice; // un producto gratis por cada trio
      note = `Se aplicó 3x2 en ${trios} grupo(s) de 3.`;
    } else if (promo === "ten_over_30000") {
      // Si el subtotal supera $30.000, aplicar 10% sobre el total
      if (totalRaw > 30000) {
        discount = totalRaw * 0.1;
        note = `10% aplicado por superar $30.000.`;
      } else {
        note = `No alcanza $30.000 para aplicar 10%.`;
      }
    }

    const totalFinal = Math.max(0, totalRaw - discount);

    totalRawEl.innerHTML = `Total sin descuento: <strong>${formatCurrency(
      totalRaw
    )}</strong>`;
    discountAmountEl.innerHTML = `Descuento aplicado: <strong>${formatCurrency(
      discount
    )}</strong> ${
      note ? '<br/><small style="color:#6b4423;">' + note + "</small>" : ""
    }`;
    totalFinalEl.innerHTML = `Total final: <strong>${formatCurrency(
      totalFinal
    )}</strong>`;
    savingsEl.innerHTML = `Ahorro: <strong>${formatCurrency(
      discount
    )}</strong>`;
  }

  // Eventos: recalcular al hacer clic y cuando cambian los inputs
  calculateBtn.addEventListener("click", calculate);
  productSelect.addEventListener("change", calculate);
  quantityInput.addEventListener("input", calculate);
  promoSelect.addEventListener("change", calculate);

  // Cálculo inicial
  calculate();
});
