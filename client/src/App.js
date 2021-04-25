import axios from 'axios';
import React,{useState,useEffect} from 'react';
import Modal from "react-modal";
import './App.css';

function App() {
  const [ModalisOpen, setModalisOpen] = useState(false) //using modal operation 
  const [Newword, setNewword] = useState("")
  const [Data, setData] = useState({
    fetcheddata: [], 
      isFetching: false,
    word:[]
  });
  const [frontpagedivclick, setfrontpagedivclick] = useState("")
  const [searchterm, setsearchterm] = useState("")
  const [searchedterm, setsearchedterm] = useState([])
  const [searching, setsearching] = useState(false)
  const [divclick, setdivclick] = useState(false)
  const [div2click, setdiv2click] = useState(false)
  const [term, setterm] = useState("term")
  const [close, setclose] = useState(false)
useEffect(() => {
  //fetching data from backend to frontend using axios
  const fetchData = async () => {
    try {
      setData({fetcheddata: Data.fetcheddata, isFetching: true});
      const response = await axios.get("http://localhost:5000/personnel");
      console.log(response.data)
      let array=[]
      response.data.map((data1)=>{
        console.log(data1,123)
        array.push(data1.id)

      })
      console.log(array)
      const dat2=response.data.map((resu,index1)=>{return(resu.results.map((result,index2)=>{return(
        result.lexicalEntries.map((lexi,index3)=>{if("entries" in lexi){return(
          lexi.entries.map((entry,index4)=>{if("senses" in entry)
          {return(entry.senses.map((sense,index5)=>
            {if(("definitions" in sense) && ("examples" in sense) ){return(<div>
              <div className="definition"><div>[{lexi.lexicalCategory.id}]</div>
              <div className="space"></div>
              <div className="parts"><h3>{sense.definitions[0]
  
      }</h3></div></div>
      
      <div className="examples">{sense.examples.map((example,index6)=>
      {return(<div><li>{example.text}</li></div>)})}</div>
      
      </div>
        )}}))}}))}}))}))})
      

      setData({fetcheddata: dat2, isFetching: false,word:array})
      console.log(Data.word[1])
            
    }catch (exception) {
      console.log(exception);
      setData({fetcheddata: Data.fetcheddata, isFetching: false});
    }
   };
   fetchData();
}, []);

  const Add= ()=>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word:Newword })
  };
  fetch('http://localhost:5000/post', requestOptions)  //posting the word to backend to "/post" using fetch operation
    .then(response => response.json())
    .then(data=>console.log(data));

// empty dependency array means this effect will only run once (like componentDidMount in classes)
}
if(searching==true && divclick==false){ //if we press search button then it will go here
  return(
    <div>
      <input type="text" onChange={(e)=>setsearchterm(e.target.value)} />
      {Data.word.filter((val)=>  //filter the data based on the input we enter and returns the words we want
      {
        if(searchterm==""){
          return val
        }
        else if(val.toLowerCase().includes(searchterm.toLowerCase())){
          return val
      }
    }


      ).map((data,key)=>{return (
        <div onClick={()=>{setdivclick(true);
        setsearchedterm(data)}}>
          {data}
          </div>
      )})}

    </div>
  )
}
else if(searching===true && divclick===true){ //after searching the words if we press the card we want it will go here
return(
  <div>
          {Data.word.map((data,index)=>{
        if(data===searchedterm){ //it will return the card we want
          return(
            <div>
        <img className="closebutton" onClick={()=>{
          setsearching(false);
          setdivclick(false);
        }} src="image/close.png" alt="closebutton"  /> 
              
              <h2>{data}</h2>
            {Data.fetcheddata[index]}
            </div>

          )
        }})}
  </div>
)
}
else if(div2click===true){ //if we press the card in the first page or searching page itself the it will go here
  return(
    <div>
      <img className="closebutton" onClick={()=>{setdiv2click(false)}} src="image/close.png" />
      <h1>{frontpagedivclick} </h1>
      {term}

    </div>

  )
}
else {

  return (
    <div className="App">
      <div className="Vocabulary">
      <h2 className="vocab">Vocab    </h2>
      <div className="search">
      <button className="searchbutton" onClick={()=>{setsearching(true)
      setsearchedterm("");
      setsearchterm("")
      }}><img className="searchimage"  src="/image/logo.jpg"  alt="search"/>      </button>
      </div>
      </div>


      <div className="All">{Data.fetcheddata.map((data,index)=>{return(

      <div className="Savedwords" onClick={()=>
      {setdiv2click(true);
      setterm(Data.fetcheddata[index])
      setfrontpagedivclick(Data.word[index])
      }
    }
      >
        <h2>{Data.word[index]}<br/></h2>
        <h4>{Data.fetcheddata[index][0][0][0][0]}</h4></div>)})}
      <button className="Addbutton" onClick={()=>setModalisOpen(true)}><h2>+</h2></button>
      <Modal isOpen={ModalisOpen} onCloseModal={close} >
        <div className="Dict">
        <h2>Add new word</h2>
        <img className="closebuttonmodal" onClick={()=>{
        setclose(true);
        setModalisOpen(false)
      }} src="image/close.png" alt="closebuttonmodal"  />      
      </div>
        <input type="text" onChange={(e)=>setNewword(e.target.value)
        } />
        <br/>
        <button onClick={Add}>Add</button>

      </Modal>
      </div>

    </div>
  );
}
}

export default App;
