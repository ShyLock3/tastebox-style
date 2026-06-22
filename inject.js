/* TasteBox v4 - JS injector - host: shylock3.github.io/tastebox-style/inject.js */
/* Wstrzykuje nowe sekcje + configurator FAB na stronie glownej */

(function(){
  'use strict';

  // ====== FAQ accordion (z poprzedniej wersji - zostaje) ======
  document.addEventListener('DOMContentLoaded', function () {
    var q = document.querySelectorAll('.faq-question');
    q.forEach(function(question){
      question.addEventListener('click', function(){
        var item = question.parentElement;
        var answer = item.querySelector('.faq-answer');
        var isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(function(el){
          el.classList.remove('active');
          var ans = el.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  });

  // ====== Sticky header detection ======
  document.addEventListener('DOMContentLoaded', function(){
    var header = document.querySelector('.header[data-sticky="yes"]');
    if (!header) return;
    var onScroll = function(){
      if (window.scrollY > 80) header.classList.add('is-sticky','sticky-active');
      else header.classList.remove('is-sticky','sticky-active');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });

  // ====== Reveal on scroll (subtelne pojawianie sekcji) ======
  document.addEventListener('DOMContentLoaded', function(){
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var els = document.querySelectorAll('.division-wrapper, .highlight-card, .product-tile, .products_slider .product, .tb-mystery-card, .tb-manifest-text');
    els.forEach(function(el){
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)';
    });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function(el){ io.observe(el); });
  });

  // ====== Injector: nowe sekcje TYLKO na stronie glownej ======
  document.addEventListener('DOMContentLoaded', function(){
    var path = window.location.pathname;
    var isHome = (path === '/' || path === '' || path === '/index' || path === '/home');
    if (!isHome) return;

    var anchor = document.querySelector('.products_slider') || document.querySelector('.highlights') || document.querySelector('.division');
    if (!anchor) return;

    // ---- 1) MYSTERY BOX ----
    var mystery = document.createElement('section');
    mystery.className = 'tb-mystery';
    mystery.innerHTML =
      '<div class="tb-mystery-wrap">' +
        '<div class="tb-mystery-head">' +
          '<span class="tb-mystery-eyebrow">Nowosc &mdash; Subskrypcja miesieczna</span>' +
          '<h2 class="tb-mystery-title">Slepa randka <em>ze smakami</em></h2>' +
          '<p class="tb-mystery-sub">Co miesiac inny, autorski box. Nie wiesz co dostaniesz &mdash; my wiemy ze bedzie pyszne. Anulujesz w dwa klikniecia.</p>' +
        '</div>' +
        '<div class="tb-mystery-grid">' +
          '<div class="tb-mystery-card">' +
            '<div class="tb-mystery-card-tag">A &mdash; Standard</div>' +
            '<div class="tb-mystery-card-visual"></div>' +
            '<h3>Mystery Standard</h3>' +
            '<p>14 pozycji w czarnym pudelku. Mieszanka polskich klasykow i azjatyckich nowosci. Pierwsza paczka w 48h, kolejne 1. dnia kazdego miesiaca.</p>' +
            '<div class="tb-mystery-card-foot">' +
              '<div class="tb-mystery-card-price">99 zl<small>/MIESIAC</small></div>' +
              '<a href="#" class="tb-mystery-card-cta">Wybieram Standard &rarr;</a>' +
            '</div>' +
          '</div>' +
          '<div class="tb-mystery-card featured">' +
            '<div class="tb-mystery-card-tag">B &mdash; Max</div>' +
            '<div class="tb-mystery-card-visual"></div>' +
            '<h3>Mystery Max</h3>' +
            '<p>22 pozycje + limited drop, ktorego nie sprzedajemy nigdzie indziej. Dla tych, ktorzy lubia byc zaskakiwani na duza skale.</p>' +
            '<div class="tb-mystery-card-foot">' +
              '<div class="tb-mystery-card-price">169 zl<small>/MIESIAC</small></div>' +
              '<a href="#" class="tb-mystery-card-cta">Wybieram Max &rarr;</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    anchor.after(mystery);

    // ---- 2) MANIFEST ----
    var manifest = document.createElement('section');
    manifest.className = 'tb-manifest';
    manifest.innerHTML =
      '<div class="tb-manifest-wrap">' +
        '<span class="tb-manifest-eyebrow">// Manifest TasteBox</span>' +
        '<p class="tb-manifest-text">Zalozyli&#347;my TasteBox, bo nikt nie powinien <em>kombinowac z prezentem</em> w ostatniej chwili. Wybierasz box. My pakujemy. Dostaje &mdash; otwiera &mdash; usmiecha sie. <em>Tyle.</em></p>' +
        '<div class="tb-manifest-sig">TasteBox &middot; Est. 2024 &middot; Warszawa</div>' +
      '</div>';
    mystery.after(manifest);

    // ---- 3) B2B TEASER ----
    var b2b = document.createElement('section');
    b2b.className = 'tb-b2b';
    b2b.innerHTML =
      '<div class="tb-b2b-wrap">' +
        '<div>' +
          '<span class="tb-b2b-badge">&bull; Wkrotce &bull; B2B</span>' +
          '<h3>Prezenty dla zespolu? Dzialamy nad tym.</h3>' +
          '<p>Pakujemy boxy z brandingiem, dla 10 osob albo 500. Faktura VAT, dostawa na konkretna date. Pod koniec roku oficjalnie startujemy &mdash; zostaw mail, dam Ci znac jako pierwszemu.</p>' +
        '</div>' +
        '<div class="tb-b2b-cta-wrap">' +
          '<a href="mailto:patrykbatorski@gmail.com?subject=B2B%20TasteBox%20-%20zainteresowanie" class="tb-b2b-cta">Zostaw mail &rarr;</a>' +
        '</div>' +
      '</div>';
    manifest.after(b2b);
  });

  // ====== CONFIGURATOR FAB + MODAL (na kazdej stronie) ======
  document.addEventListener('DOMContentLoaded', function(){
    // FAB button
    var fab = document.createElement('button');
    fab.className = 'tb-fab';
    fab.setAttribute('aria-label', 'Pomoz mi wybrac box');
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>Pomoz mi wybrac</span>';
    document.body.appendChild(fab);

    // Modal background
    var bg = document.createElement('div');
    bg.className = 'tb-modal-bg';
    bg.innerHTML =
      '<div class="tb-modal" role="dialog" aria-modal="true" aria-labelledby="tb-modal-title">' +
        '<button class="tb-modal-close" aria-label="Zamknij">&#x2715;</button>' +
        '<h3 id="tb-modal-title">Pomozemy wybrac</h3>' +
        '<p class="tb-modal-sub">Trzy szybkie pytania &mdash; zaraz mowimy, ktory box jest dla Ciebie.</p>' +
        // STEP 1
        '<div class="tb-quiz-step active" data-step="1">' +
          '<div class="tb-quiz-q">// Krok 1 z 3 &mdash; Dla kogo?</div>' +
          '<button class="tb-quiz-opt" data-pick="me">Dla siebie</button>' +
          '<button class="tb-quiz-opt" data-pick="gift">W prezencie</button>' +
        '</div>' +
        // STEP 2A - me
        '<div class="tb-quiz-step" data-step="2-me">' +
          '<div class="tb-quiz-q">// Krok 2 z 3 &mdash; Co zwykle robisz wieczorami?</div>' +
          '<button class="tb-quiz-opt" data-pick="game">Gram w gry</button>' +
          '<button class="tb-quiz-opt" data-pick="movie">Ogladam filmy/seriale</button>' +
          '<button class="tb-quiz-opt" data-pick="exotic">Probuje czegos nowego</button>' +
          '<button class="tb-quiz-back" data-back="1">&larr; Wstecz</button>' +
        '</div>' +
        // STEP 2B - gift
        '<div class="tb-quiz-step" data-step="2-gift">' +
          '<div class="tb-quiz-q">// Krok 2 z 3 &mdash; Kim jest obdarowywany?</div>' +
          '<button class="tb-quiz-opt" data-pick="gamer">Gracz / fan tech</button>' +
          '<button class="tb-quiz-opt" data-pick="cinema">Kinoman / molcokrotny</button>' +
          '<button class="tb-quiz-opt" data-pick="foodie">Smakosz lubi probowac</button>' +
          '<button class="tb-quiz-back" data-back="1">&larr; Wstecz</button>' +
        '</div>' +
        // STEP 3 - size
        '<div class="tb-quiz-step" data-step="3">' +
          '<div class="tb-quiz-q">// Krok 3 z 3 &mdash; Jaki budzet?</div>' +
          '<button class="tb-quiz-opt" data-pick="m">Do 90 zl (rozmiar M)</button>' +
          '<button class="tb-quiz-opt" data-pick="l">Powyzej 90 zl (rozmiar L/XL)</button>' +
          '<button class="tb-quiz-back" data-back="2">&larr; Wstecz</button>' +
        '</div>' +
        // RESULT
        '<div class="tb-quiz-step" data-step="result">' +
          '<div class="tb-quiz-result">' +
            '<div class="tb-quiz-result-label">// Polecamy</div>' +
            '<h4 data-result-name>Box</h4>' +
            '<p data-result-desc></p>' +
            '<a href="#" data-result-link class="tb-mystery-card-cta">Zobacz box &rarr;</a>' +
            '<br>' +
            '<button class="tb-quiz-back" data-restart="1">&larr; Zacznij od nowa</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bg);

    var state = { who: null, ctx: null };

    var products = {
      'game-m':    { name: 'Box Gamer',     desc: 'Pringles, RedBull, Lays, Doritos i 6 innych. Dla krotkich sesji.',                 link: '/Box-Gamer-p?' },
      'game-l':    { name: 'Box Gamer XL',  desc: 'Pelne 13 pozycji z Toblerone i ostra zupka. Na 12-godzinny maraton.',              link: '/Box-Gamer-XL-p?' },
      'movie-m':   { name: 'Box Filmowy',   desc: 'Popcorn, M&M\'s, Twix, cola w szkle i wiecej. Na film + przekaski.',                link: '/Box-Filmowy-p118' },
      'movie-l':   { name: 'Box Filmowy XL','desc': 'Plus nachosy z dipem, bake rolls, kinder bueno, helena. Maraton starcza.',       link: '/Box-Filmowy-XL-p119' },
      'exotic-m':  { name: 'Box Kokos',     desc: 'Suszony kokos, zelki kokos, woda z pulpa, bounty. Tropiki w pudelku.',              link: '/kokos' },
      'exotic-l':  { name: 'Box Mango',     desc: 'Mango w 10 wariantach &mdash; sagiko, mochi, suszone, chili. Prosto z Azji.',       link: '/mango' },
      'gamer-m':   { name: 'Box Gamer',     desc: 'Pringles, RedBull, Lays, Doritos i 6 innych. Klasyk gamera.',                      link: '/Box-Gamer-p?' },
      'gamer-l':   { name: 'Box Gamer XL',  desc: 'Pelne 13 pozycji z Toblerone i ostra zupka. Sesja na cala noc.',                   link: '/Box-Gamer-XL-p?' },
      'cinema-m':  { name: 'Box Filmowy',   desc: 'Popcorn, M&M\'s, Twix, cola w szkle. Wiecz&#243;r z filmem.',                       link: '/Box-Filmowy-p118' },
      'cinema-l':  { name: 'Box Filmowy XL','desc': 'Plus nachosy z dipem, bake rolls, kinder bueno. Na trylogie.',                    link: '/Box-Filmowy-XL-p119' },
      'foodie-m':  { name: 'Box Kokos',     desc: 'Tropikalny zestaw azjatyckich nowosci &mdash; mlode kokosy, zelki, woda z pulpa.', link: '/kokos' },
      'foodie-l':  { name: 'Box Mango',     desc: 'Mango w 10 wariantach &mdash; suszone, w mochi, w napoju, w chili.',               link: '/mango' }
    };

    function show(step) {
      bg.querySelectorAll('.tb-quiz-step').forEach(function(el){ el.classList.remove('active'); });
      var target = bg.querySelector('[data-step="'+step+'"]');
      if (target) target.classList.add('active');
    }

    function showResult(key) {
      var p = products[key];
      if (!p) return;
      bg.querySelector('[data-result-name]').textContent = p.name;
      bg.querySelector('[data-result-desc]').innerHTML = p.desc;
      bg.querySelector('[data-result-link]').setAttribute('href', p.link);
      show('result');
    }

    fab.addEventListener('click', function(){
      bg.classList.add('active');
      document.body.style.overflow = 'hidden';
      show('1');
      state = { who: null, ctx: null };
    });
    bg.addEventListener('click', function(e){
      if (e.target === bg || e.target.classList.contains('tb-modal-close')) {
        bg.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    bg.querySelectorAll('.tb-quiz-opt').forEach(function(btn){
      btn.addEventListener('click', function(){
        var pick = btn.getAttribute('data-pick');
        var step = btn.closest('.tb-quiz-step').getAttribute('data-step');
        if (step === '1') {
          state.who = pick;
          show(pick === 'me' ? '2-me' : '2-gift');
        } else if (step === '2-me' || step === '2-gift') {
          state.ctx = pick;
          show('3');
        } else if (step === '3') {
          var key = state.ctx + '-' + pick;
          showResult(key);
        }
      });
    });
    bg.querySelectorAll('.tb-quiz-back').forEach(function(btn){
      btn.addEventListener('click', function(){
        var back = btn.getAttribute('data-back');
        var restart = btn.getAttribute('data-restart');
        if (restart) { state = { who: null, ctx: null }; show('1'); return; }
        if (back === '1') show('1');
        if (back === '2') show(state.who === 'me' ? '2-me' : '2-gift');
      });
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && bg.classList.contains('active')) {
        bg.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

})();
