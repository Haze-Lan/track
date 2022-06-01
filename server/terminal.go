package main

import (
	"io/ioutil"
	"log"
	"net"
	"os"
	"os/signal"
	"time"
)

var dataChan = make(chan []byte)

func sendData(cmd []byte) {
	dataChan <- cmd
}

//连接设备网关
func connect(address string) {
	log.SetFlags(0)
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)
	c, err := net.Dial("tcp", address)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer c.Close()
	done := make(chan struct{})
	go func() {
		defer close(done)
		for {
			//接受数据
			buf, err := ioutil.ReadAll(c)
			if err != nil {
				log.Println("read:", err)
				return
			}
			log.Printf("recv: %s", buf)
		}
	}()

	for {
		select {
		case <-done:
			return
		case t := <-dataChan:
			_, err := c.Write(t)
			if err != nil {
				log.Println("write:", err)
				return
			}
		case <-interrupt:
			log.Println("interrupt")
			// Cleanly close the connection by sending a close message and then
			// waiting (with timeout) for the server to close the connection.

			select {
			case <-done:
			case <-time.After(time.Second):
				c.Close()
			}
			return
		}
	}
}
