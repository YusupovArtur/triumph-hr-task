import { LocalStorageData } from '../../types/LocalStorageData';
import { LOCAL_STORAGE_ITEM } from '../../config';

export function setLocalData(data: LocalStorageData): LocalStorageData {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(LOCAL_STORAGE_ITEM, jsonData);

  return data;
}
