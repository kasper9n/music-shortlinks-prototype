// package main
//
// import "fmt"
//
// func main() {
//
// 	fmt.Println("Hello world")
//
//     for i := 0; i < 10; i++ {
//         fmt.Println(i)
//     }
//
//
// }

package main

import (
    "net/http"
    "fmt"
    "main/routes"
)

func ping(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("ponbg"))
}

func main() {
    fmt.Println("hey")
    routes.Xv()
}
