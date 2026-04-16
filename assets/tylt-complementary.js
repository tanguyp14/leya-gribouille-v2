/**
 * Tylt Complementary Products — Filtrage par variante
 * Adapté pour thème Tinker (variant-picker)
 */
(function () {
  const SECTION_SELECTOR = '.tylt-complementary';
  const ITEM_SELECTOR = '.complementary-tylt';

  /**
   * Met à jour l'affichage des produits selon la variante sélectionnée
   */
  function updateVariantDisplay(selectedValue) {
    const allItems = document.querySelectorAll(`${SECTION_SELECTOR} ${ITEM_SELECTOR}`);
    allItems.forEach((div) => div.classList.remove('visible'));

    const sizeMatch = selectedValue.match(/(\d{2})x(\d{2})/);
    const baseSize = sizeMatch ? `${sizeMatch[1]}x${sizeMatch[2]}` : null;
    if (!baseSize) return;

    // Afficher les cadres correspondant à la variante
    const matchingCadres = document.querySelectorAll(`${SECTION_SELECTOR} ${ITEM_SELECTOR}.cadre.c${baseSize}`);
    matchingCadres.forEach((div) => div.classList.add('visible'));

    // Afficher les baguettes si la valeur contient "30" ou "50"
    if (selectedValue.includes('30')) {
      document.querySelectorAll(`${SECTION_SELECTOR} ${ITEM_SELECTOR}.baguette`).forEach((div) => {
        if ([...div.classList].some((cls) => cls.includes('30'))) {
          div.classList.add('visible');
        }
      });
    }

    if (selectedValue.includes('50')) {
      document.querySelectorAll(`${SECTION_SELECTOR} ${ITEM_SELECTOR}.baguette`).forEach((div) => {
        if ([...div.classList].some((cls) => cls.includes('50'))) {
          div.classList.add('visible');
        }
      });
    }
  }

  /**
   * Écoute les changements de variante
   */
  function logSelectedVariant(event) {
    // Changé de 'variant-selects' à 'variant-picker' pour Tinker
    if (event.target.matches('variant-picker fieldset input[type="radio"]')) {
      console.log('Variant sélectionné :', event.target.value);
      updateVariantDisplay(event.target.value);
    }
  }

  /**
   * Initialisation
   */
  function init() {
    document.addEventListener('change', logSelectedVariant);

    setTimeout(() => {
      // Changé de 'variant-selects' à 'variant-picker'
      const checkedInput = document.querySelector('variant-picker fieldset input[type="radio"]:checked');

      // ✅ Cas produit SANS variante
      if (!checkedInput) {
        console.log('Aucune variante détectée, affichage de tous les produits complémentaires.');
        document.querySelectorAll(`${SECTION_SELECTOR} ${ITEM_SELECTOR}`).forEach((div) => {
          div.classList.add('visible');
        });
        return;
      }

      // ✅ Cas produit AVEC variante
      console.log('Variant sélectionné au chargement :', checkedInput.value);
      updateVariantDisplay(checkedInput.value);
    }, 500);
  }

  // Lancer au chargement du DOM
  document.addEventListener('DOMContentLoaded', init);
})();
