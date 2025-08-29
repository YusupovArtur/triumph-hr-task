import './components/PolygonItem';
import './components/BufferZone';
import './components/WorkZone';
// import './components/ButtonPrimary';
import './icons/IconArrowRepeat';
import './icons/IconSave';
import './icons/IconClear';
import './style/style.css';
import { BufferZone } from './components/BufferZone';
import { WorkZone } from './components/WorkZone';
import { getPolygonDataArray } from './helpers/getPolygonDataArray';
import { setLocalData } from './helpers/local_storage/setLocalData';
import { getLocalData } from './helpers/local_storage/getLocalData';
import { LocalStorageData } from './types/LocalStorageData';
import { isLocalStorageData } from './helpers/local_storage/isLocalStorageData';
import { DEFAULT_LOCAL_STORAGE_JSON_DATA, LOCAL_STORAGE_ITEM } from './config';

let isChanged = false;
const bufferZone = document.querySelector('buffer-zone') as BufferZone;
const workZone = document.querySelector('work-zone') as WorkZone;
const createButton = document.getElementById('create-btn') as HTMLButtonElement | null;
const saveButton = document.getElementById('save-btn') as HTMLButtonElement | null;
const clearButton = document.getElementById('clear-btn') as HTMLButtonElement | null;

workZone.addEventListener('polygon-moved', (event) => {
  bufferZone.dispatchData({ type: 'remove', payload: event.detail.data });
  isChanged = true;
  updateButtonsState();
});
workZone.addEventListener('polygon-moved-inner', () => {
  isChanged = true;
  updateButtonsState();
});
bufferZone.addEventListener('polygon-moved', (event) => {
  workZone.dispatchData({ type: 'remove', payload: event.detail.data });
  isChanged = true;
  updateButtonsState();
});

const createHandler = () => {
  bufferZone.data = getPolygonDataArray();
  workZone.data = [];
  workZone.polygonsCoords = {};
  isChanged = true;
  updateButtonsState();
};

const saveHandler = () => {
  localData = setLocalData({
    bufferZonePolygons: bufferZone.data,
    workZonePolygons: workZone.data,
    polygonsCoords: workZone.polygonsCoords,
  });
  isChanged = false;
  alert('Данные сохранены в Local Storage');
  updateButtonsState();
};

const clearHandler = () => {
  bufferZone.data = [];
  workZone.data = [];
  workZone.polygonsCoords = {};
  if (localData.bufferZonePolygons.length > 0 || localData.workZonePolygons.length > 0) {
    localData = setLocalData({ bufferZonePolygons: [], workZonePolygons: [], polygonsCoords: {} });
    alert('Данные удалены из Local Storage');
  }
  isChanged = true;
  updateButtonsState();
};

const updateButtonsState = () => {
  const isSaved = isLocalStorageData(JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEM) ?? DEFAULT_LOCAL_STORAGE_JSON_DATA));
  const isEmpty = !(bufferZone.data.length > 0 || workZone.data.length > 0);
  if (clearButton) clearButton.disabled = !isSaved || isEmpty;
  if (saveButton) saveButton.disabled = !isChanged;
};

window.addEventListener('DOMContentLoaded', () => {
  if (createButton) createButton.addEventListener('click', createHandler);
  if (saveButton) saveButton.addEventListener('click', saveHandler);
  if (clearButton) clearButton.addEventListener('click', clearHandler);
  updateButtonsState();
});

let localData: LocalStorageData = getLocalData();
bufferZone.data = localData.bufferZonePolygons;
workZone.data = localData.workZonePolygons;
workZone.polygonsCoords = localData.polygonsCoords;
