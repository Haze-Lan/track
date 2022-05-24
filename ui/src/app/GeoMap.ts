import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
export class GeoMap {
    private mapObject!: Map;
    private target!: string;
    public constructor(target: string) {
        this.target = target;
    }
    /**
     * 初始化地图
     */
    public init(): void {

        this.mapObject = new Map({
            target: this.target,
            controls: [],
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    })
                })
            ],
            view: new View({
                center: [104.06, 30.67],
                zoom: 15,
                //WGS84 投影
                projection: 'EPSG:3857',
            })
        });

    }
    /**
     * 设置定位
     * @param longitude 
     * @param latitude 
     */
    public zoomAndCenter(longitude: number, latitude: number): void {
        var point = transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857');
        this.mapObject.getView().setCenter(point)
    }


}