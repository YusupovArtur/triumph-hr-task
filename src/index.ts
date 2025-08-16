import './components/PolygonItem';
import './components/BufferZone';
import './components/WorkZone';
import './components/ButtonPrimary';
import './icons/IconArrowRepeat';
import './icons/IconSave';
import './icons/IconClear';
import './style/style.css';
import { BufferZone } from './components/BufferZone';
import { WorkZone } from './components/WorkZone';
import { PolygonDragEventData } from './types/PolygonDragEventData';
import { getPolygonDataArray } from './helpers/getPolygonDataArray';
import { PolygonData } from './types/PolygonData';

const bufferZone = document.querySelector('buffer-zone') as BufferZone;
const workZone = document.querySelector('work-zone') as WorkZone;

workZone.addEventListener('polygon-moved', (event: CustomEvent<PolygonDragEventData>) => {
  bufferZone.dispatchData({ type: 'remove', payload: event.detail.data });
});

bufferZone.addEventListener('polygon-moved', (event: CustomEvent<PolygonDragEventData>) => {
  workZone.dispatchData({ type: 'remove', payload: event.detail.data });
});

const createHandler = () => {
  bufferZone.data = getPolygonDataArray();
  workZone.data = [];
};

const saveHandler = () => {
  const jsonData = JSON.stringify([...bufferZone.data, ...workZone.data]);
  localStorage.setItem('polygons', jsonData);
  alert('Данные сохранены');
  updateClearButtonState();
};

const clearHandler = () => {
  localStorage.removeItem('polygons');
  alert('Данные удалены');
  updateClearButtonState();
};

const updateClearButtonState = () => {
  const saved = localStorage.getItem('polygons');
  const clearBtnWrapper = document.getElementById('clear-btn'); // Это кастомный элемент <button-primary>
  if (clearBtnWrapper) {
    const innerButton = clearBtnWrapper.querySelector('button') as HTMLButtonElement | null;
    if (innerButton) {
      innerButton.disabled = !saved;
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const createButtonWrapper = document.getElementById('create-btn');
  if (createButtonWrapper) {
    const innerCreateButton = createButtonWrapper.querySelector('button');
    if (innerCreateButton) innerCreateButton.addEventListener('click', createHandler);
  }

  const saveBtnWrapper = document.getElementById('save-btn');
  if (saveBtnWrapper) {
    const innerSaveButton = saveBtnWrapper.querySelector('button');
    if (innerSaveButton) innerSaveButton.addEventListener('click', saveHandler);
  }

  const clearBtnWrapper = document.getElementById('clear-btn');
  if (clearBtnWrapper) {
    const innerClearButton = clearBtnWrapper.querySelector('button');
    if (innerClearButton) innerClearButton.addEventListener('click', clearHandler);
  }

  updateClearButtonState();
});

const saved = JSON.parse(localStorage.getItem('polygons')) as PolygonData[];
bufferZone.data = saved ?? getPolygonDataArray();
