package protocol

//WS指令
type WsCommond struct {
	Mode int    `json:"mode"`
	Data string `json:"data"`
}

//
type TraceItem struct {
	Number string `json:"number"`
	//经度
	Longitude float64 `json:"longitude"`
	//纬度
	Latitude float64 `json:"latitude"`
	//速度
	Speed float64 `json:"speed"`
	//油量
	Oil float64 `json:"oil"`
	//高程
	Elevation int `json:"elevation"`
	//方位
	Direction float64 `json:"direction"`
	//日期时间
	Time string `json:"time"`
}

//
type ConnectCommond struct {
	Address string `json:"address"`
	Number  string `json:"number"`
	Timing  string `json:"timing"`
}
