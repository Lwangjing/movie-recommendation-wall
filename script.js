// ============================================================
// 电影/动漫推荐墙 - 完整 JS 逻辑
// 功能：数据渲染 / 分类筛选 / 搜索 / 点赞 / Lightbox / 动效
// ============================================================
(function () {
    'use strict';

    // ============================================================
    // 数据定义 —— 6 部电影/动漫作品
    // ============================================================
    var MOVIES = [
        {
            id: 'spirited-away',
            title: '千与千寻',
            tag: '动画电影',
            category: 'anime-movie',
            meta: '宫崎骏 / 日本 / 奇幻',
            description: '荣获奥斯卡最佳动画长片奖，讲述了千寻在神灵世界的冒险故事，关于成长、勇气和自我认同的永恒寓言。',
            rating: '9.4/10',
            imagePrompt: 'cinematic still from Japanese animated film Spirited Away by Studio Ghibli, young girl in pink outfit standing on wooden bridge in mystical bathhouse town at twilight, red lanterns glowing, traditional Japanese architecture, steam rising from hot springs, dragon spirit in distant sky, warm golden and blue lighting, painterly anime art style, 4:3 aspect ratio'
        },
        {
            id: 'your-name',
            title: '你的名字',
            tag: '动画电影',
            category: 'anime-movie',
            meta: '新海诚 / 日本 / 爱情',
            description: '跨越时空的灵魂互换，编织出一段既浪漫又令人心碎的故事，视觉效果美得令人窒息。',
            rating: '9.2/10',
            imagePrompt: 'cinematic still from Japanese anime film Your Name by Makoto Shinkai, boy and girl reaching toward each other across twilight sky with comet splitting overhead, meteor shower trails, vibrant orange and purple gradient sky, Tokyo cityscape with twinkling lights, hyper-detailed clouds, dreamy atmosphere, photorealistic lighting, lens flare, 4:3 aspect ratio'
        },
        {
            id: 'inception',
            title: '盗梦空间',
            tag: '科幻电影',
            category: 'sci-fi',
            meta: '诺兰 / 美国 / 悬疑',
            description: '一场游走于梦境与现实之间的视觉盛宴，多层梦境的精妙设定让人深思，每一遍观看都有新发现。',
            rating: '9.3/10',
            imagePrompt: 'cinematic still from sci-fi film Inception by Christopher Nolan, man in sleek black suit standing in surreal dreamscape where city street folds upward like massive origami structure, gray and steel-blue color palette, dramatic shadows, fog rolling through scene, film grain, high contrast, mind-bending architectural geometry, 4:3 aspect ratio'
        },
        {
            id: 'demon-slayer',
            title: '鬼灭之刃',
            tag: '动漫',
            category: 'anime',
            meta: '吾峠呼世晴 / 日本 / 热血',
            description: '现象级动漫作品，炭治郎的复仇之路，配合史诗级的"火之神神乐"战斗场景，重新定义战斗动画标准。',
            rating: '9.1/10',
            imagePrompt: 'cinematic still from Japanese anime Demon Slayer Kimetsu no Yaiba, Tanjiro Kamado holding blue Nichirin katana with water breathing effects swirling like flowing river of turquoise and blue, cherry blossoms floating in night air, crescent moon, dark forest setting, dynamic action pose, ufotable anime art style with glowing visual effects, 4:3 aspect ratio'
        },
        {
            id: 'interstellar',
            title: '星际穿越',
            tag: '科幻电影',
            category: 'sci-fi',
            meta: '诺兰 / 美国 / 冒险',
            description: '探索宇宙奥秘与人类情感的史诗巨作，爱与时间的主题在星际间回荡，科学与情感的完美融合。',
            rating: '9.4/10',
            imagePrompt: 'cinematic still from sci-fi film Interstellar by Christopher Nolan, lone astronaut standing on barren alien planet surface looking up at massive black hole Gargantua in sky with glowing accretion disk of golden light, wormhole distortion, endless icy plain, deep space background with scattered stars, cold blue and warm amber dual-tone, epic scale, film grain, 4:3 aspect ratio'
        },
        {
            id: 'attack-on-titan',
            title: '进击的巨人',
            tag: '动漫',
            category: 'anime',
            meta: '諫山創 / 日本 / 悬疑',
            description: '从绝望中寻找希望的热血巨作，层层反转的剧情让人欲罢不能，对人性、自由的深刻探讨。',
            rating: '9.3/10',
            imagePrompt: 'cinematic still from Japanese anime Attack on Titan Shingeki no Kyojin, Eren Yeager in Attack Titan form with glowing green eyes towering above massive stone walls, steam rising from muscular titan body, soldiers in Survey Corps uniform with ODM gear flying through air on cables, apocalyptic orange and brown sky, ruined city below, dark gritty anime art style, dramatic low-angle, 4:3 aspect ratio'
        }
    ];

    // AI 图片 URL 生成
    function getImageUrl(prompt) {
        return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt='
            + encodeURIComponent(prompt)
            + '&image_size=landscape_4_3';
    }

    // 渲染卡片
    function renderCards(movies) {
        var grid = document.querySelector('.card-grid');
        grid.innerHTML = movies.map(function (movie) {
            return '<article class="card" data-id="' + movie.id + '" data-category="' + movie.category + '">'
                + '<div class="card-image"><img src="' + getImageUrl(movie.imagePrompt) + '" alt="' + movie.title + '剧照" loading="lazy"></div>'
                + '<div class="card-content">'
                + '<span class="card-tag">' + movie.tag + '</span>'
                + '<h3 class="card-title">' + movie.title + '</h3>'
                + '<p class="card-meta">' + movie.meta + '</p>'
                + '<p class="card-description">' + movie.description + '</p>'
                + '<div class="card-footer">'
                + '<div class="card-rating"><span class="rating-stars">&#11088;</span><span class="rating-score">' + movie.rating + '</span></div>'
                + '<button class="btn-like" data-id="' + movie.id + '" aria-label="点赞">&#9825;</button>'
                + '</div></div></article>';
        }).join('');
        initLikes();
        setupScrollObserver();
    }

    // 加载遮罩
    function initLoadingOverlay() {
        var overlay = document.querySelector('.loading-overlay');
        if (!overlay) return;
        setTimeout(function () {
            overlay.classList.add('fade-out');
            overlay.addEventListener('transitionend', function handler(e) {
                if (e.target === overlay && e.propertyName === 'opacity') {
                    overlay.remove();
                    overlay.removeEventListener('transitionend', handler);
                }
            });
        }, 800);
    }

    // 筛选逻辑
    var currentFilter = 'all';
    function applyFilterAndSearch() {
        var searchInput = document.querySelector('.search-input');
        var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var cards = document.querySelectorAll('.card');
        var emptyState = document.querySelector('.empty-state');
        var visibleCount = 0;
        cards.forEach(function (card) {
            var category = card.getAttribute('data-category');
            var title = (card.querySelector('.card-title') || {}).textContent || '';
            var categoryMatch = (currentFilter === 'all' || category === currentFilter);
            var searchMatch = (keyword === '' || title.toLowerCase().indexOf(keyword) !== -1);
            if (categoryMatch && searchMatch) { card.classList.remove('card-hidden'); visibleCount++; }
            else { card.classList.add('card-hidden'); }
        });
        if (visibleCount === 0) { emptyState.classList.add('visible'); }
        else { emptyState.classList.remove('visible'); }
    }

    // 搜索防抖 300ms
    var searchTimer = null;
    function debouncedSearch() {
        if (searchTimer) clearTimeout(searchTimer);
        searchTimer = setTimeout(function () { applyFilterAndSearch(); }, 300);
    }

    // 中文输入法处理
    var isComposing = false;
    function updateClearButton() {
        var si = document.querySelector('.search-input');
        var cb = document.querySelector('.search-clear');
        if (!si || !cb) return;
        if (si.value.trim().length > 0) cb.classList.add('visible');
        else cb.classList.remove('visible');
    }
    function initSearchInput() {
        var searchInput = document.querySelector('.search-input');
        var clearBtn = document.querySelector('.search-clear');
        if (!searchInput) return;
        updateClearButton();
        searchInput.addEventListener('compositionstart', function () { isComposing = true; });
        searchInput.addEventListener('compositionend', function () { isComposing = false; updateClearButton(); debouncedSearch(); });
        searchInput.addEventListener('input', function () { updateClearButton(); if (!isComposing) debouncedSearch(); });
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                searchInput.value = ''; updateClearButton();
                if (searchTimer) clearTimeout(searchTimer);
                applyFilterAndSearch(); searchInput.focus();
            });
        }
    }

    // 筛选按钮
    function initFilterButtons() {
        var filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                applyFilterAndSearch();
            });
        });
    }

    // 点赞系统 (localStorage)
    function getLikes() { try { var r = localStorage.getItem('movie_likes'); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
    function saveLikes(likes) { try { localStorage.setItem('movie_likes', JSON.stringify(likes)); } catch (e) {} }
    function initLikes() {
        var likes = getLikes();
        document.querySelectorAll('.btn-like').forEach(function (btn) {
            var mid = btn.getAttribute('data-id');
            if (likes.indexOf(mid) !== -1) { btn.classList.add('liked'); btn.innerHTML = '&#9829;'; }
            else { btn.classList.remove('liked'); btn.innerHTML = '&#9825;'; }
        });
    }
    function toggleLike(movieId, button) {
        var likes = getLikes();
        var idx = likes.indexOf(movieId);
        if (idx === -1) { likes.push(movieId); button.classList.add('liked'); button.innerHTML = '&#9829;'; }
        else { likes.splice(idx, 1); button.classList.remove('liked'); button.innerHTML = '&#9825;'; }
        saveLikes(likes);
        button.classList.remove('pop'); void button.offsetWidth; button.classList.add('pop');
        button.addEventListener('animationend', function h() { button.classList.remove('pop'); button.removeEventListener('animationend', h); });
    }

    // Lightbox
    function openLightbox(imageSrc, caption) {
        document.body.style.overflow = 'hidden';
        var overlay = document.createElement('div'); overlay.className = 'lightbox-overlay';
        overlay.innerHTML = '<button class="lightbox-close" aria-label="关闭">&#10005;</button><img class="lightbox-image" src="' + imageSrc + '" alt="' + caption + '"><p class="lightbox-caption">' + caption + '</p>';
        document.body.appendChild(overlay); bindLightboxEvents(overlay);
        requestAnimationFrame(function () { requestAnimationFrame(function () { overlay.classList.add('open'); }); });
    }
    function closeLightbox(overlay) {
        if (!overlay) return;
        overlay.classList.add('closing'); overlay.classList.remove('open');
        overlay.addEventListener('transitionend', function h(e) { if (e.target === overlay && e.propertyName === 'opacity') { overlay.remove(); document.body.style.overflow = ''; overlay.removeEventListener('transitionend', h); } });
    }
    function bindLightboxEvents(overlay) {
        function onKD(e) { if (e.key === 'Escape') { closeLightbox(overlay); document.removeEventListener('keydown', onKD); } }
        document.addEventListener('keydown', onKD);
        var cb = overlay.querySelector('.lightbox-close');
        if (cb) cb.addEventListener('click', function () { closeLightbox(overlay); document.removeEventListener('keydown', onKD); });
        overlay.addEventListener('click', function (e) { if (e.target === overlay) { closeLightbox(overlay); document.removeEventListener('keydown', onKD); } });
    }

    // 事件委托
    function initEventDelegation() {
        var cg = document.querySelector('.card-grid'); if (!cg) return;
        cg.addEventListener('click', function (e) {
            var t = e.target;
            if (t.classList.contains('btn-like') || t.closest('.btn-like')) {
                var btn = t.classList.contains('btn-like') ? t : t.closest('.btn-like');
                var mid = btn.getAttribute('data-id'); if (mid) toggleLike(mid, btn); return;
            }
            var ci = t.closest('.card-image');
            if (ci) { var img = ci.querySelector('img'); var card = t.closest('.card'); var te = card ? card.querySelector('.card-title') : null; var cap = te ? te.textContent : ''; if (img && img.src) openLightbox(img.src, cap); return; }
        });
    }

    // IntersectionObserver 滚动淡入
    function setupScrollObserver() {
        var cards = document.querySelectorAll('.card'); if (cards.length === 0) return;
        var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var card = e.target; var ac = document.querySelectorAll('.card'); var idx = Array.prototype.indexOf.call(ac, card); setTimeout(function () { card.classList.add('card-visible'); }, idx * 100); co.unobserve(card); } }); }, { root: null, rootMargin: '0px 0px -30px 0px', threshold: 0.1 });
        cards.forEach(function (c) { co.observe(c); }); window._cardObserver = co;
    }

    // 图片加载渐入
    function initImageFadeIn() {
        document.addEventListener('load', function (e) { var img = e.target; if (img && img.tagName === 'IMG' && img.closest('.card-image')) img.classList.add('loaded'); }, true);
        document.addEventListener('error', function (e) { var img = e.target; if (img && img.tagName === 'IMG') { img.alt = '图片加载失败'; img.classList.add('loaded'); } }, true);
    }

    // 初始化入口
    function init() { renderCards(MOVIES); initLoadingOverlay(); initFilterButtons(); initSearchInput(); initEventDelegation(); initImageFadeIn(); console.log('电影/动漫推荐墙已加载完成'); }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();