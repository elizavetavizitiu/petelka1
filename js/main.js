'use strict';
const topButton = document.getElementById('toTop');
if (topButton) {
    const updateTop = () => topButton.classList.toggle('is-visible', window.scrollY > 260);
    window.addEventListener('scroll', updateTop, { passive: true });
    updateTop();
    topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
const cards = document.querySelectorAll('#catalogCards .product-card');
if (cards.length) {
    const search = document.getElementById('search'), category = document.getElementById('category'), level = document.getElementById('level'), count = document.getElementById('resultsCount'), empty = document.getElementById('emptyState');
    const filter = () => { let visible = 0; cards.forEach(card => { const match = card.dataset.search.includes(search.value.trim().toLocaleLowerCase('ru')) && (!category.value || card.dataset.category === category.value) && (!level.value || card.dataset.level === level.value); card.hidden = !match; if (match)
        visible++; }); count.textContent = `Найдено проектов: ${visible}`; empty.hidden = visible !== 0; };
    [search, category, level].forEach(el => el.addEventListener(el === search ? 'input' : 'change', filter));
    document.getElementById('resetFilters').addEventListener('click', () => { search.value = ''; category.value = ''; level.value = ''; filter(); });
    filter();
    const dialog = document.getElementById('productDialog');
    const showProduct = (id) => { const product = PRODUCTS.find(item => item.id === id); if (!product)
        return; document.getElementById('dialogImage').src = product.image; document.getElementById('dialogImage').alt = product.title; document.getElementById('dialogTitle').textContent = product.title; document.getElementById('dialogMeta').textContent = `${product.category} · ${product.level}`; document.getElementById('dialogDesc').textContent = product.description; document.getElementById('dialogInstructions').textContent = product.instructions; dialog.showModal(); };
    document.querySelectorAll('a[href*="?item="]').forEach(link => link.addEventListener('click', e => { e.preventDefault(); const id = new URL(link.href).searchParams.get('item'); history.replaceState(null, '', 'catalog.html?item=' + encodeURIComponent(id)); showProduct(id); }));
    document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog)
        dialog.close(); });
    dialog.addEventListener('close', () => { if (new URLSearchParams(location.search).has('item'))
        history.replaceState(null, '', 'catalog.html'); });
    const initial = new URLSearchParams(location.search).get('item');
    if (initial)
        showProduct(initial);
}
const rowCount = document.getElementById('rowCount');
if (rowCount) {
    const goal = document.getElementById('rowGoal'), bar = document.getElementById('rowProgress'), label = document.getElementById('progressText');
    let rows = Number(localStorage.getItem('petelka-rows')) || 0;
    const savedGoal = Number(localStorage.getItem('petelka-goal'));
    if (savedGoal > 0)
        goal.value = savedGoal;
    const render = () => { const max = Math.max(1, Number(goal.value) || 1), percent = Math.min(100, Math.round(rows / max * 100)); rowCount.textContent = rows; bar.style.width = percent + '%'; label.textContent = `${percent}% выполнено (${rows} из ${max})`; localStorage.setItem('petelka-rows', rows); localStorage.setItem('petelka-goal', max); };
    document.getElementById('plusRow').addEventListener('click', () => { rows++; render(); });
    document.getElementById('minusRow').addEventListener('click', () => { rows = Math.max(0, rows - 1); render(); });
    document.getElementById('resetRows').addEventListener('click', () => { if (confirm('Сбросить счётчик рядов?')) {
        rows = 0;
        render();
    } });
    goal.addEventListener('input', render);
    render();
}
const stitchForm = document.getElementById('stitchForm');
if (stitchForm) {
    stitchForm.addEventListener('submit', event => { event.preventDefault(); const stitches = Number(document.getElementById('sampleStitches').value), sample = Number(document.getElementById('sampleWidth').value), target = Number(document.getElementById('targetWidth').value), result = document.getElementById('stitchResult'); if (!Number.isInteger(stitches) || stitches <= 0 || sample <= 0 || target <= 0) {
        result.textContent = 'Введите корректные положительные значения.';
        return;
    } const needed = Math.round(stitches / sample * target); result.textContent = `Нужно набрать примерно ${needed} ${needed % 10 === 1 && needed % 100 !== 11 ? 'петлю' : ([2, 3, 4].includes(needed % 10) && ![12, 13, 14].includes(needed % 100) ? 'петли' : 'петель')}.`; });
}
