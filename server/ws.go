package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"server/protocol"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var terminalMap = make(map[string]*Terminal, 10000)

func ws(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()
	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		cmd := protocol.WsCommond{}
		err = json.Unmarshal(message, &cmd)
		println("server rec:" + string(message))
		switch cmd.Mode {
		case 0:
			cc := protocol.ConnectCommond{}
			err = json.Unmarshal([]byte(cmd.Data), &cc)
			t, err := Connect(cc.Address, cc.Number)
			if err != nil {
				c.WriteJSON("连接失败")
			}
			terminalMap[cc.Number] = t
			t.Auth()
			break
		case 1:
			cc := protocol.TraceItem{}
			err = json.Unmarshal([]byte(cmd.Data), &cc)
			terminalMap[cc.Number].Report(cc.Longitude, cc.Latitude, cc.Speed, cc.Time)
			break
		case 2:
			terminalMap[cmd.Data].Disconnect()
			break
		}
		for _, v := range terminalMap {
			v.Disconnect()
		}
	}
}
