

import React, { useEffect , useState} from "react";
import { Link ,useNavigate } from "react-router-dom";
import './App.css';
import { CircularProgressbar ,buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';



//Indica la maquina que esta seleccionada , por default siempre es la uno 
var Maquina='0';

var direccion='http://197.0.0.3:8080/' //'http://127.0.0.1:8080/';

//REACT_APP_IP
//ES LA IP DE LA API


const Consult =async (ruta,body)=>{

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };

  const response = await fetch(direccion+ruta,requestOptions)
  if (!response.ok) {
    throw new Error('Data coud not be fetched!')
  } else {
    return response.json()
  }

}






/*INICIA PARTE GRAFICA EN EL PROGRAMA */

 function App() {
  //const [products, setProducts] = useState(dataResponse);
  const [cpuD, setCpuD] = useState([]);
  const [ramD, setRamD] = useState([]);
  const [proD, setProD] = useState([]);
  const [macD, setMacD] = useState([]);

  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);

  const [isLoading4, setIsLoading4] = useState(false);

  const navigate = useNavigate();



  const inicioH = () => {
    // 👇️ navigate to /
    navigate('/graficas');
  };



  const UpdateData=()=>{
    //prmera consulta para obtener data del cpu 

    if(Maquina!=='0'){

      var body1={machine:Maquina}

      Consult('get_cpu_info',body1)
      .then((res) => {
        setCpuD(res)
        //cpu=((cpuD["data"][0]["cpu_usado"]/cpuD["data"][0]["cpu_total"])*100)
        setIsLoading1(true);
        console.log(Math.round((cpuD["data"][0]["cpu_usado"]/cpuD["data"][0]["cpu_total"])*100));
      })
      .catch((e) => {
        console.log(e.message)
      });
  
  
      Consult('get_ram_info',body1)
      .then((res) => {
        setRamD(res)
        //cpu=((cpuD["data"][0]["cpu_usado"]/cpuD["data"][0]["cpu_total"])*100)
        setIsLoading2(true);
        //console.log(Math.round((ramD["data"][0]["ram_usado"]/ramD["data"][0]["ram_total"])*100));
      })
      .catch((e) => {
        console.log(e.message)
      });
  
  
      Consult('get_pro_info',body1)
        .then((res) => {
          setProD(  JSON.parse(res["data"][0]["pro_data"]) )
          //console.log(res["data"][0]["pro_data"]);
          //cpu=((cpuD["data"][0]["cpu_usado"]/cpuD["data"][0]["cpu_total"])*100)
          setIsLoading3(true);
          //console.log(Math.round((ramD["data"][0]["ram_usado"]/ramD["data"][0]["ram_total"])*100));
        })
        .catch((e) => {
          console.log(e.message)
        });
  
        console.log( "xxx");
        console.log( cpuD);
          
        console.log( "yyy");
        console.log( ramD);
          
        console.log( "zzz");
        console.log( proD);
    
        console.log( "maquina");
        console.log( Maquina);

    }

    
  }



  const GetMachines = () => {
    var body1={machine:""}
    Consult('get_machines',body1)
    .then((res) => {
      const datan=res;
      console.log("aaa");
      console.log(datan);
      setMacD(datan);
      setIsLoading4(true);
      console.log("asigna");
      console.log(macD);

    })
    .catch((e) => {
      console.log(e.message)
    });
  };



    /*
    useEffect(()=>{
      UpdateData();
    }, [])
    */

    useEffect(()=>{
      GetMachines() ;

      //if(!isLoading4){
      //}
    }, [setMacD])
    





  return (
    
    isLoading4 ? (
      
    <div className="principal" >
    <table class="table table-dark table-striped"  >
      <thead>
        <tr>
            <td colSpan={6}>
              <h4>RENDIMIENTO CPU Y MEMORIA RAM INSTANTANEO</h4>
            </td>
        </tr>
      </thead>
      <thead>
      <tr>
          <td>
            <select class="form-select" onClick={selectMachine} name="maquina" id="maquina">
                <option value="0" selected>Seleccione la maquina </option>
                {
                  macD["data"].map((data,index)=>(
                    <option value={data["machine"]}>Maquina {data["machine"]}</option>
                  ))
                }
                

            </select>
          </td>
          <td>
            <button onClick={UpdateData}>Actualizar</button>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <button onClick={inicioH}>Graficas</button>
          </td>

        </tr>
      <tr>
          <td>
            CPU
          </td>
          <td>
            RAM
          </td>

        </tr>
      </thead>



      {

        isLoading1&&isLoading2 ? (
          <tbody>
            <tr>
              <td className="graphs">

                <div className="circle">
                  <CircularProgressbar value={Math.round((cpuD["data"][0]["cpu_usado"]/cpuD["data"][0]["cpu_total"])*100)} text={`${Math.round((cpuD["data"][0]["cpu_usado"]/cpuD["data"][0]["cpu_total"])*100)}%`} styles={buildStyles({
                      textColor: "#EEEDED",
                      pathColor: "#0D1282",
                      trailColor: "#EEEDED"
                  })}/>
                
                </div>  

              </td>
              <td className="graphs">

                <div  className="circle">
                <CircularProgressbar value={Math.round((ramD["data"][0]["mem_usado"]/ramD["data"][0]["mem_total"])*100)} text={`${Math.round((ramD["data"][0]["mem_usado"]/ramD["data"][0]["mem_total"])*100)}%`} styles={buildStyles({
                      textColor: "#EEEDED",
                      pathColor: "#0D1282",
                      trailColor: "#EEEDED"
                  })}/>
                  
                </div>  

              </td>

            </tr>

            <tr>
              <td>
                total
              </td>
              <td>
                total GB
              </td>
            </tr>
          </tbody>
        ) : (
          
            <tbody>
               
            </tbody>
          
        )


      }

    </table>







    {

      isLoading3 ? (
        <table class="table table-dark table-striped">
        <thead>
            <tr>
                <td colSpan={7}>
                  <h4>PROCESOS</h4>
                </td>
            </tr>
          </thead>


          <thead>
          <tr>
              <td>
                PARENT_PID
              </td>
              <td>
                PROCESS
              </td>
              <td>
                STATE
              </td>
              <td>
                PIDCHILD
              </td>
              <td>
                PROCESSCHILD
              </td>
              <td>
                STATECHILD
              </td>

            </tr>
          </thead>
          <tbody>
          
          {
            proD.map((data,index)=>(
              <tr >
                <td>
                  <input type="text"  key={index} value={data["PARENT_PID"]} class="form-control"  />
                </td>
                <td>
                  <input type="text" value={data["PROCESS"]}   class="form-control"  />
                </td>
                <td>
                  <input type="text" value={data["STATE"]}  class="form-control"  />
                </td>
                <td>
                  <input type="text" value={data["PIDCHILD"]}  class="form-control"   />
                </td>
                <td>
                  <input type="text" value={data["PROCESSCHILD"]}  class="form-control"  />
                </td>
                <td>
                <input type="text" value={data["STATECHILD"]}  class="form-control"  />
                </td>

              </tr>

            )
            )
          }

          
          
          </tbody>
        </table>
      ) : (
        
          <table>
            <tbody>
            <tr>
                <td></td>
            </tr>
            </tbody>
          </table>
        
      )


    }


  </div>
    ) : (
      
        <div className="principal" >

          
        </div>
      
    )


  );
}

export default App;





function selectMachine(){
  var seleccionado= document.getElementById("maquina").value;
console.log(seleccionado)
  try{
    console.log("SELECCIONADO:"+seleccionado);
    Maquina=seleccionado;


  }catch(error){

  }
}






