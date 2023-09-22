package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	_ "github.com/google/uuid"
)

var direccion = os.Getenv("API_IP") //"127.0.0.1"
var ruta = "modulos"                //"proc"

var ID = "0"

func main() {

	uniqueID()

	for true {
		repe()
		time.Sleep(2 * time.Second)
	}

}

func repe() {
	CPU()
	RAM()
	PROC()
}

func CPU() {

	//try to read cpu module on proc/cpu_201603009
	cpu, err := ioutil.ReadFile("/" + ruta + "/cpu_201603009")

	if err != nil {
		println("ERROR EN LEER CPU")
		log.Fatal(err)
	}

	Peticion("http://"+direccion+":8080/save_cpu_info", string(cpu))

}

func RAM() {

	//try to read cpu module on proc/cpu_201603009
	ram, err := ioutil.ReadFile("/" + ruta + "/ram_201603009")

	if err != nil {
		log.Fatal(err)
	}

	Peticion("http://"+direccion+":8080/save_ram_info", string(ram))

}

func PROC() {

	//try to read cpu module on proc/cpu_201603009
	pro, err := ioutil.ReadFile("/" + ruta + "/pro_201603009")

	if err != nil {
		log.Fatal(err)
	}

	Peticion("http://"+direccion+":8080/save_pro_info", string(pro))
}

func Peticion(ruta string, data string) {

	requestBody, error := json.Marshal(map[string]string{
		"data":    data,
		"machine": ID,
	})

	if error != nil {
		println("Error en data")
		print(error)
	}

	response, error := http.Post(ruta,
		"application/json", bytes.NewBuffer(requestBody))
	if error != nil {
		println("Error en peticion")
		print(error)
	}

	defer response.Body.Close()
	body, error := ioutil.ReadAll(response.Body)
	if error != nil {
		println("Error en body")
		print(error)
	}

	fmt.Println(string(body))

}

//INICIA EJECUCION DE COMANDOS ID UNICO Y ASIGNACION

func uniqueID() {
	//echo $(date +%s%N)> $HOME/idx.txt
	//base, err := os.UserHomeDir()
	//idUnique, err := ioutil.ReadFile("/id.txt")
	idUnique := uuid.New()

	println("Ruta ID UNICO:")
	println(idUnique.String())
	//guarda el id que le corresponde
	ID = idUnique.String()

}
