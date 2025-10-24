document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del formulario
  const productSelect = document.getElementById("product");
  const quantityInput = document.getElementById("quantity");
  const promoSelect = document.getElementById("promo-select");
  const calculateBtn = document.getElementById("calculate-btn");

  // Referencias a elementos donde mostramos resultados
  const totalRawEl = document.getElementById("total-raw");
  const discountAmountEl = document.getElementById("discount-amount");
  const totalFinalEl = document.getElementById("total-final");
  const savingsEl = document.getElementById("savings");

  // Si falta algo esencial, salir silenciosamente
  if (!productSelect || !quantityInput || !promoSelect || !calculateBtn) return;
  if (!totalRawEl || !discountAmountEl || !totalFinalEl || !savingsEl) return;

  // Lee precio desde data-price de la opción
  const parsePriceFromOption = (option) => {
    const raw =
      option?.dataset?.price || option?.getAttribute("data-price") || 0;
    const n = Number(raw);
    return isNaN(n) ? 0 : n;
  };

  // Formatea número como moneda local (Argentina)
  const formatCurrency = (n) => `$${new Intl.NumberFormat("es-AR").format(n)}`;

  // Calcula subtotal, descuento y totales según la promoción
  const calculateTotals = () => {
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const unitPrice = parsePriceFromOption(selectedOption);
    let qty = Number(quantityInput.value) || 0;
    if (qty < 0) qty = 0;

    const promo = promoSelect.value;
    const subtotal = unitPrice * qty;

    let discount = 0;
    let note = "";

    if (promo === "half_second") {
      // Cada segundo ítem de un par tiene 50% de descuento
      discount = Math.floor(qty / 2) * unitPrice * 0.5;
      note = `50% en ${Math.floor(qty / 2)} segundo(s) de par`;
    } else if (promo === "three_for_two") {
      // Cada grupo de 3 paga sólo 2
      discount = Math.floor(qty / 3) * unitPrice;
      note = `3x2 en ${Math.floor(qty / 3)} grupo(s)`;
    } else if (promo === "ten_over_30000") {
      // 10% si el subtotal supera $30.000
      if (subtotal > 30000) {
        discount = subtotal * 0.1;
        note = "10% por superar $30.000";
      } else {
        note = "No alcanza $30.000";
      }
    }

    const total = Math.max(0, subtotal - discount);

    // Actualizar la UI
    totalRawEl.innerHTML = `Total sin descuento: <strong>${formatCurrency(
      subtotal
    )}</strong>`;
    discountAmountEl.innerHTML =
      `Descuento aplicado: <strong>${formatCurrency(discount)}</strong>` +
      (note ? `<br/><small style="color:#6b4423">${note}</small>` : "");
    totalFinalEl.innerHTML = `Total final: <strong>${formatCurrency(
      total
    )}</strong>`;
    savingsEl.innerHTML = `Ahorro: <strong>${formatCurrency(
      discount
    )}</strong>`;
  };

  // Eventos: recalcular al cambiar inputs o al hacer clic
  calculateBtn.addEventListener("click", calculateTotals);
  productSelect.addEventListener("change", calculateTotals);
  quantityInput.addEventListener("input", calculateTotals);
  promoSelect.addEventListener("change", calculateTotals);

  // cálculo inicial
  calculateTotals();
});
