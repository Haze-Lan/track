export type MapClickCallback=(longitude:number,latitude:number)=>void

export  class  TraceItem {
    number:string=""
    second:number=0;
    //经度
    longitude:number=0;
    //纬度
    latitude:number=0;
    //速度
    speed:number=0;
    //油量
    oil:number=0;
    //高程
    elevation:number=0;
    //方位
    direction:number=0;
    //日期时间
    time:string="";
}
//指令类容
export declare class CMD{
    mode:CMDType;
    data:string
}

export enum CMDType{
    Login,Point,Logout
}