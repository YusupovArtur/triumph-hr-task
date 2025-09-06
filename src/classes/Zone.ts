import { PolygonData } from '../types/PolygonData';
import { DataAction } from '../types/DataAction';
import { DataSource } from '../types/DataSource';
import { PolygonDragEventData } from '../types/PolygonDragEventData';
import { POLYGON_CONFIG } from '../config';

export class Zone extends HTMLElement {
  protected _data: PolygonData[] = [];
  protected dataSource: DataSource = null;

  protected setDragAndDropHandler() {
    this.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    this.addEventListener('drop', (event) => {
      event.preventDefault();

      const json = event.dataTransfer?.getData('text/plain');
      if (!json) return;

      try {
        const dataTransfer: PolygonDragEventData = JSON.parse(json);

        if (dataTransfer.dataSource !== this.dataSource) {
          this.dispatchEvent(
            new CustomEvent<PolygonDragEventData>('polygon-moved', {
              detail: dataTransfer,
              bubbles: true,
              composed: true,
            }),
          );
          this._data.push({ ...dataTransfer.data, strokeWidth: POLYGON_CONFIG.strokeWidth });
          this._data.forEach((dataItem) => {
            dataItem.strokeWidth = POLYGON_CONFIG.strokeWidth;
          });
          setTimeout(() => {
            this.render();
          });
        }
      } catch (error) {
        console.error('Drop event error', error);
      }
    });
  }

  dispatchData(action: DataAction): void {
    switch (action.type) {
      case 'add':
        this._data.push(action.payload);
        this.render();
        break;
      case 'remove':
        this._data = this._data.filter((data) => data.id !== action.payload.id);
        this.render();
        break;
    }
  }

  get data(): PolygonData[] {
    return this._data;
  }

  set data(value: PolygonData[]) {
    this._data = value;
    this.render();
  }

  protected render(): void {}
}
