import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { getDistance } from 'ol/sphere';
import { MapClickCallback } from './common';
import 'ol/ol.css';
import { Stroke, Style } from 'ol/style';
import { Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import { Draw, Modify, Snap } from 'ol/interaction';
export class GeoMap {
    private mapObject!: Map;
    private target!: string;
    private lineLayer!: VectorLayer<VectorSource>
    private source!: VectorSource
    public constructor(target: string) {
        this.target = target;
    }
    /**
     * 初始化地图
     */
    public init(): void {
        this.source = new VectorSource(),
            this.lineLayer = new VectorLayer({
                source: this.source,
                style: new Style({
                    stroke: new Stroke({
                        color: '#ff0000',
                        width: 2,
                    }),
                }),
                zIndex: Number.MAX_SAFE_INTEGER
            });
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
        this.mapObject.addLayer(this.lineLayer)
        this.mapObject.addInteraction(
            new Draw({
                source: this.source,
                type: 'LineString',
            })
        );
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

    public listenClick(callback: MapClickCallback): void {
        this.mapObject.on('singleclick', (evt) => {
            const point = transform([evt.coordinate[0], evt.coordinate[1]], 'EPSG:3857', 'EPSG:4326')
            callback(point[0], point[1])
        });
    }
    public clear() {
        this.source.clear()
    }
    /**
     * 计算两点距离
     * @param a 
     * @param b 
     * @returns  单位米
     */
    public distance(a: number[], b: number[]): number {
        return getDistance(a, b)
    }
}