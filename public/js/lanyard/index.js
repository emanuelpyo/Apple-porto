import { initLanyard } from './lanyard.js';

const root = document.querySelector('[data-lanyard]');
if (root) {
  const api = initLanyard(root, {
    frontImage: root.dataset.profileImage || '/images/profile.jpeg',
    name: root.dataset.name || '',
    role: root.dataset.role || '',
    location: root.dataset.location || '',
    education: root.dataset.education || '',
    imageFit: 'cover',
    cardColor: '#ffffff',
    orientation: 'portrait',
    finish: 'glossy',
    cornerRadius: 0.3,
    // Keep the card's apparent size constant as the canvas height changes.
    // frameView() fits by canvas height, so scale the size by the ratio to
    // the reference canvas that produced the original 443px card.
    size: (canvasHeight) => 0.6 * (739 / Math.max(1, canvasHeight)),
    anchor: 'center',
    strapLength: 0.5,
    strapColor: '#111111',
    strapWidth: 0.65,
    metal: 'silver',
    gravity: 1,
    damping: 0.5,
    elasticity: 0.5,
    breeze: 0.5,
    interactive: true,
    intro: true
  });
  window.__lanyard = api;
}
