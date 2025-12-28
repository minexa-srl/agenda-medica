import * as L from 'leaflet';

export interface LeafletIcon extends L.Icon.Default {
  _getIconUrl?: () => string;
}
