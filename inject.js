;
;
;
/* TasteBox v13 (2026-06-25) - INJECTOR + content.json + sklad.json + UPSELLS
   v10: baseline (whatsInside, upsells, configurator, gta grid, mystery, etc.)
   v11: + injectUSPRow (4 ikony SVG na stronie produktu, dla split-screen v9.4)
   v12: BUGFIX layout - injectWhatsInside i injectUpsells anchor zmieniony
        z .product-description (waska kolumna info) na .product_card.left_category
        (cala sekcja). Plus injectUSPRow czyta usp[] z content.json (productPage.usp)
        - 4 ikony i etykiety teraz editable bez ruszania kodu.
   v13: + SKLAD jako pelnoekranowy pokaz slajdow (injectSkladSlideshow).
        Nowy plik danych sklad.json (osobny, latwo edytowalny przez usera) -
        per-box lista slajdow {img,name,desc,tag,weight}. Loader laduje teraz
        content.json I sklad.json rownolegle (Promise.all) przed init().
        Jesli box ma slajdy -> pokaz slajdow; jesli pusto -> stara tabela
        whatsInside (fallback, z guardem zeby sie nie dublowaly).
   v14: + injectProductLayout - uklad 3-strefowy strony produktu
        (zdjecie | opis | panel CTA). Przenosi h1+.product-description z info
        do nowej srodkowej kolumny .tb-pdp-mid; cena/warianty/koszyk zostaja
        w info (prawy panel). Wspolpracuje z CSS v10.1 (.row:has(.tb-pdp-mid)).
   v15: USUNIETO 3-strefy (srodek bywal pusty). Hero = 2-strefy image-forward
        (DUZE zdjecie | panel CTA) - robi CSS v10.2. injectProductLayout ->
        injectProductTweaks: wyciaga upselle z panelu na full-width pod hero
        (estetyczne kafelki). Upselle uruchamiane przed tweaks (init order).
   v16: upselle renderowane 2x: NA GORZE (po hero) I NA DOLE (po slajdach) -
        buildUpsellsSection() + dwa initUpsellsLogic. Usunieto injectProductTweaks
        (zbedne - upselle same laduja na full-width). Wspolpraca z CSS v10.3
        (pelnoekranowy hero/slajdy do krawedzi + opis sr-only dla SEO).
*/

