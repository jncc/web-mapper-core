import { Pipe, PipeTransform } from '@angular/core';
import { ILayerConfig } from './models/layer-config.model';

@Pipe({
  name: 'layerSort'
})
export class LayerSortPipe implements PipeTransform {

  transform(layers: ILayerConfig[]): any {
    return layers.sort((a: ILayerConfig, b: ILayerConfig) => a.order - b.order);
  }

}
