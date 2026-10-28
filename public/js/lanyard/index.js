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
    size: 0.6,
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