(function(){
  'use strict';

  var EMAIL = 'patrykbatorski@gmail.com';
  var FORM_ENDPOINT = 'https://formsubmit.co/' + EMAIL;
  var CONTENT_URL = 'https://shylock3.github.io/tastebox-style/content.json';
  var SKLAD_URL   = 'https://shylock3.github.io/tastebox-style/sklad.json';

  // Globalny obiekt z tekstami z content.json - ladowany przed init()
  var T = {};
  // Globalny obiekt ze slajdami skladu z sklad.json - ladowany przed init()
  var S = {};

  // Helper: pobierz tekst z T po sciezce "mystery.titleA", z fallbackiem
  function t(path, fallback) {
    if (!path) return fallback || '';
    var parts = path.split('.');
    var val = T;
    for (var i = 0; i < parts.length; i++) {
      if (val && typeof val === 'object' && val[parts[i]] !== undefined) {
        val = val[parts[i]];
      } else return fallback !== undefined ? fallback : '';
    }
    return val;
  }

  var BOX_CONTENTS = {
    'box-filmowy': {
      name: 'Box Filmowy',
      tagline: 'Idealny wieczor z filmem',
      items: [
        { n: 'Popcorn',          g: '90g',     c: 'klasyk' },
        { n: 'Lays',             g: '130g',    c: 'chipsy' },
        { n: 'Coca-Cola w szkle x2', g: '250ml',c: 'napoj' },
        { n: "M&M's x2",         g: '45g',     c: 'czekolada' },
        { n: 'Cake Bar 7Days x2',g: '32g',     c: 'wypiek' },
        { n: 'Pieguski',         g: '50g',     c: 'czekolada' },
        { n: 'Pringles',         g: '165g',    c: 'chipsy' },
        { n: 'Twix Extra',       g: '75g',     c: 'czekolada' }
      ]
    },
    'box-filmowy-xl': {
      name: 'Box Filmowy XL',
      tagline: 'Dla maratonu trzech filmow',
      items: [
        { n: 'Popcorn Caramel',  g: '100g',    c: 'klasyk' },
        { n: 'Lays',             g: '130g',    c: 'chipsy' },
        { n: 'Coca-Cola w szkle x2', g: '250ml',c: 'napoj' },
        { n: "M&M's x2",         g: '45g',     c: 'czekolada' },
        { n: 'Cake Bar 7Days x2',g: '32g',     c: 'wypiek' },
        { n: 'Pieguski',         g: '50g',     c: 'czekolada' },
        { n: 'Pringles',         g: '165g',    c: 'chipsy' },
        { n: 'Twix Extra',       g: '75g',     c: 'czekolada' },
        { n: 'Nachosy z dipem',  g: '100g',    c: 'snack' },
        { n: 'Bake Rolls',       g: '80g',     c: 'snack' },
        { n: 'Kinder Bueno',     g: '43g',     c: 'czekolada' },
        { n: 'Helena w szkle x2',g: '275ml',   c: 'napoj' }
      ]
    },
    'box-gamer': {
      name: 'Box Gamer',
      tagline: 'Krotka sesja, kompletny set',
      items: [
        { n: 'Pringles',         g: '40g',     c: 'chipsy' },
        { n: 'Red Bull',         g: '355ml',   c: 'energy' },
        { n: 'Lays',             g: '130g',    c: 'chipsy' },
        { n: 'Orzeszki Nic Nac', g: '125g',    c: 'snack' },
        { n: 'Mountain Dew',     g: '330ml',   c: 'napoj' },
        { n: 'Oreo Mini',        g: '114g',    c: 'ciastko' },
        { n: 'Lion',             g: '42g',     c: 'czekolada' },
        { n: 'Doritos',          g: '100g',    c: 'chipsy' }
      ]
    },
    'box-gamer-xl': {
      name: 'Box Gamer XL',
      tagline: 'Sesja na 12 godzin',
      items: [
        { n: 'Pringles',         g: '165g',    c: 'chipsy' },
        { n: 'Red Bull',         g: '355ml',   c: 'energy' },
        { n: 'Lays',             g: '130g',    c: 'chipsy' },
        { n: 'Orzeszki Nic Nac', g: '250g',    c: 'snack' },
        { n: 'Mountain Dew',     g: '330ml',   c: 'napoj' },
        { n: 'Oreo Mini',        g: '114g',    c: 'ciastko' },
        { n: 'Lion',             g: '42g',     c: 'czekolada' },
        { n: 'Doritos',          g: '100g',    c: 'chipsy' },
        { n: 'Cola w szkle',     g: '250ml',   c: 'napoj' },
        { n: 'Zelki Cola Zozole',g: '70g',     c: 'zelki' },
        { n: 'Toblerone',        g: '100g',    c: 'czekolada' },
        { n: 'Zupka ostra',      g: '123g',    c: 'snack' }
      ]
    },
    'box-kokos': {
      name: 'Box Kokos',
      tagline: 'Tropiki w czarnym pudelku',
      items: [
        { n: 'Milka Bombolada',  g: '100g',    c: 'czekolada' },
        { n: '7 Days',           g: '60g',     c: 'wypiek' },
        { n: 'Suszony kokos',    g: '70g',     c: 'azja' },
        { n: 'Wafel kokosowy',   g: '40g',     c: 'wypiek' },
        { n: 'Zelki kokos JJLD', g: '80g',     c: 'zelki' },
        { n: 'Bounty',           g: '57g',     c: 'czekolada' },
        { n: 'Orzeszki w kokosie',g: '300g',   c: 'azja' },
        { n: 'Woda kokosowa z pulpa',g: '320ml',c: 'napoj' },
        { n: 'Michalki',         g: '250g',    c: 'czekolada' }
      ]
    },
    'box-mango': {
      name: 'Box Mango',
      tagline: 'Mango w dziewieciu odslonach',
      items: [
        { n: 'Sagiko Mango',     g: '320ml',   c: 'napoj' },
        { n: 'Zelki JJLD obierane',g: '62g',   c: 'zelki' },
        { n: 'Napoj Chia mango', g: '290ml',   c: 'napoj' },
        { n: 'Suszone mango',    g: '70g',     c: 'azja' },
        { n: 'Roladki ryzowe mango',g: '70g',  c: 'azja' },
        { n: 'Mogu Mogu mango',  g: '320ml',   c: 'napoj' },
        { n: 'Popcorn spicy mango',g: '80g',   c: 'snack' },
        { n: 'Mini zelek mango', g: '18g',     c: 'zelki' },
        { n: 'Pocky Mango',      g: '25g',     c: 'wypiek' },
        { n: 'Mochi mango',      g: '180g',    c: 'azja' }
      ]
    }
  };

  function urlToBoxKey(path) {
    var p = (path || window.location.pathname).toLowerCase();
    // XL warianty MUSZA byc sprawdzane PRZED bez XL
    if (p.indexOf('filmowyxl') > -1 || p.indexOf('filmowy-xl') > -1 || p.indexOf('filmowy_xl') > -1) return 'box-filmowy-xl';
    if (p.indexOf('filmowy') > -1) return 'box-filmowy';
    if (p.indexOf('gamingowyxl') > -1 || p.indexOf('gamingowy-xl') > -1 || p.indexOf('gamerxl') > -1 || p.indexOf('gamer-xl') > -1) return 'box-gamer-xl';
    if (p.indexOf('gaming') > -1 || p.indexOf('gamer') > -1) return 'box-gamer';
    if (p.indexOf('kokos') > -1) return 'box-kokos';
    if (p.indexOf('mango') > -1) return 'box-mango';
    // Nowe boxy
    if (p.indexOf('amerykan') > -1 || p.indexOf('american') > -1) return 'box-amerykanski';
    if (p.indexOf('azjat') > -1 || p.indexOf('asian') > -1) return 'box-azjatycki';
    if (p.indexOf('brytyj') > -1 || p.indexOf('british') > -1) return 'box-brytyjski';
    if (p.indexOf('chillout') > -1 || p.indexOf('chill') > -1) return 'box-chillout';
    if (p.indexOf('chinski') > -1 || p.indexOf('chinese') > -1 || p.indexOf('chiński') > -1) return 'box-chinski';
    if (p.indexOf('student') > -1) return 'box-student';
    if (p.indexOf('halloween') > -1) return 'box-halloween';
    if (p.indexOf('meksyk') > -1 || p.indexOf('mexican') > -1) return 'box-meksykanski';
    if (p.indexOf('mietow') > -1 || p.indexOf('miętow') > -1 || p.indexOf('mint') > -1) return 'box-mietowy';
    if (p.indexOf('party') > -1) return 'box-party';
    if (p.indexOf('rozow') > -1 || p.indexOf('różow') > -1 || p.indexOf('pink') > -1) return 'box-rozowy';
    if (p.indexOf('urodzin') > -1 || p.indexOf('birthday') > -1) return 'box-urodzinowy';
    if (p.indexOf('walentyn') > -1 || p.indexOf('valentine') > -1) return 'box-walentynkowy';
    if (p.indexOf('w-trase') > -1 || p.indexOf('w_trase') > -1 || p.indexOf('travel') > -1) return 'box-w-trase';
    return null;
  }

  // Helper: zwraca box z content.json T.boxes (priorytet) lub hardcoded BOX_CONTENTS
  function getBox(key) {
    if (T.boxes && T.boxes[key]) return T.boxes[key];
    return BOX_CONTENTS[key];
  }

  function el(tag, props, kids) {
    var e = document.createElement(tag);
    if (props) for (var k in props) {
      if (k === 'class') e.className = props[k];
      else if (k === 'html') e.innerHTML = props[k];
      else if (k === 'style') for (var s in props[k]) e.style[s] = props[k][s];
      else e.setAttribute(k, props[k]);
    }
    if (kids) kids.forEach(function(c){ if (c) e.appendChild(c); });
    return e;
  }

  function isHomePage() {
    var p = window.location.pathname;
    return p === '/' || p === '' || p === '/index' || p === '/home';
  }
  function isProductPage() {
    return /\-p\d+/.test(window.location.pathname) || urlToBoxKey() !== null;
  }
  function reducedMotion() { return false; } // wymus efekty (override OS pref)
  function isMobile() { return window.matchMedia('(max-width: 640px)').matches; }
  function isTouch() { return false; } // wymus efekty (override touch screens)
  var LOG = function(){ try { console.log.apply(console, ['[TasteBox v6]'].concat([].slice.call(arguments))); } catch(e){} };
  var safe = function(name, fn){ try { fn(); LOG('OK:', name); } catch(e){ LOG('ERROR in', name, e.message, e.stack); } };

  // ===== 1) CANVAS PARTICLES =====
  function initParticles() {
    if (reducedMotion() || isMobile()) return;
    var canvas = el('canvas', { id: 'tb-particles', 'aria-hidden': 'true' });
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.5';
    document.body.insertBefore(canvas, document.body.firstChild);
    var ctx = canvas.getContext('2d');
    var W = canvas.width = window.innerWidth;
    var H = canvas.height = window.innerHeight;
    var particles = [];
    var count = Math.min(60, Math.floor((W*H)/25000));
    for (var i=0; i<count; i++) {
      particles.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3,
        r: Math.random()*1.4 + 0.4
      });
    }
    var mouse = { x: -1000, y: -1000 };
    document.addEventListener('mousemove', function(e){ mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    function loop(){
      ctx.clearRect(0,0,W,H);
      for (var i=0; i<particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>W) p.vx *= -1;
        if (p.y<0||p.y>H) p.vy *= -1;
        var dx = mouse.x - p.x, dy = mouse.y - p.y;
        var dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 120) {
          ctx.strokeStyle = 'rgba(57,255,20,' + (0.25*(1-dist/120)) + ')';
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(mouse.x,mouse.y); ctx.stroke();
        }
        for (var j=i+1; j<particles.length; j++) {
          var q = particles[j];
          var ddx = q.x-p.x, ddy = q.y-p.y;
          var dd = Math.sqrt(ddx*ddx+ddy*ddy);
          if (dd < 130) {
            ctx.strokeStyle = 'rgba(255,255,255,' + (0.06*(1-dd/130)) + ')';
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(57,255,20,.55)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    loop();
    window.addEventListener('resize', function(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; });
  }

  // ===== 2) CURSOR BLOB =====
  function initCursorBlob() {
    if (reducedMotion() || isTouch()) return;
    var blob = el('div', { id: 'tb-blob', 'aria-hidden': 'true' });
    blob.style.cssText = 'position:fixed;top:0;left:0;width:380px;height:380px;background:radial-gradient(circle,rgba(57,255,20,.18) 0%,rgba(0,229,255,.08) 30%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:opacity 400ms;mix-blend-mode:screen;filter:blur(20px);opacity:0';
    document.body.appendChild(blob);
    var x=0, y=0, tx=0, ty=0;
    document.addEventListener('mousemove', function(e){ tx=e.clientX; ty=e.clientY; blob.style.opacity=1; }, { passive: true });
    document.addEventListener('mouseleave', function(){ blob.style.opacity=0; });
    (function tick(){
      x += (tx-x)*0.14; y += (ty-y)*0.14;
      blob.style.transform = 'translate('+x+'px,'+y+'px) translate(-50%,-50%)';
      requestAnimationFrame(tick);
    })();
  }

  // ===== 3) SCROLL PROGRESS BAR =====
  function initScrollProgress() {
    var bar = el('div', { id: 'tb-scroll-bar' });
    bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;width:0%;z-index:9999;background:linear-gradient(90deg,#39FF14,#00E5FF);box-shadow:0 0 12px rgba(57,255,20,.6);transition:width 80ms linear';
    document.body.appendChild(bar);
    window.addEventListener('scroll', function(){
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max>0 ? (h.scrollTop/max)*100 : 0) + '%';
    }, { passive: true });
  }

  // ===== 4) MAGNETIC HOVER =====
  function initMagnetic() {
    if (reducedMotion() || isTouch()) return;
    var btns = document.querySelectorAll('.btn.btn-primary, .tb-mystery-card-cta, .tb-b2b-cta, .tb-fab, .button_addToCart, .tb-form-submit');
    btns.forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width/2;
        var y = e.clientY - r.top - r.height/2;
        btn.style.transform = 'translate('+(x*0.18)+'px,'+(y*0.18)+'px)';
      });
      btn.addEventListener('mouseleave', function(){ btn.style.transform=''; });
    });
  }

  // ===== 5) 3D TILT =====
  function initTilt() {
    if (reducedMotion() || isTouch()) return;
    var cards = document.querySelectorAll('.products_slider .product, .product-tile, .highlight-card, .tb-mystery-card');
    cards.forEach(function(card){
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var x = (e.clientX-r.left)/r.width - 0.5;
        var y = (e.clientY-r.top)/r.height - 0.5;
        card.style.transform = 'perspective(1000px) rotateX('+(-y*5)+'deg) rotateY('+(x*5)+'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function(){ card.style.transform=''; });
    });
  }

  // ===== 6) GLITCH HERO =====
  function initGlitch() {
    if (reducedMotion()) return;
    setTimeout(function loop(){
      var s = document.querySelector('.slider.slider_container_450');
      if (s) { s.classList.add('tb-glitch'); setTimeout(function(){ s.classList.remove('tb-glitch'); }, 600); }
      setTimeout(loop, 8000 + Math.random()*6000);
    }, 4000);
  }

  // ===== 7) MARQUEE BRANDOW =====
  function injectMarquee() {
    if (!isHomePage()) return;
    // POZYCJA: TUZ POD HEADEREM (pod menu nawigacji), nad reszta strony
    var anchor = document.querySelector('.container-xxl.header_with_searchbar')
              || document.querySelector('header.header')
              || document.querySelector('.slider.slider_container_450');
    if (!anchor) return;
    var brands = t('brands', ['LAYS','RED BULL',"M&M'S",'PRINGLES','TWIX','DORITOS','OREO','MOUNTAIN DEW','TOBLERONE','BOUNTY','MILKA','POCKY','MOGU MOGU','SAGIKO','KINDER BUENO']);
    var track = brands.concat(brands).map(function(b){
      return '<span class="tb-marquee-item">'+b+'</span><span class="tb-marquee-dot">&bull;</span>';
    }).join('');
    var marquee = el('section', { class: 'tb-marquee tb-marquee-top', html:
      '<div class="tb-marquee-inner"><div class="tb-marquee-track">'+track+'</div></div>' });
    anchor.after(marquee);
  }

  // ===== 8) HOME SECTIONS: Mystery + Manifest + B2B =====
  function injectHomeSections() {
    if (!isHomePage()) return;
    var anchor = document.querySelector('.products_slider') || document.querySelector('.highlights');
    if (!anchor) return;

    var mystery = el('section', { class: 'tb-mystery', html:
      '<div class="tb-mystery-wrap">'+
        '<div class="tb-mystery-head">'+
          '<span class="tb-mystery-eyebrow">'+t('mystery.eyebrow','Nowość — Subskrypcja miesięczna')+'</span>'+
          '<h2 class="tb-mystery-title">'+t('mystery.titleA','Ślepa randka')+' <em>'+t('mystery.titleB','ze smakami')+'</em></h2>'+
          '<p class="tb-mystery-sub">'+t('mystery.sub','Co miesiąc inny, autorski box. Nie wiesz co dostaniesz — my wiemy że będzie pyszne.')+'</p>'+
        '</div>'+
        '<div class="tb-mystery-grid">'+
          '<div class="tb-mystery-card">'+
            '<div class="tb-mystery-card-tag">'+t('mystery.standard.tag','A — Standard')+'</div>'+
            '<div class="tb-mystery-card-visual"></div>'+
            '<h3>'+t('mystery.standard.name','Mystery Standard')+'</h3>'+
            '<p>'+t('mystery.standard.desc','14 pozycji w czarnym pudełku. Mieszanka polskich klasyków i azjatyckich nowości.')+'</p>'+
            '<div class="tb-mystery-card-foot">'+
              '<div class="tb-mystery-card-price">'+t('mystery.standard.price','99')+' zł<small>'+t('mystery.standard.priceLabel','/MIESIĄC')+'</small></div>'+
              '<button class="tb-mystery-card-cta" data-waitlist="Mystery Standard">'+t('mystery.standard.cta','Zarezerwuj')+' &rarr;</button>'+
            '</div>'+
          '</div>'+
          '<div class="tb-mystery-card featured">'+
            '<div class="tb-mystery-card-tag">'+t('mystery.max.tag','B — Max')+'</div>'+
            '<div class="tb-mystery-card-visual"></div>'+
            '<h3>'+t('mystery.max.name','Mystery Max')+'</h3>'+
            '<p>'+t('mystery.max.desc','22 pozycje + limited drop, którego nie sprzedajemy nigdzie indziej.')+'</p>'+
            '<div class="tb-mystery-card-foot">'+
              '<div class="tb-mystery-card-price">'+t('mystery.max.price','169')+' zł<small>'+t('mystery.max.priceLabel','/MIESIĄC')+'</small></div>'+
              '<button class="tb-mystery-card-cta" data-waitlist="Mystery Max">'+t('mystery.max.cta','Zarezerwuj')+' &rarr;</button>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>' });
    anchor.after(mystery);

    var manifest = el('section', { class: 'tb-manifest', html:
      '<div class="tb-manifest-wrap">'+
        '<span class="tb-manifest-eyebrow">'+t('manifest.eyebrow','// Manifest TasteBox')+'</span>'+
        '<p class="tb-manifest-text">'+t('manifest.text','Założyliśmy TasteBox bo nikt nie powinien kombinować z prezentem w ostatniej chwili.')+'</p>'+
        '<div class="tb-manifest-sig">'+t('manifest.signature','TasteBox · Est. 2024 · Warszawa')+'</div>'+
      '</div>' });
    mystery.after(manifest);

    var b2b = el('section', { class: 'tb-b2b', html:
      '<div class="tb-b2b-wrap">'+
        '<div>'+
          '<span class="tb-b2b-badge">'+t('b2b.badge','• Wkrótce • B2B')+'</span>'+
          '<h3>'+t('b2b.title','Prezenty dla zespołu? Działamy nad tym.')+'</h3>'+
          '<p>'+t('b2b.desc','Pakujemy boxy z brandingiem, dla 10 osób albo 500.')+'</p>'+
        '</div>'+
        '<div class="tb-b2b-cta-wrap">'+
          '<button class="tb-b2b-cta" data-waitlist="B2B">'+t('b2b.cta','Zostaw mail')+' &rarr;</button>'+
        '</div>'+
      '</div>' });
    manifest.after(b2b);
  }

  // ===== 9) WAITLIST FORM MODAL (formsubmit.co) =====
  function injectWaitlist() {
    var bg = el('div', { class: 'tb-modal-bg', id: 'tb-waitlist-bg' });
    bg.innerHTML =
      '<div class="tb-modal">'+
        '<button class="tb-modal-close" aria-label="Zamknij">&#x2715;</button>'+
        '<span class="tb-quiz-q" data-waitlist-tag>// Waitlist</span>'+
        '<h3>'+t('form.title','Zarezerwuj swoje miejsce')+'</h3>'+
        '<p class="tb-modal-sub">'+t('form.sub','Damy Ci znać jako pierwszemu kiedy ruszymy. Bez spamu, jeden mail w pakiet.')+'</p>'+
        '<form id="tb-waitlist-form" action="'+FORM_ENDPOINT+'" method="POST">'+
          '<input type="hidden" name="_captcha" value="false">'+
          '<input type="hidden" name="_template" value="table">'+
          '<input type="hidden" name="_subject" value="TasteBox - waitlist zgloszenie">'+
          '<input type="hidden" name="zainteresowanie" value="Mystery Standard">'+
          '<div class="tb-form-row">'+
            '<label class="tb-form-label">'+t('form.labels.name','Imię')+'</label>'+
            '<input type="text" name="imie" required placeholder="'+t('form.placeholders.name','Jak Cię zwą')+'">'+
          '</div>'+
          '<div class="tb-form-row">'+
            '<label class="tb-form-label">'+t('form.labels.email','E-mail')+'</label>'+
            '<input type="email" name="email" required placeholder="'+t('form.placeholders.email','ty@email.pl')+'">'+
          '</div>'+
          '<div class="tb-form-row" id="tb-form-firm">'+
            '<label class="tb-form-label">'+t('form.labels.company','Firma (opcjonalne)')+'</label>'+
            '<input type="text" name="firma" placeholder="'+t('form.placeholders.company','np. Acme Sp. z o.o.')+'">'+
          '</div>'+
          '<div class="tb-form-row">'+
            '<label class="tb-form-label">'+t('form.labels.comment','Komentarz (opcjonalne)')+'</label>'+
            '<textarea name="komentarz" rows="3" placeholder="'+t('form.placeholders.comment','Cokolwiek warto wiedzieć')+'"></textarea>'+
          '</div>'+
          '<button type="submit" class="tb-form-submit">'+t('form.submit','Zapisuję się')+' &rarr;</button>'+
          '<p class="tb-form-note">'+t('form.note','Wysyłając zgadzasz się że odezwiemy się mailem.')+'</p>'+
        '</form>'+
        '<div class="tb-form-success" hidden>'+
          '<div class="tb-form-check">&check;</div>'+
          '<h4>'+t('form.successTitle','Jesteś na liście')+'</h4>'+
          '<p>'+t('form.successDesc','Pierwszy email dostaniesz na dniach.')+'</p>'+
        '</div>'+
      '</div>';
    document.body.appendChild(bg);

    var form = bg.querySelector('#tb-waitlist-form');
    var success = bg.querySelector('.tb-form-success');
    var tag = bg.querySelector('[data-waitlist-tag]');
    var typeInput = form.querySelector('input[name="zainteresowanie"]');
    var firmRow = bg.querySelector('#tb-form-firm');

    function open(type) {
      typeInput.value = type;
      tag.textContent = '// ' + type;
      bg.classList.add('active');
      document.body.style.overflow = 'hidden';
      form.style.display = '';
      success.hidden = true;
      firmRow.style.display = type === 'B2B' ? '' : 'none';
    }
    function close() {
      bg.classList.remove('active');
      document.body.style.overflow = '';
    }
    bg.addEventListener('click', function(e){
      if (e.target === bg || e.target.classList.contains('tb-modal-close')) close();
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && bg.classList.contains('active')) close();
    });
    document.addEventListener('click', function(e){
      var btn = e.target.closest('[data-waitlist]');
      if (btn) { e.preventDefault(); open(btn.getAttribute('data-waitlist')); }
    });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      var submitBtn = form.querySelector('.tb-form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = t('form.submitting','Wysyłam...');
      fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function(r){
          if (r.ok) { form.style.display='none'; success.hidden=false; }
          else { alert('Cos poszlo nie tak. Napisz na '+EMAIL); submitBtn.disabled=false; submitBtn.textContent='Zapisuje sie -->'; }
        })
        .catch(function(){ alert('Brak polaczenia. Napisz na '+EMAIL); submitBtn.disabled=false; submitBtn.textContent='Zapisuje sie -->'; });
    });
  }

  // ===== 9b) SKLAD — PELNOEKRANOWY POKAZ SLAJDOW (sklad.json) =====
  // Per-box. Jeden slajd = 1 ekran (100svh): duze zdjecie + nazwa + opis.
  // Dane edytowalne w osobnym pliku sklad.json. Jesli box nie ma slajdow,
  // funkcja nic nie robi i pokazuje sie tabela whatsInside (fallback).
  function injectSkladSlideshow() {
    if (!isProductPage()) return;
    var key = urlToBoxKey();
    if (!key) return;
    var data = S[key];
    if (!data || !Array.isArray(data.slides) || !data.slides.length) {
      LOG('sklad: brak slajdow dla', key, '- zostaje tabela');
      return;
    }
    var anchor = document.querySelector('.product_card.left_category') ||
                 document.querySelector('section.product_card') ||
                 document.querySelector('.product-tabs-container') ||
                 document.querySelector('.product-description') ||
                 document.querySelector('.product-informations');
    if (!anchor) { LOG('sklad: brak anchor'); return; }

    var intro = data.intro || {};
    var slides = data.slides;
    var n = slides.length;
    var pad2 = function(x){ return x < 10 ? '0' + x : '' + x; };
    var total = pad2(n);

    var slidesHtml = slides.map(function(s, i){
      var meta = '';
      if (s.tag)    meta += '<span class="tb-sk-tag">' + s.tag + '</span>';
      if (s.weight) meta += '<span class="tb-sk-weight">' + s.weight + '</span>';
      return '<article class="tb-sk-slide" data-sk-idx="' + (i+1) + '">' +
          '<div class="tb-sk-media">' +
            '<div class="tb-sk-media-glow" aria-hidden="true"></div>' +
            '<img class="tb-sk-img" src="' + (s.img || '') + '" alt="' + (s.name || '') + '" loading="lazy">' +
          '</div>' +
          '<div class="tb-sk-caption">' +
            '<div class="tb-sk-count"><span>' + pad2(i+1) + '</span> / ' + total + '</div>' +
            (meta ? '<div class="tb-sk-meta">' + meta + '</div>' : '') +
            '<h3 class="tb-sk-name">' + (s.name || '') + '</h3>' +
            (s.desc ? '<p class="tb-sk-desc">' + s.desc + '</p>' : '') +
          '</div>' +
        '</article>';
    }).join('');

    var dotsHtml = slides.map(function(s, i){
      return '<button type="button" class="tb-sk-dot" data-sk-dot="' + (i+1) + '" aria-label="Slajd ' + (i+1) + '"></button>';
    }).join('');

    var section = el('section', { class: 'tb-sklad', 'data-sk-key': key, html:
      '<div class="tb-sk-head">' +
        '<span class="tb-sk-eyebrow">' + (intro.eyebrow || '// Skład boxa') + '</span>' +
        '<h2 class="tb-sk-title">' + (intro.title || 'Co jest w środku') + '</h2>' +
        (intro.sub ? '<p class="tb-sk-sub">' + intro.sub + '</p>' : '') +
        '<div class="tb-sk-scrollhint" aria-hidden="true"><span class="tb-sk-scrollhint-dot"></span>Przewiń</div>' +
      '</div>' +
      '<div class="tb-sk-track">' + slidesHtml + '</div>' +
      '<div class="tb-sk-dots" aria-hidden="true">' + dotsHtml + '</div>'
    });
    anchor.after(section);
    initSkladNav(section);
    LOG('sklad: wyrenderowano', n, 'slajdow dla', key);
  }

  // Aktywny slajd (kropki + reveal) + nawigacja kropkami
  function initSkladNav(section) {
    var slides = [].slice.call(section.querySelectorAll('.tb-sk-slide'));
    var dots   = [].slice.call(section.querySelectorAll('.tb-sk-dot'));
    if (!slides.length) return;

    function setActive(idx) {
      slides.forEach(function(sl, i){ sl.classList.toggle('is-active', i === idx); });
      dots.forEach(function(d, i){ d.classList.toggle('is-active', i === idx); });
    }
    setActive(0);
    slides[0].classList.add('tb-sk-seen'); // pierwszy slajd widoczny od razu (bez flasha)

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            var idx = slides.indexOf(e.target);
            if (idx >= 0) setActive(idx);
            e.target.classList.add('tb-sk-seen');
          }
        });
      }, { threshold: [0.5, 0.75] });
      slides.forEach(function(sl){ io.observe(sl); });

      // Pokaz kropki nawigacji tylko gdy sekcja jest w polu widzenia
      var rootIo = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ section.classList.toggle('is-inview', e.isIntersecting); });
      }, { threshold: 0, rootMargin: '-10% 0px -10% 0px' });
      rootIo.observe(section);
    } else {
      slides.forEach(function(sl){ sl.classList.add('tb-sk-seen'); });
      section.classList.add('is-inview');
    }

    dots.forEach(function(d, i){
      d.addEventListener('click', function(){
        if (slides[i]) slides[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  // ===== 10) WHAT'S INSIDE TABLE =====
  function injectWhatsInside() {
    if (!isProductPage()) return;
    // Jesli dla tego boxa istnieje pokaz slajdow skladu (sklad.json) - tabela
    // ustepuje miejsca slajdom (injectSkladSlideshow uruchamia sie wczesniej).
    if (document.querySelector('.tb-sklad')) { LOG('whatsInside: pomijam (jest pokaz slajdow)'); return; }
    var key = urlToBoxKey();
    if (!key) return;
    var data = getBox(key);
    if (!data) return;
    // v9.7: anchor = cala sekcja produktu, zeby tabela ladowala
    // POD split-screen na full-width, nie w srodku waskiej kolumny info
    var anchor = document.querySelector('.product_card.left_category') ||
                 document.querySelector('section.product_card') ||
                 document.querySelector('.product-tabs-container') ||
                 document.querySelector('.product-description') ||
                 document.querySelector('.product-informations');
    if (!anchor) return;
    var rows = data.items.map(function(it, i){
      var idx = (i+1).toString();
      if (idx.length === 1) idx = '0' + idx;
      return '<div class="tb-wi-row">'+
        '<div class="tb-wi-idx">'+idx+'</div>'+
        '<div class="tb-wi-name">'+it.n+'</div>'+
        '<div class="tb-wi-cat">'+it.c+'</div>'+
        '<div class="tb-wi-g">'+it.g+'</div>'+
      '</div>';
    }).join('');
    var section = el('section', { class: 'tb-whats-inside', html:
      '<div class="tb-wi-wrap">'+
        '<div class="tb-wi-head">'+
          '<span class="tb-wi-eyebrow">'+t('whatsInside.eyebrow','// Co dokładnie dostajesz')+'</span>'+
          '<h2 class="tb-wi-title">'+t('whatsInside.titlePrefix','W środku')+' <em>'+data.items.length+' '+t('whatsInside.titleSuffix','pozycji')+'</em></h2>'+
          '<p class="tb-wi-sub">'+data.tagline+'. '+t('whatsInside.sub','Wszystko z certyfikatem, data ważności min. 6 miesięcy.')+'</p>'+
        '</div>'+
        '<div class="tb-wi-table">'+
          '<div class="tb-wi-row tb-wi-header">'+
            '<div class="tb-wi-idx">'+t('whatsInside.headerIdx','#')+'</div>'+
            '<div class="tb-wi-name">'+t('whatsInside.headerName','Pozycja')+'</div>'+
            '<div class="tb-wi-cat">'+t('whatsInside.headerCat','Kategoria')+'</div>'+
            '<div class="tb-wi-g">'+t('whatsInside.headerWeight','Gramatura')+'</div>'+
          '</div>'+
          rows+
        '</div>'+
      '</div>' });
    anchor.after(section);
  }

  // ===== 10b) GTA-STYLE BENTO GRID (Polecane) =====
  function injectGTAGrid() {
    if (!isHomePage()) return;
    var slider = document.querySelector('.products_slider');
    if (!slider) return;

    // Zbierz produkty z slidera SkyShop
    // Sky-Shop uzywa <figure class="product-tile">, srcset dla obrazow
    var tiles = slider.querySelectorAll('.product-tile, figure.product-tile, .product');
    LOG('GTA: znaleziono tiles:', tiles.length);
    var products = [];
    tiles.forEach(function(p){
      var linkEl = p.querySelector('a.product-name') || p.querySelector('a[href*="-p"]') || p.querySelector('a[class*="product-name"]') || p.querySelector('a[href^="/"]');
      var name = linkEl ? linkEl.textContent.trim() : '';
      if (!name) {
        var nm = p.querySelector('.product-name, .product-tile-name');
        if (nm) name = nm.textContent.trim();
      }
      var priceEl = p.querySelector('.core_priceFormat, .price, .price-color, .product-price-default span');
      var price = '';
      if (priceEl) {
        price = priceEl.textContent.trim();
        var m = price.match(/[\d,\.]+/);
        if (m) price = m[0];
      }
      var img = p.querySelector('img');
      var imgSrc = '';
      if (img) {
        // SkyShop uzywa srcset dla responsive - bierzemy najwiekszy
        var srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset') || '';
        if (srcset) {
          var parts = srcset.split(',').map(function(s){ return s.trim().split(' ')[0]; }).filter(Boolean);
          if (parts.length) imgSrc = parts[parts.length-1]; // ostatni (najwiekszy)
        }
        if (!imgSrc) imgSrc = img.getAttribute('data-src') || img.getAttribute('src') || '';
        // Skip jesli to placeholder 1px transparent gif
        if (imgSrc.indexOf('data:image') === 0) imgSrc = '';
      }
      if (imgSrc && imgSrc.indexOf('http') !== 0 && imgSrc.indexOf('/') === 0) imgSrc = window.location.origin + imgSrc;
      var href = linkEl ? linkEl.getAttribute('href') : '#';
      if (href && href.indexOf('http') !== 0 && href.indexOf('/') !== 0) href = '/' + href;
      LOG('  -> product:', name, '|', price, '|', imgSrc ? 'has-img' : 'NO-IMG', '|', href);
      if (name) products.push({ name: name, price: price, img: imgSrc, href: href });
    });

    if (products.length < 3) { LOG('GTA: za malo produktow', products.length); return; }

    // GTA layout - przypisz rozmiary do kart (asymetrycznie)
    var sizes = ['size-2x2', 'size-1x2', 'size-1x1', 'size-1x1', 'size-2x1', 'size-1x1'];
    var tags = t('gta.tags', ['Bestseller','XL Edition','Nowość','Azja','Klasyk','Polecany']);
    var HOVER_IMG = 'https://shylock3.github.io/tastebox-style/placeholder.png';

    var cardsHtml = products.slice(0, 6).map(function(p, i){
      var size = sizes[i] || 'size-1x1';
      var tag = tags[i] || 'Box';
      var displayPrice = p.price ? p.price.replace(',', ',') + ' zl' : '';
      var imgFallback = HOVER_IMG;
      return '<a href="' + p.href + '" class="tb-gta-card ' + size + '">' +
        '<div class="tb-gta-img-wrap">' +
          '<img class="tb-gta-img" src="' + (p.img || HOVER_IMG) + '" alt="' + p.name + '" loading="lazy">' +
          '<img class="tb-gta-img-hover" src="' + HOVER_IMG + '" alt="" loading="lazy">' +
        '</div>' +
        '<div class="tb-gta-overlay"></div>' +
        '<div class="tb-gta-arrow">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' +
        '</div>' +
        '<div class="tb-gta-content">' +
          '<span class="tb-gta-tag">' + tag + '</span>' +
          '<h3 class="tb-gta-name">' + p.name + '</h3>' +
          (displayPrice ? '<div class="tb-gta-price">' + displayPrice + ' <small>VAT</small></div>' : '') +
        '</div>' +
      '</a>';
    }).join('');

    var grid = el('section', { class: 'tb-gta', html:
      '<div class="tb-gta-wrap">' +
        '<div class="tb-gta-head">' +
          '<div>' +
            '<span class="tb-gta-eyebrow">'+t('gta.eyebrow','// Bestsellery')+'</span>' +
            '<h2 class="tb-gta-title">'+t('gta.titleA','Wybierz')+' <em>'+t('gta.titleB','swój')+'</em> '+t('gta.titleC','box')+'</h2>' +
          '</div>' +
          '<p class="tb-gta-sub">'+t('gta.sub','Sześć autorskich kompozycji. Najedź na kartę żeby zobaczyć co kryje czarne pudełko.')+'</p>' +
        '</div>' +
        '<div class="tb-gta-grid">' + cardsHtml + '</div>' +
      '</div>' });

    // Wstaw przed slider i ukryj slider
    slider.parentNode.insertBefore(grid, slider);
    slider.classList.add('tb-hidden-by-gta');
    LOG('GTA: stworzono', products.length, 'kart');
  }

  // ===== 10b1) Ukryj SkyShop "Kolor/Wzór" parametr na boxach inne niz Filmowy/Gamer =====
  function hideSkyShopVariants() {
    var key = urlToBoxKey();
    if (!key) return;
    // Boxy ktore MAJA prawdziwe warianty (M/XL) - zachowujemy parametry
    var keepVariants = ['box-filmowy', 'box-filmowy-xl', 'box-gamer', 'box-gamer-xl'];
    if (keepVariants.indexOf(key) >= 0) return;
    // Ukryj parametry dodatkowe SkyShop
    var sel = '.product-parameters, .parameter-select, .product-options, .core_changeProductOptions, .product-option-container, [class*="product-options-wrapper"]';
    document.querySelectorAll(sel).forEach(function(el){
      el.style.display = 'none';
    });
    LOG('Ukryto SkyShop parametry na', key);
  }

  // ===== 10c) FIX AUTO-SCROLL na pierwszym wczytaniu =====
  function fixAutoScroll() {
    if (window.location.hash) return; // jesli URL ma anchor, zostaw
    var scrollFix = function(){
      if (window.scrollY > 100) window.scrollTo(0, 0);
    };
    scrollFix();
    setTimeout(scrollFix, 100);
    setTimeout(scrollFix, 500);
    setTimeout(scrollFix, 1000);
  }

  // ===== 10d) UPSELLS - Skomponuj swoj box =====
  // v16: buduje JEDNA sekcje upselli (kafelki). Wywolywana 2x (gora i dol).
  function buildUpsellsSection(all, uiL, basePrice) {
    var tagFree = uiL.tagFree || 'Gratis';
    var tagPers = uiL.tagPersonalize || 'z personalizacją';

    var tilesHtml = all.map(function(u, idx){
      var hasPersonalize = !!u.personalization;
      var priceStr = (Number(u.price) > 0) ? Number(u.price).toFixed(2).replace('.', ',') + ' zł' : tagFree;
      var tagsHtml = '';
      if (Number(u.price) === 0) tagsHtml += '<span class="tb-up-tag tb-up-tag-free">'+tagFree+'</span>';
      if (hasPersonalize) tagsHtml += '<span class="tb-up-tag tb-up-tag-pers">'+tagPers+'</span>';

      var personalizeHtml = '';
      if (hasPersonalize) {
        var p = u.personalization;
        var inputHtml = '';
        if (p.type === 'textarea') {
          inputHtml = '<textarea data-up-personalize="'+u.id+'" rows="3" maxlength="'+(p.maxLength||500)+'" placeholder="'+(p.placeholder||'')+'"></textarea>';
        } else if (p.type === 'select') {
          var opts = (p.options||[]).map(function(o){ return '<option value="'+o+'">'+o+'</option>'; }).join('');
          inputHtml = '<select data-up-personalize="'+u.id+'"><option value="">— wybierz —</option>'+opts+'</select>';
        } else {
          inputHtml = '<input type="text" data-up-personalize="'+u.id+'" maxlength="'+(p.maxLength||200)+'" placeholder="'+(p.placeholder||'')+'">';
        }
        personalizeHtml =
          '<div class="tb-up-personalize" hidden>'+
            '<label class="tb-up-personalize-label">'+(p.label||'Treść')+(p.required?' <span class="tb-up-required">*</span>':'')+'</label>'+
            inputHtml+
            (p.maxLength?'<div class="tb-up-counter"><span data-up-counter="'+u.id+'">0</span> / '+p.maxLength+'</div>':'')+
          '</div>';
      }

      return ''+
        '<label class="tb-up-card" data-up-id="'+u.id+'" data-up-price="'+(u.price||0)+'" data-up-required="'+(hasPersonalize && u.personalization.required ? '1' : '0')+'">'+
          '<div class="tb-up-check">'+
            '<input type="checkbox" data-up-checkbox="'+u.id+'">'+
            '<span class="tb-up-checkmark"></span>'+
          '</div>'+
          '<div class="tb-up-img-wrap">'+
            '<img class="tb-up-img" src="'+(u.img||'')+'" alt="'+u.name+'" loading="lazy">'+
          '</div>'+
          '<div class="tb-up-body">'+
            '<div class="tb-up-head">'+
              '<h4 class="tb-up-name">'+u.name+'</h4>'+
              '<div class="tb-up-price">'+priceStr+'</div>'+
            '</div>'+
            (u.desc?'<p class="tb-up-desc">'+u.desc+'</p>':'')+
            (tagsHtml?'<div class="tb-up-tags">'+tagsHtml+'</div>':'')+
            personalizeHtml+
          '</div>'+
        '</label>';
    }).join('');

    var section = el('section', { class: 'tb-upsells', 'data-base-price': basePrice, html:
      '<div class="tb-up-wrap">'+
        '<div class="tb-up-head-sec">'+
          '<span class="tb-up-eyebrow">'+(uiL.eyebrow||'// Skomponuj swój box')+'</span>'+
          '<h2 class="tb-up-title">'+(uiL.title||'Dorzuć coś')+' <em>'+(uiL.titleEm||'ekstra')+'</em></h2>'+
          '<p class="tb-up-sub">'+(uiL.sub||'Dodatki idą razem z boxem, w jednej paczce.')+'</p>'+
        '</div>'+
        '<div class="tb-up-grid">'+tilesHtml+'</div>'+
        '<div class="tb-up-sum">'+
          '<div class="tb-up-sum-rows">'+
            '<div class="tb-up-sum-row"><span>'+(uiL.sumBoxLabel||'Box')+'</span><span data-up-sum-box>'+(basePrice ? basePrice.toFixed(2).replace('.', ',') + ' zł' : '—')+'</span></div>'+
            '<div class="tb-up-sum-row tb-up-sum-extras" data-up-sum-extras-wrap hidden><span>Dodatki <span data-up-extras-count>0</span></span><span data-up-sum-extras>0,00 zł</span></div>'+
            '<div class="tb-up-sum-row tb-up-sum-total"><span>'+(uiL.sumLabel||'Razem')+'</span><span data-up-sum-total>'+(basePrice ? basePrice.toFixed(2).replace('.', ',') + ' zł' : '—')+'</span></div>'+
          '</div>'+
          '<button class="tb-up-cta" data-up-submit>'+
            '<span data-up-cta-label>'+(uiL.ctaNone||'Wybierz dodatki')+'</span>'+
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'+
          '</button>'+
        '</div>'+
      '</div>' });
    return section;
  }

  // v16: upselle NA GORZE (po hero) I NA DOLE (po slajdach) - user feedback.
  // Dwie niezalezne sekcje; initUpsellsLogic dziala w obrebie swojej sekcji.
  function injectUpsells() {
    if (!isProductPage()) return;
    var boxKey = urlToBoxKey();
    if (!boxKey) return;
    var ups = (T.upsells || {});
    var all = (ups['universal'] || []).concat(ups[boxKey] || []);
    if (!all.length) { LOG('Upsells: brak dla', boxKey); return; }
    var uiL = T.upsellsUI || {};
    var basePrice = getBoxPrice();

    // GORA: tuz po karcie produktu (przed slajdami)
    var card = document.querySelector('.product_card.left_category');
    if (card) {
      var top = buildUpsellsSection(all, uiL, basePrice);
      top.classList.add('tb-upsells-top');
      card.after(top);
      initUpsellsLogic(top, all);
    }
    // DOL: po slajdach (lub tabeli whatsInside)
    var bottomAnchor = document.querySelector('.tb-sklad') || document.querySelector('.tb-whats-inside');
    if (bottomAnchor) {
      var bottom = buildUpsellsSection(all, uiL, basePrice);
      bottom.classList.add('tb-upsells-bottom');
      bottomAnchor.after(bottom);
      initUpsellsLogic(bottom, all);
    }
    LOG('Upsells: gora+dol wyrenderowane dla', boxKey);
  }

  function getBoxPrice() {
    var priceEl = document.querySelector('.product-page .price, .product-informations .core_priceFormat, .product-price .core_priceFormat');
    if (!priceEl) return 0;
    var txt = priceEl.textContent.trim();
    var m = txt.match(/[\d]+[.,]?[\d]*/);
    if (!m) return 0;
    return parseFloat(m[0].replace(',', '.'));
  }

  function initUpsellsLogic(section, items) {
    var uiL = T.upsellsUI || {};
    var basePrice = parseFloat(section.getAttribute('data-base-price')) || 0;
    var selected = {}; // { upsellId: { price, personalize } }

    // Counter dla personalizacji
    section.querySelectorAll('[data-up-personalize]').forEach(function(input){
      var id = input.getAttribute('data-up-personalize');
      input.addEventListener('input', function(){
        var counter = section.querySelector('[data-up-counter="'+id+'"]');
        if (counter) counter.textContent = input.value.length;
        if (selected[id]) selected[id].personalize = input.value;
      });
    });

    // Card click handling
    section.querySelectorAll('.tb-up-card').forEach(function(card){
      var id = card.getAttribute('data-up-id');
      var price = parseFloat(card.getAttribute('data-up-price')) || 0;
      var required = card.getAttribute('data-up-required') === '1';
      var checkbox = card.querySelector('[data-up-checkbox]');
      var personalize = card.querySelector('.tb-up-personalize');

      checkbox.addEventListener('change', function(){
        if (checkbox.checked) {
          selected[id] = { price: price, personalize: '', required: required };
          card.classList.add('selected');
          if (personalize) personalize.hidden = false;
        } else {
          delete selected[id];
          card.classList.remove('selected');
          if (personalize) personalize.hidden = true;
        }
        updateSummary();
      });
    });

    function updateSummary() {
      var extras = Object.keys(selected);
      var extrasSum = extras.reduce(function(s, k){ return s + selected[k].price; }, 0);
      var total = basePrice + extrasSum;

      var extrasWrap = section.querySelector('[data-up-sum-extras-wrap]');
      var extrasEl = section.querySelector('[data-up-sum-extras]');
      var extrasCountEl = section.querySelector('[data-up-extras-count]');
      var totalEl = section.querySelector('[data-up-sum-total]');
      var ctaLabel = section.querySelector('[data-up-cta-label]');
      var cta = section.querySelector('[data-up-submit]');

      if (extras.length > 0) {
        extrasWrap.hidden = false;
        extrasEl.textContent = extrasSum.toFixed(2).replace('.', ',') + ' zł';
        extrasCountEl.textContent = '(' + extras.length + ')';
        ctaLabel.textContent = uiL.ctaAdd || 'Dodaj wszystko do koszyka';
        cta.classList.add('ready');
      } else {
        extrasWrap.hidden = true;
        ctaLabel.textContent = uiL.ctaNone || 'Wybierz dodatki';
        cta.classList.remove('ready');
      }
      totalEl.textContent = total.toFixed(2).replace('.', ',') + ' zł';
    }

    // Submit handler - AUTO ADD TO CART
    var submitBtn = section.querySelector('[data-up-submit]');
    submitBtn.addEventListener('click', function(){
      var extras = Object.keys(selected);
      if (extras.length === 0) return alert('Najpierw wybierz dodatki — albo kliknij standardowy "Do koszyka" by zamówić sam box.');

      // Walidacja personalizacji required
      for (var i = 0; i < extras.length; i++) {
        var id = extras[i];
        var s = selected[id];
        if (s.required && !s.personalize.trim()) {
          var card = section.querySelector('[data-up-id="'+id+'"]');
          var item = items.filter(function(it){ return it.id === id; })[0];
          alert('Pole "' + (item && item.personalization && item.personalization.label || 'personalizacja') + '" jest wymagane.');
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }

      // Zapisz wybor do localStorage (dla bannera w koszyku z personalizacjami)
      var orderData = {
        timestamp: Date.now(),
        box: { url: window.location.pathname, title: document.title },
        upsells: extras.map(function(id){
          var item = items.filter(function(it){ return it.id === id; })[0];
          return {
            id: id,
            name: item ? item.name : id,
            price: selected[id].price,
            personalize: selected[id].personalize || null,
            personalizeLabel: item && item.personalization ? item.personalization.label : null,
            url: item ? item.url : null,
            productId: item ? item.productId : null
          };
        })
      };
      var existing = [];
      try { existing = JSON.parse(localStorage.getItem('tb_upsells') || '[]'); } catch(e){}
      existing.push(orderData);
      localStorage.setItem('tb_upsells', JSON.stringify(existing));

      // === AUTO-CART FLOW ===
      submitBtn.disabled = true;
      var origLabel = submitBtn.querySelector('[data-up-cta-label]');
      if (origLabel) origLabel.textContent = 'Dodaje do koszyka...';

      // 1) Najpierw dodaj GŁÓWNY BOX (kliknij natywny przycisk SkyShop)
      var nativeBtn = document.querySelector('.button_addToCart, .btn-primary[data-ng-click*="addToCart"]:not([data-up-submit])');
      if (nativeBtn) {
        // WYMUSZ no-redirect przed kliknięciem
        nativeBtn.setAttribute('data-redirect', '0');
        try { nativeBtn.click(); } catch(e) { LOG('Main box add err:', e.message); }
      }
      // Auto-zamknij SkyShop SweetAlert popup ktory moze sie pojawic po addToCart
      autoCloseSkyAlerts();

      // 2) Sekwencyjnie dodaj kazdy upsell przez clone-and-click
      var upsellsList = orderData.upsells.filter(function(u){ return u.productId; });
      var added = 0, failed = 0;

      function addNext(idx) {
        if (idx >= upsellsList.length) {
          // Wszystko dodane - pokaz summary
          if (origLabel) origLabel.textContent = added + ' dodatkow dodanych';
          setTimeout(function(){
            showUpsellSuccess(orderData, items, added, failed);
            submitBtn.disabled = false;
            if (origLabel) origLabel.textContent = t('upsellsUI.ctaAdd', 'Dodaj wszystko do koszyka');
            // Wyczysc zaznaczenia
            section.querySelectorAll('.tb-up-card.selected').forEach(function(c){
              c.classList.remove('selected');
              var cb = c.querySelector('[data-up-checkbox]');
              if (cb) { cb.checked = false; }
            });
            selected = {};
            updateSummary();
          }, 500);
          return;
        }
        var u = upsellsList[idx];
        addUpsellToCart(u.productId).then(function(){
          added++;
          if (origLabel) origLabel.textContent = 'Dodano ' + added + '/' + upsellsList.length + '...';
          setTimeout(function(){ addNext(idx + 1); }, 600);
        }).catch(function(err){
          failed++;
          LOG('Upsell add failed:', u.name, err);
          setTimeout(function(){ addNext(idx + 1); }, 300);
        });
      }
      // Czekaj 800ms na finalizacje dodania boxa, potem dodaj upselle
      setTimeout(function(){ addNext(0); }, 800);
    });
  }

  // Helper: zamknij wszystkie SweetAlert / popup-y SkyShop ktore moga sie pojawic
  function autoCloseSkyAlerts() {
    // Probuj kilka razy przez 4 sekundy (popup moze sie pojawic z opoznieniem)
    var attempts = 0;
    var iv = setInterval(function(){
      attempts++;
      // SweetAlert 2
      var swal = document.querySelector('.swal2-container, .swal2-popup, .swal-overlay');
      if (swal) {
        // Znajdz przycisk "Kontynuuj zakupy" lub "Anuluj" - prefer ten
        var btns = swal.querySelectorAll('button');
        var continueBtn = null;
        btns.forEach(function(b){
          var txt = (b.textContent || '').toLowerCase();
          if (txt.indexOf('kontynuuj') >= 0 || txt.indexOf('continue') >= 0 || txt.indexOf('zakup') >= 0 || txt.indexOf('zamkn') >= 0 || txt.indexOf('cancel') >= 0) {
            if (!continueBtn) continueBtn = b;
          }
        });
        if (continueBtn) {
          continueBtn.click();
        } else {
          // Fallback: kliknij X (close button) lub backdrop
          var closeBtn = swal.querySelector('.swal2-close, [class*="close"]');
          if (closeBtn) closeBtn.click();
          else {
            // Ukryj brutalnie
            swal.style.display = 'none';
            document.body.classList.remove('swal2-shown', 'swal2-height-auto');
          }
        }
        LOG('Zamknieto SkyShop popup');
        clearInterval(iv);
      }
      if (attempts > 20) clearInterval(iv); // 20 * 200ms = 4s
    }, 200);
  }

  // Helper: programowe dodanie produktu do koszyka SkyShop przez Angular $scope
  function addUpsellToCart(productId) {
    return new Promise(function(resolve, reject) {
      if (!window.angular) return reject('Angular nie zaladowany');

      // Znajdz DOWOLNY przycisk addToCart na stronie (Angular juz go zinit-owal)
      var origBtn = document.querySelector('[data-ng-click="addToCart($event)"]')
                 || document.querySelector('.button_addToCart');
      if (!origBtn) return reject('Brak buttonu SkyShop addToCart');

      var $el = window.angular.element(origBtn);
      var $scope = $el.scope();
      if (!$scope || typeof $scope.addToCart !== 'function') return reject('Brak $scope.addToCart');

      // Stworz fake button (musi byc w kontenerze .product-card lub .product-tile)
      var container = origBtn.closest('.product-card') || origBtn.closest('.product-tile')
                   || origBtn.closest('.product-informations')
                   || document.querySelector('.product-card, .product-tile, .product-informations')
                   || origBtn.parentElement;
      if (!container) return reject('Brak kontenera produktu');

      var fake = origBtn.cloneNode(false); // shallow - bez dzieci
      fake.setAttribute('data-product-id', String(productId));
      fake.setAttribute('data-redirect', '0');
      fake.setAttribute('data-min', '1');
      fake.setAttribute('data-amount', '999');
      fake.removeAttribute('disabled');
      fake.removeAttribute('aria-disabled');
      fake.removeAttribute('id');
      fake.style.cssText = 'position:absolute;top:-9999px;left:-9999px;opacity:0;pointer-events:none;width:1px;height:1px;';
      container.appendChild(fake);

      var fakeEvent = {
        currentTarget: fake,
        preventDefault: function(){},
        stopPropagation: function(){}
      };

      try {
        $scope.addToCart(fakeEvent);
        if (typeof $scope.$apply === 'function') {
          try { $scope.$apply(); } catch(e) {}
        }
        setTimeout(function(){
          try { fake.remove(); } catch(e){}
          resolve();
        }, 700);
      } catch (err) {
        try { fake.remove(); } catch(e){}
        reject((err && err.message) || 'addToCart throw');
      }
    });
  }

  function showUpsellSuccess(orderData, items, added, failed) {
    var bg = el('div', { class: 'tb-modal-bg active', id: 'tb-upsell-success' });
    var rowsHtml = orderData.upsells.map(function(u, i){
      return '<div class="tb-up-summary-row">'+
        '<div class="tb-up-summary-num">'+(i+1)+'</div>'+
        '<div class="tb-up-summary-body">'+
          '<div class="tb-up-summary-name">'+u.name+(u.price > 0 ? ' <small>'+u.price.toFixed(2).replace('.', ',')+' zl</small>' : ' <small>gratis</small>')+'</div>'+
          (u.personalize ? '<div class="tb-up-summary-pers"><span>'+(u.personalizeLabel||'Personalizacja')+':</span> "'+u.personalize+'"</div>' : '')+
        '</div>'+
      '</div>';
    }).join('');
    bg.innerHTML =
      '<div class="tb-modal" style="max-width: 600px;">'+
        '<button class="tb-modal-close" aria-label="Zamknij">&#x2715;</button>'+
        '<div class="tb-form-check">&check;</div>'+
        '<h3 style="text-align:center;">Box <em>w koszyku</em></h3>'+
        '<p class="tb-modal-sub" style="text-align:center;">Glowny box + '+added+' dodatkow zostalo dodane do Twojego koszyka.</p>'+
        '<div class="tb-up-summary-list">'+rowsHtml+'</div>'+
        (failed > 0 ? '<p class="tb-form-note" style="color: var(--tb-cyan);">Uwaga: '+failed+' dodatkow nie udalo sie dodac automatycznie. Sprobuj recznie.</p>' : '')+
        '<div style="display:flex;gap:12px;margin-top:24px;">'+
          '<a href="/cart" class="tb-form-submit" style="flex:1;text-align:center;text-decoration:none;">Przejdz do koszyka &rarr;</a>'+
          '<button class="tb-b2b-cta" data-up-close-summary style="flex:1;">Kontynuuj zakupy</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(bg);
    document.body.style.overflow = 'hidden';
    function close(){ bg.classList.remove('active'); document.body.style.overflow = ''; setTimeout(function(){ try { bg.remove(); } catch(e){} }, 300); }
    bg.addEventListener('click', function(e){
      if (e.target === bg || e.target.classList.contains('tb-modal-close') || e.target.hasAttribute('data-up-close-summary')) close();
    });
  }

  function showUpsellSummary(orderData, items) {
    var bg = el('div', { class: 'tb-modal-bg active', id: 'tb-upsell-summary' });
    var rowsHtml = orderData.upsells.map(function(u, i){
      return ''+
        '<div class="tb-up-summary-row">'+
          '<div class="tb-up-summary-num">'+(i+1)+'</div>'+
          '<div class="tb-up-summary-body">'+
            '<div class="tb-up-summary-name">'+u.name+(u.price > 0 ? ' <small>'+u.price.toFixed(2).replace('.', ',')+' zł</small>' : ' <small>gratis</small>')+'</div>'+
            (u.personalize ? '<div class="tb-up-summary-pers"><span>'+(u.personalizeLabel||'Personalizacja')+':</span> "'+u.personalize+'"</div>' : '')+
            (u.url ? '<a href="'+u.url+'" class="tb-up-summary-link" target="_blank">→ Dokończ dodanie tego upsellu do koszyka</a>' : '')+
          '</div>'+
        '</div>';
    }).join('');

    bg.innerHTML =
      '<div class="tb-modal" style="max-width: 640px;">'+
        '<button class="tb-modal-close" aria-label="Zamknij">&#x2715;</button>'+
        '<span class="tb-quiz-q">// Twoja konfiguracja</span>'+
        '<h3>Box <em>w koszyku</em></h3>'+
        '<p class="tb-modal-sub">Główny box został dodany do Twojego koszyka. Aby dokończyć kompozycję, kliknij każdy z dodatków poniżej — otworzy się w nowej karcie z przyciskiem "Do koszyka":</p>'+
        '<div class="tb-up-summary-list">'+rowsHtml+'</div>'+
        '<p class="tb-form-note" style="margin-top:20px;">Personalizacje zapisaliśmy lokalnie — pojawią się też na stronie koszyka jako podpowiedź dla nas przy pakowaniu.</p>'+
        '<button class="tb-form-submit" data-up-close-summary>Rozumiem, dokończę zamówienie</button>'+
      '</div>';
    document.body.appendChild(bg);
    document.body.style.overflow = 'hidden';

    function close(){ bg.classList.remove('active'); document.body.style.overflow = ''; setTimeout(function(){ bg.remove(); }, 300); }
    bg.addEventListener('click', function(e){
      if (e.target === bg || e.target.classList.contains('tb-modal-close') || e.target.hasAttribute('data-up-close-summary')) close();
    });
  }

  // ===== 10e) BANNER UPSELL na stronie koszyka =====
  function injectCartBanner() {
    if (window.location.pathname.indexOf('/cart') === -1 && window.location.pathname.indexOf('/koszyk') === -1) return;
    var data = [];
    try { data = JSON.parse(localStorage.getItem('tb_upsells') || '[]'); } catch(e){ return; }
    if (!data.length) return;
    var last = data[data.length - 1];
    if (!last || !last.upsells || !last.upsells.length) return;
    // Pokaz banner z personalizacjami zeby zaplecze widzialo
    var rows = last.upsells.filter(function(u){ return u.personalize; }).map(function(u){
      return '<li><strong>'+u.name+':</strong> '+(u.personalizeLabel||'')+' "'+u.personalize+'"</li>';
    }).join('');
    if (!rows) return;
    var banner = el('div', { class: 'tb-cart-banner', html:
      '<div class="tb-cart-banner-inner">'+
        '<strong>Personalizacje z Twojej konfiguracji:</strong>'+
        '<ul>'+rows+'</ul>'+
        '<small>Przekaż te dane w komentarzu do zamówienia podczas finalizacji, lub odzwiedaj — sprawdzimy localStorage.</small>'+
      '</div>' });
    var anchor = document.querySelector('.cart, .koszyk, main');
    if (anchor) anchor.insertBefore(banner, anchor.firstChild);
  }

  // ===== 11) FAQ =====
  function initFAQ() {
    var qs = document.querySelectorAll('.faq-question');
    qs.forEach(function(q){
      q.addEventListener('click', function(){
        var item = q.parentElement;
        var ans = item.querySelector('.faq-answer');
        var act = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(function(o){
          o.classList.remove('active');
          var a = o.querySelector('.faq-answer');
          if (a) a.style.maxHeight = null;
        });
        if (!act) {
          item.classList.add('active');
          if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
        }
      });
    });
  }

  // ===== 12) STICKY + REVEAL =====
  function initSticky() {
    var h = document.querySelector('.header[data-sticky="yes"]');
    if (!h) return;
    var fn = function(){
      if (window.scrollY > 80) h.classList.add('is-sticky','sticky-active');
      else h.classList.remove('is-sticky','sticky-active');
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
  }
  function initReveal() {
    if (!('IntersectionObserver' in window) || reducedMotion()) return;
    var els = document.querySelectorAll('.division-wrapper, .highlight-card, .product-tile, .products_slider .product, .tb-mystery-card, .tb-manifest-text, .tb-wi-row');
    els.forEach(function(el){
      el.style.opacity = 0;
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 700ms cubic-bezier(.2,.8,.2,1), transform 700ms cubic-bezier(.2,.8,.2,1)';
    });
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (e.isIntersecting) {
          e.target.style.opacity = 1;
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function(e){ io.observe(e); });
  }

  // ===== 13) CONFIGURATOR FAB =====
  function injectConfigurator() {
    var fab = el('button', {
      class: 'tb-fab',
      'aria-label': 'Pomoc wyboru boxa',
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>'+t('quiz.fab','Pomóż mi wybrać')+'</span>'
    });
    document.body.appendChild(fab);

    var bg = el('div', { class: 'tb-modal-bg', id: 'tb-quiz-bg' });
    bg.innerHTML =
      '<div class="tb-modal">'+
        '<button class="tb-modal-close" aria-label="Zamknij">&#x2715;</button>'+
        '<h3>'+t('quiz.title','Pomożemy wybrać')+'</h3>'+
        '<p class="tb-modal-sub">'+t('quiz.sub','Trzy szybkie pytania.')+'</p>'+
        '<div class="tb-quiz-step active" data-step="1">'+
          '<div class="tb-quiz-q">'+t('quiz.step1','// Krok 1 z 3 — Dla kogo?')+'</div>'+
          '<button class="tb-quiz-opt" data-pick="me">'+t('quiz.step1_me','Dla siebie')+'</button>'+
          '<button class="tb-quiz-opt" data-pick="gift">'+t('quiz.step1_gift','W prezencie')+'</button>'+
        '</div>'+
        '<div class="tb-quiz-step" data-step="2-me">'+
          '<div class="tb-quiz-q">'+t('quiz.step2me','// Krok 2 z 3 — Co lubisz robić wieczorami?')+'</div>'+
          '<button class="tb-quiz-opt" data-pick="game">'+t('quiz.step2me_game','Gram w gry')+'</button>'+
          '<button class="tb-quiz-opt" data-pick="movie">'+t('quiz.step2me_movie','Oglądam filmy / seriale')+'</button>'+
          '<button class="tb-quiz-opt" data-pick="exotic">'+t('quiz.step2me_exotic','Próbuję czegoś nowego')+'</button>'+
          '<button class="tb-quiz-back" data-back="1">&larr; '+t('quiz.back','Wstecz')+'</button>'+
        '</div>'+
        '<div class="tb-quiz-step" data-step="2-gift">'+
          '<div class="tb-quiz-q">'+t('quiz.step2gift','// Krok 2 z 3 — Kim jest obdarowany?')+'</div>'+
          '<button class="tb-quiz-opt" data-pick="gamer">'+t('quiz.step2gift_gamer','Gracz / fan tech')+'</button>'+
          '<button class="tb-quiz-opt" data-pick="cinema">'+t('quiz.step2gift_cinema','Kinoman')+'</button>'+
          '<button class="tb-quiz-opt" data-pick="foodie">'+t('quiz.step2gift_foodie','Smakosz')+'</button>'+
          '<button class="tb-quiz-back" data-back="1">&larr; '+t('quiz.back','Wstecz')+'</button>'+
        '</div>'+
        '<div class="tb-quiz-step" data-step="3">'+
          '<div class="tb-quiz-q">'+t('quiz.step3','// Krok 3 z 3 — Jaki budżet?')+'</div>'+
          '<button class="tb-quiz-opt" data-pick="m">'+t('quiz.step3_m','Do 90 zł')+'</button>'+
          '<button class="tb-quiz-opt" data-pick="l">'+t('quiz.step3_l','Powyżej 90 zł')+'</button>'+
          '<button class="tb-quiz-back" data-back="2">&larr; '+t('quiz.back','Wstecz')+'</button>'+
        '</div>'+
        '<div class="tb-quiz-step" data-step="result">'+
          '<div class="tb-quiz-result">'+
            '<div class="tb-quiz-result-label">'+t('quiz.resultLabel','// Polecamy')+'</div>'+
            '<h4 data-result-name>Box</h4>'+
            '<p data-result-desc></p>'+
            '<a href="#" data-result-link class="tb-mystery-card-cta">'+t('quiz.resultCta','Zobacz box')+' &rarr;</a><br>'+
            '<button class="tb-quiz-back" data-restart="1">&larr; '+t('quiz.restart','Zacznij od nowa')+'</button>'+
          '</div>'+
        '</div>'+
      '</div>';
    document.body.appendChild(bg);

    var state = { who: null, ctx: null };
    var products = {
      'game-m':   { name: 'Box Gamer',     desc: '8 pozycji: Pringles, RedBull, Lays, Doritos i wiecej.',  link: '/Box-Gamer' },
      'game-l':   { name: 'Box Gamer XL',  desc: '12 pozycji z Toblerone i ostra zupka.',                  link: '/Box-Gamer-XL' },
      'movie-m':  { name: 'Box Filmowy',   desc: 'Popcorn, M&M\'s, Twix, cola w szkle, Lays.',             link: '/Box-Filmowy-p118' },
      'movie-l':  { name: 'Box Filmowy XL','desc': '12 pozycji + nachosy, bake rolls, kinder bueno.',      link: '/Box-Filmowy-XL-p119' },
      'exotic-m': { name: 'Box Kokos',     desc: 'Suszony kokos, zelki, bounty, woda z pulpa.',            link: '/kokos' },
      'exotic-l': { name: 'Box Mango',     desc: 'Mango w 10 wariantach: sagiko, mochi, chili.',           link: '/mango' },
      'gamer-m':  { name: 'Box Gamer',     desc: '8 pozycji: Pringles, RedBull, Lays, Doritos.',           link: '/Box-Gamer' },
      'gamer-l':  { name: 'Box Gamer XL',  desc: 'Pelne 12 pozycji + Toblerone i ostra zupka.',            link: '/Box-Gamer-XL' },
      'cinema-m': { name: 'Box Filmowy',   desc: 'Popcorn, M&M\'s, Twix, cola.',                            link: '/Box-Filmowy-p118' },
      'cinema-l': { name: 'Box Filmowy XL','desc': '+ nachosy, bake rolls, kinder bueno. Na trylogie.',    link: '/Box-Filmowy-XL-p119' },
      'foodie-m': { name: 'Box Kokos',     desc: 'Azjatyckie nowosci: kokosy, zelki, woda z pulpa.',       link: '/kokos' },
      'foodie-l': { name: 'Box Mango',     desc: 'Mango w 10 wariantach.',                                  link: '/mango' }
    };
    function show(s){ bg.querySelectorAll('.tb-quiz-step').forEach(function(el){ el.classList.remove('active'); }); var t=bg.querySelector('[data-step="'+s+'"]'); if(t) t.classList.add('active'); }
    function showResult(k){ var p=products[k]; if(!p) return; bg.querySelector('[data-result-name]').textContent=p.name; bg.querySelector('[data-result-desc]').textContent=p.desc; bg.querySelector('[data-result-link]').setAttribute('href',p.link); show('result'); }
    fab.addEventListener('click', function(){ bg.classList.add('active'); document.body.style.overflow='hidden'; state={who:null,ctx:null}; show('1'); });
    bg.addEventListener('click', function(e){ if(e.target===bg||e.target.classList.contains('tb-modal-close')){ bg.classList.remove('active'); document.body.style.overflow=''; }});
    bg.querySelectorAll('.tb-quiz-opt').forEach(function(b){
      b.addEventListener('click', function(){
        var p = b.getAttribute('data-pick');
        var s = b.closest('.tb-quiz-step').getAttribute('data-step');
        if (s==='1'){ state.who=p; show(p==='me'?'2-me':'2-gift'); }
        else if (s==='2-me'||s==='2-gift'){ state.ctx=p; show('3'); }
        else if (s==='3'){ showResult(state.ctx+'-'+p); }
      });
    });
    bg.querySelectorAll('.tb-quiz-back').forEach(function(b){
      b.addEventListener('click', function(){
        var back = b.getAttribute('data-back'); var r = b.getAttribute('data-restart');
        if (r){ state={who:null,ctx:null}; show('1'); return; }
        if (back==='1') show('1');
        if (back==='2') show(state.who==='me'?'2-me':'2-gift');
      });
    });
  }

  // ===== USP ROW — 4 ikony pod cena (v9.7: teksty + ikony z content.json) =====
  // Editable w content.json -> productPage.usp[]
  // Kazdy item: { icon: 'clock'|'gift'|'mail'|'star'|..., label: 'tekst' }
  function injectUSPRow() {
    if (!isProductPage()) return;
    if (document.querySelector('.tb-usp-row')) return;
    var anchor = document.querySelector('.product-add-to-cart')
              || document.querySelector('[class*="product-add-to-cart"]')
              || document.querySelector('.product-final-price')
              || document.querySelector('[class*="product-price"]');
    if (!anchor) { LOG('USPRow: brak anchor'); return; }

    // Biblioteka ikon SVG (Lucide-style, stroke 1.75)
    var ICONS = {
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
      mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
      star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
    };

    // Default fallback - uzyte jesli brak danych w content.json
    var DEFAULTS = [
      { icon: 'clock', label: 'Wysyłka 24h' },
      { icon: 'gift',  label: 'Gotowy prezent' },
      { icon: 'mail',  label: 'Bilecik gratis' },
      { icon: 'star',  label: 'Premium pakowanie' }
    ];

    var items = (T.productPage && Array.isArray(T.productPage.usp) && T.productPage.usp.length)
                ? T.productPage.usp
                : DEFAULTS;

    var html = items.map(function(it){
      var iconKey = (it.icon || 'check').toLowerCase();
      var svg = ICONS[iconKey] || ICONS.check;
      return '<div class="tb-usp-item">'+
               '<div class="tb-usp-icon">'+svg+'</div>'+
               '<div class="tb-usp-label">'+(it.label || '')+'</div>'+
             '</div>';
    }).join('');

    var row = el('div', { class: 'tb-usp-row', html: html });
    anchor.parentNode.insertBefore(row, anchor);
    LOG('USPRow:', items.length, 'USP wstrzyknieto (zrodlo:', T.productPage && T.productPage.usp ? 'content.json' : 'defaults', ')');
  }

  function init() {
    LOG('init() start, path=', window.location.pathname, 'home?', isHomePage(), 'product?', isProductPage());
    safe('initSticky', initSticky);
    safe('initFAQ', initFAQ);
    safe('initScrollProgress', initScrollProgress);
    safe('initParticles', initParticles);
    safe('initCursorBlob', initCursorBlob);
    safe('initGlitch', initGlitch);
    safe('injectMarquee', injectMarquee);
    safe('injectGTAGrid', injectGTAGrid);
    safe('injectHomeSections', injectHomeSections);
    safe('injectWaitlist', injectWaitlist);
    safe('injectSkladSlideshow', injectSkladSlideshow);
    safe('injectWhatsInside', injectWhatsInside);
    safe('hideSkyShopVariants', hideSkyShopVariants);
    safe('injectUSPRow', injectUSPRow);
    safe('injectUpsells', injectUpsells);
    safe('injectCartBanner', injectCartBanner);
    safe('injectConfigurator', injectConfigurator);
    safe('fixAutoScroll', fixAutoScroll);
    setTimeout(function(){
      safe('initReveal', initReveal);
      safe('initMagnetic', initMagnetic);
      safe('initTilt', initTilt);
    }, 100);
    LOG('init() done');
  }
  // Loader content.json + sklad.json - laduje teksty i slajdy przed init()
  function loadContentThenInit() {
    var ts = '?ts=' + Date.now(); // cache-bust query
    if (typeof fetch !== 'function' || typeof Promise === 'undefined') {
      LOG('fetch/Promise unavailable, init with defaults'); init(); return;
    }
    var pContent = fetch(CONTENT_URL + ts, { cache: 'no-store' })
      .then(function(r){ if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function(json){ T = json || {}; LOG('content.json loaded, keys:', Object.keys(T).join(',')); })
      .catch(function(e){ LOG('content.json failed:', e.message, '- fallback defaults'); });
    var pSklad = fetch(SKLAD_URL + ts, { cache: 'no-store' })
      .then(function(r){ if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function(json){ S = json || {}; LOG('sklad.json loaded, boxy:', Object.keys(S).filter(function(k){return k[0]!=='_';}).length); })
      .catch(function(e){ LOG('sklad.json failed:', e.message, '- tabela whatsInside zostaje'); });
    Promise.all([pContent, pSklad]).then(function(){ init(); });
  }

  function bootstrap(){ loadContentThenInit(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap);
  else bootstrap();
})();
