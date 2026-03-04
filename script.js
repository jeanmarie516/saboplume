// CART
let cart = [];
function addToCart(name, price) {
  const ex = cart.find(i => i.name === name);
  if (ex) ex.qty++; else cart.push({ name, price, qty: 1 });
  updateCartUI();
  showToast('✅ ' + name + ' ajouté au panier');
}
function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCountNav').textContent = count;
  const itemsDiv = document.getElementById('cartItems');
  const footerDiv = document.getElementById('cartFooter');
  if (!cart.length) {
    itemsDiv.innerHTML = '<div class="cart-empty">Votre panier est vide</div>';
    footerDiv.style.display = 'none';
  } else {
    itemsDiv.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item-info"><div class="cart-item-name">${item.name}</div><div class="cart-item-price">${(item.price*item.qty).toLocaleString()} FCFA</div></div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
        </div>
      </div>`).join('');
    footerDiv.style.display = 'block';
    document.getElementById('cartTotalPrice').textContent = total.toLocaleString() + ' FCFA';
  }
}
function changeQty(i, d) { cart[i].qty += d; if (cart[i].qty <= 0) cart.splice(i,1); updateCartUI(); }
function openCart() { document.getElementById('cartOverlay').classList.add('open'); }
function closeCart(e) { if (!e || e.target === document.getElementById('cartOverlay')) document.getElementById('cartOverlay').classList.remove('open'); }

// COMMANDER
function openCommander() {
  document.getElementById('commanderContent').style.display = 'block';
  document.getElementById('successMsg').style.display = 'none';
  document.getElementById('commanderModal').classList.add('open');
}
function closeCommander(e) { if (!e || e.target === document.getElementById('commanderModal')) document.getElementById('commanderModal').classList.remove('open'); }
function confirmerCommande() {
  const nom = document.getElementById('cmdNom').value.trim();
  const tel = document.getElementById('cmdTel').value.trim();
  if (!nom || !tel) { alert('Veuillez saisir votre nom et téléphone.'); return; }
  if (!cart.length) { alert('Votre panier est vide.'); return; }
  const reception = document.querySelector('input[name="reception"]:checked').value;
  const paiement = document.querySelector('input[name="paiement"]:checked').value;
  const envoi = document.querySelector('input[name="envoi"]:checked').value;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const lines = cart.map(i => `• ${i.name} x${i.qty} — ${(i.price*i.qty).toLocaleString()} FCFA`).join('\n');
  const msg = `Bonjour Saboplume 👋\n\nCommande de : *${nom}*\nTél : ${tel}\n\n${lines}\n\nTotal : ${total.toLocaleString()} FCFA\nRéception : ${reception}\nPaiement : ${paiement}`;
  if (envoi === 'whatsapp') window.open('https://wa.me/23675422584?text='+encodeURIComponent(msg), '_blank');
  else window.location.href = 'mailto:saboplume@outlook.fr?subject=Commande Saboplume&body='+encodeURIComponent(msg);
  cart = []; updateCartUI();
  document.getElementById('commanderContent').style.display = 'none';
  document.getElementById('successMsg').style.display = 'block';
}

// CONTACT
function openContactModal() { document.getElementById('contactModal').classList.add('open'); }
function closeContactModal(e) { if (!e || e.target === document.getElementById('contactModal')) document.getElementById('contactModal').classList.remove('open'); }


// TOAST
function showToast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// MENU
function toggleMenu() { document.getElementById('navLinks').classList.toggle('open'); }

// TABS
function switchTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  if (btn) btn.classList.add('active');
}
function switchToTab(id) {
  document.getElementById('location').scrollIntoView({behavior:'smooth'});
  setTimeout(() => {
    const btn = document.querySelector(`.tab-btn[onclick*="'${id}'"]`);
    switchTab(id, btn);
  }, 600);
}

// CALCULS
function calcChaises() {
  const qty = parseInt(document.getElementById('chaisesQty').value) || 0;
  const block = document.getElementById('chaisesTotal');
  if (qty > 0) { block.classList.add('show'); document.getElementById('chaisesTotalVal').textContent = (qty*300).toLocaleString()+' FCFA'; }
  else block.classList.remove('show');
}
function calcTables() {
  const qty = parseInt(document.getElementById('tablesQty').value) || 0;
  const block = document.getElementById('tablesTotal');
  if (qty > 0) { block.classList.add('show'); document.getElementById('tablesTotalVal').textContent = (qty*500).toLocaleString()+' FCFA'; }
  else block.classList.remove('show');
}

// FORMS
function envoyerDevisTraiteur() {
  const nom = document.getElementById('traiteurNom').value.trim();
  const tel = document.getElementById('traiteurTel').value.trim();
  const type = document.getElementById('traiteurType').value;
  const date = document.getElementById('traiteurDate').value;
  if (!nom || !tel || !type || !date) { alert('Veuillez remplir tous les champs obligatoires.'); return; }
  const msg = `Bonjour Saboplume 👋\n\nDevis Traiteur\n\nNom : *${nom}*\nTél : ${tel}\nÉvénement : ${type}\nDate : ${date}\nNombre : ${document.getElementById('traiteurNbr').value||'Non précisé'}\nDétails : ${document.getElementById('traiteurDetails').value||'Aucun'}`;
  window.open('https://wa.me/23675422584?text='+encodeURIComponent(msg), '_blank');
  showToast('✅ Votre demande a été envoyée !');
}
function reserverChaises() {
  const nom = document.getElementById('chaisesNom').value.trim();
  const tel = document.getElementById('chaisesTel').value.trim();
  const date = document.getElementById('chaisesDate').value;
  const qty = parseInt(document.getElementById('chaisesQty').value)||0;
  if (!nom||!tel||!date||!qty) { alert('Veuillez remplir tous les champs obligatoires.'); return; }
  const msg = `Bonjour Saboplume 👋\n\nRéservation chaises\n\nNom : *${nom}*\nTél : ${tel}\nDate : ${date}\nNb chaises : ${qty}\nTotal estimé : ${(qty*300).toLocaleString()} FCFA`;
  window.open('https://wa.me/23675422584?text='+encodeURIComponent(msg), '_blank');
  showToast('✅ Réservation envoyée !');
}
function reserverTentes() {
  const nom = document.getElementById('tentesNom').value.trim();
  const tel = document.getElementById('tentesTel').value.trim();
  const date = document.getElementById('tentesDate').value;
  if (!nom||!tel||!date) { alert('Veuillez remplir tous les champs obligatoires.'); return; }
  const msg = `Bonjour Saboplume 👋\n\nRéservation tentes\n\nNom : *${nom}*\nTél : ${tel}\nDate : ${date}\nNb tentes : ${document.getElementById('tentesQty').value||'?'}\nTaille : ${document.getElementById('tentesTaille').value||'Non précisé'}`;
  window.open('https://wa.me/23675422584?text='+encodeURIComponent(msg), '_blank');
  showToast('✅ Demande envoyée !');
}
function reserverTables() {
  const nom = document.getElementById('tablesNom').value.trim();
  const tel = document.getElementById('tablesTel').value.trim();
  const date = document.getElementById('tablesDate').value;
  const qty = parseInt(document.getElementById('tablesQty').value)||0;
  if (!nom||!tel||!date||!qty) { alert('Veuillez remplir tous les champs obligatoires.'); return; }
  const msg = `Bonjour Saboplume 👋\n\nRéservation tables\n\nNom : *${nom}*\nTél : ${tel}\nDate : ${date}\nNb tables : ${qty}\nType : ${document.getElementById('tablesType').value||'Non précisé'}\nTotal estimé : ${(qty*500).toLocaleString()} FCFA`;
  window.open('https://wa.me/23675422584?text='+encodeURIComponent(msg), '_blank');
  showToast('✅ Réservation envoyée !');
}
function reserverPack() {
  const nom = document.getElementById('packNom').value.trim();
  const tel = document.getElementById('packTel').value.trim();
  const date = document.getElementById('packDate').value;
  if (!nom||!tel||!date) { alert('Veuillez remplir tous les champs obligatoires.'); return; }
  const msg = `Bonjour Saboplume 👋\n\nDemande Pack\n\nNom : *${nom}*\nTél : ${tel}\nDate : ${date}\nChaises : ${document.getElementById('packChaises').value||0}\nTentes : ${document.getElementById('packTentes').value||0}\nTables : ${document.getElementById('packTables').value||0}\nSono/Groupes : ${document.getElementById('packSono').value||0}`;
  window.open('https://wa.me/23675422584?text='+encodeURIComponent(msg), '_blank');
  showToast('✅ Demande pack envoyée !');
}

// TÉMOIGNAGES
const temoignages = [
  { stars:5, text:"J'ai acheté un Kete Ngassa et je suis vraiment ravie. Le chevreau est en parfaite santé. Je recommande Saboplume les yeux fermés !", initials:"AN", name:"Ange", meta:"Produits Fermiers · Gobongo" },
  { stars:5, text:"Saboplume Traiteur a géré tous les repas de notre mariage. Tout était parfait : qualité, service, ponctualité !", initials:"CN", name:"Christine", meta:"Traiteur · Sica 2" },
  { stars:5, text:"J'ai loué chaises et tentes pour notre conférence. Livraison à l'heure, matériel en parfait état. Service sérieux !", initials:"MK", name:"Murielle", meta:"Location · Lakouanga" },
  { stars:5, text:"Les oeufs sont toujours frais, je commande chaque semaine. Une vraie confiance s'est installée avec Saboplume.", initials:"PK", name:"Pélagie", meta:"Produits Fermiers · Castor" },
  { stars:5, text:"Le baptême de mon fils était magnifique. Bélinda et son équipe ont tout géré avec le sourire. Bravo !", initials:"FB", name:"Feyza", meta:"Traiteur · PK10" },
  { stars:5, text:"J'habite à Samba et la livraison s'est faite sans problème. Très satisfait du service et des produits.", initials:"BN", name:"Bonheur", meta:"Produits Fermiers · Samba" },
  { stars:4, text:"Nous avons loué 200 chaises pour une réception. Tout était nickel, propre et livré avant l'heure prévue.", initials:"EM", name:"Egyde", meta:"Location · Nzila" },
  { stars:5, text:"La viande de Kondo Ti Kodro était délicieuse pour notre repas de famille. Je reviendrai très bientôt !", initials:"PY", name:"Paul", meta:"Produits Fermiers · Padre Pio" },
  { stars:5, text:"Excellent traiteur pour mon anniversaire. Les plats étaient chauds et savoureux. Toute ma famille a été conquise !", initials:"LK", name:"Léonie Kpata", meta:"Traiteur · Bimbo" },
];
let temoPage = 0;
const TEMO_PER_PAGE = 3;
function renderTemos() {
  const start = temoPage * TEMO_PER_PAGE;
  document.getElementById('temoignages-grid').innerHTML = temoignages.slice(start, start+TEMO_PER_PAGE).map(t => `
    <div class="temoignage-card">
      <div class="stars">${'★'.repeat(t.stars)}${'☆'.repeat(5-t.stars)}</div>
      <p class="temoignage-text">${t.text}</p>
      <div class="temoignage-author">
        <div class="author-avatar">${t.initials}</div>
        <div><div class="author-name">${t.name}</div><div class="author-meta">${t.meta}</div></div>
      </div>
    </div>`).join('');
}
function nextTemo() { temoPage = (temoPage+1)*TEMO_PER_PAGE < temoignages.length ? temoPage+1 : 0; renderTemos(); }
function prevTemo() { temoPage = temoPage > 0 ? temoPage-1 : Math.floor((temoignages.length-1)/TEMO_PER_PAGE); renderTemos(); }

function publierAvis() {
  const nom = document.getElementById('avisNom').value.trim();
  const service = document.getElementById('avisService').value;
  const text = document.getElementById('avisText').value.trim();
  const rating = document.querySelector('input[name="rating"]:checked');
  if (!nom||!service||!text||!rating) { alert('Veuillez remplir tous les champs et donner une note.'); return; }
  temoignages.unshift({ stars:parseInt(rating.value), text, initials:nom.substring(0,2).toUpperCase(), name:nom, meta:service });
  temoPage = 0; renderTemos();
  document.getElementById('avisNom').value = '';
  document.getElementById('avisService').value = '';
  document.getElementById('avisText').value = '';
  document.querySelectorAll('input[name="rating"]').forEach(r => r.checked = false);
  showToast('🎉 Merci pour votre avis !');
}

// Init
document.querySelectorAll('input[type="date"]').forEach(inp => {
  inp.min = new Date().toISOString().split('T')[0];
});
renderTemos();