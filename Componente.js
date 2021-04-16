import './Componente.css';
import React, { Component } from 'react';

class Componente extends Component {
  constructor(props) {
    super(props);
    this.state={
      datiCaricati:false,
      datiSalvati:[],
      mesi:["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],
      color:[],
      max:0,
      mesiSelezionati:[],
      statoMouse:"mouseRilascia",
    };
    this.azioneMouse="mouseRilascia";
    this.verso=1;
  }


  divMesi=()=>{
    return(
      this.state.datiSalvati.map((elementi,index) =>(
        <td
          className="meseGlobal"
          key={index}
          onMouseEnter={()=>this.entraMese(index)}
          onMouseUp={()=>this.mouseRilascia()}
          onMouseDown={()=>this.mousePremi(index)}
        >
          <table style={{width:"100%", borderCollapse:'collapse',height:"100%"}} cellSpacing={0}>
            <tbody>
              <tr style={{backgroundColor:"white",width:"100%",borderBottom: "1.5px solid #ebedee",height:"30%"}}>
                <td>
                  <p className="mese">{this.state.mesi[index]}</p>
                </td>
              </tr>
              <tr className="meseInfo" style={{width:"100%"}}>
                <td style={{display:"flex",height:"calc(100% - 10px)",paddingLeft:"5px",paddingBottom:"5px",background: `linear-gradient(0deg,  #e0f1eb ${((elementi.importo*100/this.state.max))}%,#fff ${(elementi.importo*100/this.state.max)}%)`, borderBottom:`4px solid ${this.state.color[index]}`}}>
                  <div style={{alignSelf:"flex-end"}}>
                    <p className="doc">{elementi.documenti} doc.</p>
                    <p className="importo">{this.formattaNumero(elementi.importo)} €</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      ))
    );
  }

  componentDidMount(){
    let appoggioImp=[];
    let appoggioColori=[];
    let massimo=0;
    fetch("http://staccah.fattureincloud.it/testfrontend/data.json").then(chiamata =>{
      chiamata.json().then(risultato=>{
        risultato.mesi.forEach(elementi =>{
          massimo=Math.max(massimo,elementi.importo);
          appoggioImp.push(elementi.importo);
          appoggioColori.push("#ebedee");
        });

        this.setState({
          datiSalvati:risultato.mesi,
          max:massimo,
          color:appoggioColori,
          datiCaricati:true,
        });
      })
    });
  }
  
  //Evidenzia il mese che viene premuto, deselezionando quelli precedentemente filtrati
  mousePremi=(indice)=>{
    this.azioneMouse="mousePremi";

    let appoggioColori=this.state.color;
    let appoggioMesi=[];

    if(appoggioColori[indice]=="#ebedee"){
      appoggioColori.fill("#ebedee");
      appoggioColori[indice]="#f90";
      appoggioMesi.push(indice);
    }else{
      appoggioColori.fill("#ebedee");
    }

    this.setState({
      color:appoggioColori,
      mesiSelezionati:appoggioMesi,
    });
  }
  
  //Seleziona/Deseleziona il mese su cui il mouse si sposta (deve essere stato precedentemente premuto un tasto del mouse)
  entraMese=(indice)=>{
    if(this.azioneMouse=="mousePremi"){
      let appoggioColori=this.state.color;
      let appoggioMesi=this.state.mesiSelezionati;

      if(appoggioMesi.length==1){
        if(appoggioMesi[appoggioMesi.length-1]>indice){
          this.verso=-1;
        }else{
          this.verso=1;
        }
      }

      if(appoggioMesi[appoggioMesi.length-1]==(indice+this.verso)){
        appoggioColori[appoggioMesi[appoggioMesi.length-1]]="#ebedee";
        appoggioMesi.pop();
      }else{
        appoggioColori[indice]="#f90";
        appoggioMesi.push(indice);
      }

      this.setState({
        color:appoggioColori,
        meseSelezionato:appoggioMesi,
      });
    }
      
  }

  //Rilasciando il tasto del mouse, si conferma la selezione
  mouseRilascia=()=>{
    this.azioneMouse="mouseRilascia";
    let appoggioColori=this.state.color;

    for(let i=0;i<appoggioColori.length;i++){
      if(appoggioColori[i]=="#f90")
        appoggioColori[i]="#0D97D5";
    }

    this.setState({
      color:appoggioColori,
    });  
  }

  stampaMesi=()=>{
    let stringa="";
    let appoggioMesi=this.state.mesiSelezionati.slice();

    //In caso di selezione da destra a sinistra, l'ordine dei mesi stampato sarà quello corretto e non al contrario
    appoggioMesi.sort(function(a, b) {
      return a - b;
    });

    appoggioMesi.forEach((mese,index) =>{
      stringa+=this.state.mesi[mese];
      if(index!=this.state.mesiSelezionati.length-1)
        stringa+=", ";
    });

    return stringa;
  }

  formattaNumero(num){
    return num.toLocaleString("it");;
  }

  render() {
    if(this.state.datiCaricati){
      return (
        <div className="spazioComponente">
          <table className="containerPrincipale" cellSpacing={0} onMouseLeave={()=>this.mouseRilascia()}>
            <tbody>
              <tr style={{border: "1.5px solid #ebedee",height:"100%",borderBottom:"none"}}>
                {this.divMesi()}
              </tr>
            </tbody>
          </table>
          <p style={{marginTop:"20px"}}>{this.state.mesiSelezionati.length>0 ? "Mese/i selezionato/i: "+this.stampaMesi(): ""}</p>
        </div>
      );
    }else{
      return(
        <div>Caricamento dati...</div>
      )
    }
    
  }
}
export default Componente;