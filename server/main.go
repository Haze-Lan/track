package main

import (
	"flag"
	"log"
	"net/http"
)

var addr = flag.String("addr", ":80", "http service address")

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ws", ws)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
