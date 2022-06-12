package main

import (
	"encoding/hex"
	"log"
	"math"
	"net"
	"os"
	"os/signal"
	"strconv"
)

type Terminal struct {
	con    net.Conn
	number string
}

//连接设备网关
func Connect(address string, number string) (*Terminal, error) {
	log.SetFlags(0)
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)
	c, err := net.Dial("tcp", address)
	if err != nil {
		log.Fatal("dial:", err)
		return nil, err
	}
	log.Print(c.LocalAddr().String() + "->" + c.RemoteAddr().String())
	return &Terminal{
		con:    c,
		number: number,
	}, nil
}

//标识位 消息头 消息体 检验码 标识位
//验证包
func (t *Terminal) Auth() {
	//最大999999999
	//7e0102000c014146274372000157574578464f634f5156704c3d7e
	//消息ID 2字节
	var str = "0102"
	//消息体属性 2字节 这里没有计算 随便给一个就好
	str += "0000"
	//终端手机号 6个字节
	//设备编号
	str += t.number
	//消息流水号 2个字节
	str += "0001"
	//消息包封装项目 1个字节 TODO 不处理
	// 消息体 鉴权码
	str += "000000000000"
	b, _ := hex.DecodeString(str)
	str += hex.EncodeToString([]byte{coPcheckCode(b)})
	str = "7e" + str + "7e"
	//7e 0102 0000 00000001 0001 000000000000 00 7e
	b, _ = hex.DecodeString(str)
	write, err := t.con.Write(escape(b))
	if err != nil {
		log.Print(err)
		return
	}
	log.Print("write:", write)
}

//上报包
func (t *Terminal) Report(lng float64, lat float64, speed float64, time string) {
	//7e0200 003a 014146274372 0005 00000000 00000001 015f2c0006d0b028000000000000220421164933 010400000000eb16000c00b2898607b710208003394200060089ffffffff c57e
	//消息ID 2字节
	var str = "0200"
	//消息体属性 2字节 这里没有计算 随便给一个就好
	str += "0000"
	//终端手机号 6个字节
	//设备编号
	str += t.number
	//消息流水号 2个字节
	str += "0002"
	//消息体封装项目
	// 0 报警标志 DWORD 报警标志位定义见 表 24
	str += "00000000"
	// 0 4 状态 DWORD 状态位定义见 表 25
	str += "00000003"
	// 0 8 纬度 DWORD 以度为单位的纬度值乘以 10 的 6 次方，精确到百万分之一度
	var lagS = strconv.FormatInt(int64(lat*1000000), 16)
	if len(lagS) < 8 {
		var length = len(lagS)
		for i := 0; i < 8-length; i++ {
			lagS = "0" + lagS
		}
	}
	str += lagS
	// 0 经度 DWORD 以度为单位的经度值乘以 10 的 6 次方，精确到百万分之一度
	var latS = strconv.FormatInt(int64(lng*1000000), 16)
	if len(latS) < 8 {
		var length = len(latS)
		for i := 0; i < 8-length; i++ {
			latS = "0" + latS
		}
	}
	str += latS
	// 0 高程 WORD 海拔高度，单位为米（m）
	str += "0000"
	f := speed * 10
	speedString := strconv.FormatInt(int64(math.Round(f)), 16)
	// 0 18 速度 WORD 1/10km/h
	if len(speedString) < 4 {
		var length = len(speedString)
		for i := 0; i < 4-length; i++ {
			speedString = "0" + speedString
		}
	}
	str += speedString
	// 0 20 方向 WORD 0-359，正北为 0，顺时针
	str += "0000"
	//21 时间 BCD[6] YY-MM-DD-hh-mm-ss（GMT+8 时间，本标准中之后涉及的时间均采用此时区）
	//str += time.Now().Format("060102150405")
	str += time
	//附加信息ID
	str += "01"
	//附加长度
	str += "00"
	b, _ := hex.DecodeString(str)
	str += hex.EncodeToString([]byte{coPcheckCode(b)})
	str = "7e" + str + "7e"
	b, _ = hex.DecodeString(str)
	write, err := t.con.Write(escape(b))
	if err != nil {
		log.Print(err)
		return
	}
	log.Print("write:", write)
}

func (t *Terminal) Disconnect() {
	t.con.Close()
}

//最终数据编码
func escape(src []byte) []byte {
	var bs = []byte{}
	bs = append(bs, 0x7E)
	for i := 1; i < len(src)-1; i++ {
		if src[i] == 0x7e {
			bs = append(bs, 0x7d, 0x02)
		} else if src[i] == 0x7d {
			bs = append(bs, 0x7d, 0x01)
		} else {
			bs = append(bs, src[i])
		}
	}
	bs = append(bs, 0x7E)
	return bs
}

//计算校验码 只传入需要校验的部分
func coPcheckCode(src []byte) byte {
	var comparison byte = src[0]
	for i := 1; i < len(src); i++ {
		comparison = (byte)(comparison ^ src[i])
	}
	return comparison
}
