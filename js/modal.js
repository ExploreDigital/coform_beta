const CLASS_CIRCLE = '.circle';
const CLASS_ICON = '.icon-elements';
const CLASS_MODAL = '.modal-wrapper';
const CLASS_ICON_ACTIVE = 'js-icon-active';
const CLASS_MODAL_ACTIVE = 'js-modal-active';

const elementCircle = document.querySelector(CLASS_CIRCLE);
const elementIcon = document.querySelector(CLASS_ICON);
const elementModal = document.querySelector(CLASS_MODAL);
const elementInput = document.querySelector('#myInput');

const triggerAnimation = () => {
  const isActive = elementIcon.classList.contains(CLASS_ICON_ACTIVE);
  console.log(isActive);
  isActive ? (
    elementIcon.classList.remove(CLASS_ICON_ACTIVE),
    elementModal.classList.remove(CLASS_MODAL_ACTIVE)
  ) : (
    elementIcon.classList.add(CLASS_ICON_ACTIVE),
    elementModal.classList.add(CLASS_MODAL_ACTIVE)
  );
}

elementCircle.addEventListener('click', () => triggerAnimation());