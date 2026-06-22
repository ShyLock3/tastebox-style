/* TasteBox v5 - INJECTOR FULL - host: shylock3.github.io/tastebox-style/inject.js
   particles canvas, cursor blob, 3D tilt, magnetic CTA, scroll bar, glitch hero,
   marquee, mystery box, manifest, B2B, configurator, waitlist (formsubmit.co),
   what's inside table on product pages
*/

(function(){
  'use strict';

  var EMAIL = 'patrykbatorski@gmail.com';
  var FORM_ENDPOINT = 'https://formsubmit.co/' + EMAIL;

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
    if (p.indexOf('filmowy-xl') > -1) return 'box-filmowy-xl';
    if (p.indexOf('filmowy') > -1)    return 'box-filmowy';
    if (p.indexOf('gamer-xl') > -1)   return 'box-gamer-xl';
    if (p.indexOf('gamer') > -1)      return 'box-gamer';
    if (p.indexOf('kokos') > -1)      return 'box-kokos';
    if (p.indexOf('mango') > -1)      return 'box-mango';
    return null;
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
  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }
  function isTouch() {
    return window.matchMedia('(pointer: coarse)').matches;
  }

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
    var anchor = document.querySelector('.slider.slider_container_450');
    if (!anchor) return;
    var brands = ['LAYS','RED BULL',"M&M'S",'PRINGLES','TWIX','DORITOS','OREO','MOUNTAIN DEW','TOBLERONE','BOUNTY','MILKA','POCKY','MOGU MOGU','SAGIKO','KINDER BUENO'];
    var track = brands.concat(brands).map(function(b){
      return '<span class="tb-marquee-item">'+b+'</span><span class="tb-marquee-dot">&bull;</span>';
    }).join('');
    var marquee = el('section', { class: 'tb-marquee', html:
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
          '<span class="tb-mystery-eyebrow">Nowosc &mdash; Subskrypcja miesieczna</span>'+
          '<h2 class="tb-mystery-title">Slepa randka <em>ze smakami</em></h2>'+
          '<p class="tb-mystery-sub">Co miesiac inny, autorski box. Nie wiesz co dostaniesz &mdash; my wiemy ze bedzie pyszne. Zarezerwuj miejsce zanim ruszymy.</p>'+
        '</div>'+
        '<div class="tb-mystery-grid">'+
          '<div class="tb-mystery-card">'+
            '<div class="tb-mystery-card-tag">A &mdash; Standard</div>'+
            '<div class="tb-mystery-card-visual"></div>'+
            '<h3>Mystery Standard</h3>'+
            '<p>14 pozycji w czarnym pudelku. Mieszanka polskich klasykow i azjatyckich nowosci. Pierwsza paczka w dniu startu.</p>'+
            '<div class="tb-mystery-card-foot">'+
              '<div class="tb-mystery-card-price">99 zl<small>/MIESIAC</small></div>'+
              '<button class="tb-mystery-card-cta" data-waitlist="Mystery Standard">Zarezerwuj &rarr;</button>'+
            '</div>'+
          '</div>'+
          '<div class="tb-mystery-card featured">'+
            '<div class="tb-mystery-card-tag">B &mdash; Max</div>'+
            '<div class="tb-mystery-card-visual"></div>'+
            '<h3>Mystery Max</h3>'+
            '<p>22 pozycje + limited drop, ktorego nie sprzedajemy nigdzie indziej. Dla tych, ktorzy lubia byc zaskakiwani na duza skale.</p>'+
            '<div class="tb-mystery-card-foot">'+
              '<div class="tb-mystery-card-price">169 zl<small>/MIESIAC</small></div>'+
              '<button class="tb-mystery-card-cta" data-waitlist="Mystery Max">Zarezerwuj &rarr;</button>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>' });
    anchor.after(mystery);

    var manifest = el('section', { class: 'tb-manifest', html:
      '<div class="tb-manifest-wrap">'+
        '<span class="tb-manifest-eyebrow">// Manifest TasteBox</span>'+
        '<p class="tb-manifest-text">Zalozyli&#347;my TasteBox, bo nikt nie powinien <em>kombinowac z prezentem</em> w ostatniej chwili. Wybierasz box. My pakujemy. Dostaje &mdash; otwiera &mdash; usmiecha sie. <em>Tyle.</em></p>'+
        '<div class="tb-manifest-sig">TasteBox &middot; Est. 2024 &middot; Warszawa</div>'+
      '</div>' });
    mystery.after(manifest);

    var b2b = el('section', { class: 'tb-b2b', html:
      '<div class="tb-b2b-wrap">'+
        '<div>'+
          '<span class="tb-b2b-badge">&bull; Wkrotce &bull; B2B</span>'+
          '<h3>Prezenty dla zespolu? Dzialamy nad tym.</h3>'+
          '<p>Pakujemy boxy z brandingiem, dla 10 osob albo 500. Faktura VAT, dostawa na konkretna date. Pod koniec roku oficjalnie startujemy &mdash; zostaw mail, dam Ci znac jako pierwszemu.</p>'+
        '</div>'+
        '<div class="tb-b2b-cta-wrap">'+
          '<button class="tb-b2b-cta" data-waitlist="B2B">Zostaw mail &rarr;</button>'+
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
        '<h3>Zarezerwuj <em>swoje miejsce</em></h3>'+
        '<p class="tb-modal-sub">Damy Ci znac jako pierwszemu kiedy ruszymy. Bez spamu, jeden mail w pakiet.</p>'+
        '<form id="tb-waitlist-form" action="'+FORM_ENDPOINT+'" method="POST">'+
          '<input type="hidden" name="_captcha" value="false">'+
          '<input type="hidden" name="_template" value="table">'+
          '<input type="hidden" name="_subject" value="TasteBox - waitlist zgloszenie">'+
          '<input type="hidden" name="zainteresowanie" value="Mystery Standard">'+
          '<div class="tb-form-row">'+
            '<label class="tb-form-label">Imie</label>'+
            '<input type="text" name="imie" required placeholder="Jak Cie zwa">'+
          '</div>'+
          '<div class="tb-form-row">'+
            '<label class="tb-form-label">E-mail</label>'+
            '<input type="email" name="email" required placeholder="ty@email.pl">'+
          '</div>'+
          '<div class="tb-form-row" id="tb-form-firm">'+
            '<label class="tb-form-label">Firma (opcjonalne)</label>'+
            '<input type="text" name="firma" placeholder="np. Acme Sp. z o.o.">'+
          '</div>'+
          '<div class="tb-form-row">'+
            '<label class="tb-form-label">Komentarz (opcjonalne)</label>'+
            '<textarea name="komentarz" rows="3" placeholder="Cokolwiek warto wiedziec"></textarea>'+
          '</div>'+
          '<button type="submit" class="tb-form-submit">Zapisuje sie &rarr;</button>'+
          '<p class="tb-form-note">Wysylajac zgadzasz sie ze odezwiemy sie mailem. Mozesz wypisac sie w kazdej chwili.</p>'+
        '</form>'+
        '<div class="tb-form-success" hidden>'+
          '<div class="tb-form-check">&check;</div>'+
          '<h4>Jestes na liscie</h4>'+
          '<p>Pierwszy email dostaniesz na dniach. Dziekujemy!</p>'+
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
      submitBtn.textContent = 'Wysylam...';
      fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function(r){
          if (r.ok) { form.style.display='none'; success.hidden=false; }
          else { alert('Cos poszlo nie tak. Napisz na '+EMAIL); submitBtn.disabled=false; submitBtn.textContent='Zapisuje sie -->'; }
        })
        .catch(function(){ alert('Brak polaczenia. Napisz na '+EMAIL); submitBtn.disabled=false; submitBtn.textContent='Zapisuje sie -->'; });
    });
  }

  // ===== 10) WHAT'S INSIDE TABLE =====
  function injectWhatsInside() {
    if (!isProductPage()) return;
    var key = urlToBoxKey();
    if (!key) return;
    var data = BOX_CONTENTS[key];
    if (!data) return;
    var anchor = document.querySelector('.product-description') ||
                 document.querySelector('.product-informations') ||
                 document.querySelector('.products_slider');
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
          '<span class="tb-wi-eyebrow">// Co dokladnie dostajesz</span>'+
          '<h2 class="tb-wi-title">W srodku <em>'+data.items.length+' pozycji</em></h2>'+
          '<p class="tb-wi-sub">'+data.tagline+'. Wszystko z certyfikatem, data waznosci min. 6 miesiecy, polskie i azjatyckie marki.</p>'+
        '</div>'+
        '<div class="tb-wi-table">'+
          '<div class="tb-wi-row tb-wi-header">'+
            '<div class="tb-wi-idx">#</div>'+
            '<div class="tb-wi-name">Pozycja</div>'+
            '<div class="tb-wi-cat">Kategoria</div>'+
            '<div class="tb-wi-g">Gramatura</div>'+
          '</div>'+
          rows+
        '</div>'+
      '</div>' });
    anchor.after(section);
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
      'aria-label': 'Pomoz mi wybrac box',
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>Pomoz mi wybrac</span>'
    });
    document.body.appendChild(fab);

    var bg = el('div', { class: 'tb-modal-bg', id: 'tb-quiz-bg' });
    bg.innerHTML =
      '<div class="tb-modal">'+
        '<button class="tb-modal-close" aria-label="Zamknij">&#x2715;</button>'+
        '<h3>Pomozemy <em>wybrac</em></h3>'+
        '<p class="tb-modal-sub">Trzy szybkie pytania &mdash; zaraz wiemy, ktory box jest dla Ciebie.</p>'+
        '<div class="tb-quiz-step active" data-step="1">'+
          '<div class="tb-quiz-q">// Krok 1 z 3 &mdash; Dla kogo?</div>'+
          '<button class="tb-quiz-opt" data-pick="me">Dla siebie</button>'+
          '<button class="tb-quiz-opt" data-pick="gift">W prezencie</button>'+
        '</div>'+
        '<div class="tb-quiz-step" data-step="2-me">'+
          '<div class="tb-quiz-q">// Krok 2 z 3 &mdash; Co lubisz robic wieczorami?</div>'+
          '<button class="tb-quiz-opt" data-pick="game">Gram w gry</button>'+
          '<button class="tb-quiz-opt" data-pick="movie">Ogladam filmy / seriale</button>'+
          '<button class="tb-quiz-opt" data-pick="exotic">Probuje czegos nowego (Azja)</button>'+
          '<button class="tb-quiz-back" data-back="1">&larr; Wstecz</button>'+
        '</div>'+
        '<div class="tb-quiz-step" data-step="2-gift">'+
          '<div class="tb-quiz-q">// Krok 2 z 3 &mdash; Kim jest obdarowany?</div>'+
          '<button class="tb-quiz-opt" data-pick="gamer">Gracz / fan tech</button>'+
          '<button class="tb-quiz-opt" data-pick="cinema">Kinoman / serialowiec</button>'+
          '<button class="tb-quiz-opt" data-pick="foodie">Smakosz, lubi nowosci</button>'+
          '<button class="tb-quiz-back" data-back="1">&larr; Wstecz</button>'+
        '</div>'+
        '<div class="tb-quiz-step" data-step="3">'+
          '<div class="tb-quiz-q">// Krok 3 z 3 &mdash; Jaki budzet?</div>'+
          '<button class="tb-quiz-opt" data-pick="m">Do 90 zl (rozmiar M)</button>'+
          '<button class="tb-quiz-opt" data-pick="l">Powyzej 90 zl (XL)</button>'+
          '<button class="tb-quiz-back" data-back="2">&larr; Wstecz</button>'+
        '</div>'+
        '<div class="tb-quiz-step" data-step="result">'+
          '<div class="tb-quiz-result">'+
            '<div class="tb-quiz-result-label">// Polecamy</div>'+
            '<h4 data-result-name>Box</h4>'+
            '<p data-result-desc></p>'+
            '<a href="#" data-result-link class="tb-mystery-card-cta">Zobacz box &rarr;</a><br>'+
            '<button class="tb-quiz-back" data-restart="1">&larr; Zacznij od nowa</button>'+
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

  function init() {
    initSticky();
    initFAQ();
    initScrollProgress();
    initParticles();
    initCursorBlob();
    initGlitch();
    injectMarquee();
    injectHomeSections();
    injectWaitlist();
    injectWhatsInside();
    injectConfigurator();
    setTimeout(function(){
      initReveal();
      initMagnetic();
      initTilt();
    }, 100);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
