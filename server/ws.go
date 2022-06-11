package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"server/protocol"
	"time"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

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
		switch cmd.Mode {
		case 0:
			cc := protocol.ConnectCommond{}
			err = json.Unmarshal([]byte(cmd.Data), &cc)
			timing, _ := time.Parse("2016-01-01 20:03:04", cc.Timing)
			Connect(cc.Address, cc.Number, timing)
			Auth(cc.Number)
			break
		case 1:
			cc := protocol.TraceItem{}
			err = json.Unmarshal([]byte(cmd.Data), &cc)
			Report("", cc.Longitude, cc.Latitude)
			break
		}
	}
}
