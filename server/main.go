package main

import (
	"flag"
	"log"
	"net/http"
)

var addr = flag.String("addr", ":6666", "http service address")
var assert = "/assert"

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ws", ws)
	fs := http.FileServer(http.Dir("./static/"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	log.Fatal(http.ListenAndServe(*addr, nil))
}
