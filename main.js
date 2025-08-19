function makeEl(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "className") el.className = v;
      else if (k === "dataset") Object.assign(el.dataset, v);
      else if (k in el) el[k] = v;
      else el.setAttribute(k, v);
    });
    children.forEach(c => el.append(c));
    return el;
  }
  
  async function loadProjects() {
    try {
      const res = await fetch('projects.json', { cache: 'no-store' });
      const projects = await res.json();
  
      const grid = document.getElementById('projects-grid');
      grid.innerHTML = '';
  
      projects.forEach(p => {
        const card = makeEl('article', { className: 'card' });
  
        // main image
        const mainSrc = (p.images && p.images[0]) || p.image || 'assets/placeholder.png';
        const mainImg = makeEl('img', { src: mainSrc, alt: p.title, className: 'main-img' });
  
        const h3 = makeEl('h3', {}, p.title);
        const desc = makeEl('div', { className: 'small' }, p.summary);
  
        // tags
        const tags = makeEl('div', { className: 'tags' });
        (p.tags || []).forEach(t => tags.append(makeEl('span', { className: 'tag' }, t)));
  
        // thumbnails (if multiple images)
        let thumbs;
        if (p.images && p.images.length > 1) {
          thumbs = makeEl('div', { className: 'thumbs' });
          p.images.forEach((src, idx) => {
            const th = makeEl('img', {
              src,
              alt: `${p.title} screenshot ${idx + 1}`,
              className: 'thumb',
              dataset: { idx }
            });
            th.addEventListener('click', () => {
              mainImg.src = src;
            });
            thumbs.append(th);
          });
        }
  
        // actions/links
        const actions = makeEl('div', { className: 'actions' });
        if (p.links?.live) actions.append(makeEl('a', { href: p.links.live, target: '_blank', rel: 'noopener' }, 'Live'));
        if (p.links?.github) actions.append(makeEl('a', { href: p.links.github, target: '_blank', rel: 'noopener' }, 'GitHub'));
  
        card.append(mainImg, h3, desc, tags);
        if (thumbs) card.append(thumbs);
        card.append(actions);
  
        grid.append(card);
      });
    } catch (e) {
      console.error('Failed to load projects:', e);
    }
  }
  
  document.getElementById('year').textContent = new Date().getFullYear();
  loadProjects();
  