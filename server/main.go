package main

import (
	"flag"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"syscall"
)

func main() {
	var done = make(chan string)
	flag.Parse()
	log.SetFlags(0)
	port, err := GetFreePort()
	if err != nil {
		panic(err)
	}
	go func() {
		ex, err := os.Executable()
		if err != nil {
			panic(err)
		}
		exPath := filepath.Dir(ex)
		fs := http.FileServer(http.Dir(exPath + "/"))
		http.Handle("/", http.StripPrefix("/", fs))
		http.HandleFunc("/ws", ws)
		log.Fatal(http.ListenAndServe(":"+strconv.Itoa(port), nil))
		done <- "quit"
	}()
	// 无GUI调用
	cmd := exec.Command(`cmd`, `/c`, `start`, `http://127.0.0.1`+":"+strconv.Itoa(port))
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	cmd.Start()
	for {
		select {
		case t := <-done:
			if t == "quit" {
				return
			}
			break
		}
	}
}

func GetFreePort() (int, error) {
	addr, err := net.ResolveTCPAddr("tcp", "localhost:0")
	if err != nil {
		return 0, err
	}
	l, err := net.ListenTCP("tcp", addr)
	if err != nil {
		return 0, err
	}
	defer l.Close()
	return l.Addr().(*net.TCPAddr).Port, nil
}
