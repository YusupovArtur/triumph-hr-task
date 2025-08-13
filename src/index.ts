import './components/PolygonItem';
import './components/BufferZone';
import './components/WorkZone';
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
};

const clearHandler = () => {
  localStorage.removeItem('polygons');
  alert('Данные удалены');
};

window.addEventListener('DOMContentLoaded', () => {
  const createButton = document.getElementById('create-btn');
  if (createButton) createButton.addEventListener('click', createHandler);

  const saveBtn = document.getElementById('save-btn');
  if (saveBtn) saveBtn.addEventListener('click', saveHandler);

  const clearBtn = document.getElementById('clear-btn');
  if (clearBtn) clearBtn.addEventListener('click', clearHandler);
});

const saved = JSON.parse(localStorage.getItem('polygons')) as PolygonData[];
bufferZone.data = saved ?? getPolygonDataArray();
