import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import ViolationComponent from "./ViolationComponent";

const Fleetmanagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [violationData, setViolationData] = useState([]);
  const [filteredViolationData, setFilteredViolationData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765'); 

    ws.onopen = () => {
      console.log("WebSocket connection is established!");
      ws.send(JSON.stringify({ type: 'requestViolationData' }));
    };

    ws.onmessage = (event) => {
      const data = event.data;
      if (data !== 'OK') {
        const parsedData = JSON.parse(data);
        const violationComponents = parsedData.map((data, index) => (
          <ViolationComponent key={`${data.Reg_no}-${data.Time}-${index}`} violation={data} />
        ));
        
        setViolationData(violationComponents);
        setFilteredViolationData(violationComponents);
      }
    };
    

    return () => {
      ws.close();
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      console.log(violationData);
      setFilteredViolationData(violationData);
    } else {
      const filteredData = violationData.filter((component) => {
        const violation = component.props.violation;
        return violation && (
          (violation.Reg_no && violation.Reg_no.toLowerCase().includes(query.toLowerCase())) ||
          (violation.Driver_name && violation.Driver_name.toLowerCase().includes(query.toLowerCase()))
        );
      });
      setFilteredViolationData(filteredData);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundImage: "url(/img-5.jpg)", backgroundRepeat: `no-repeat`, backgroundSize: "cover", backgroundPosition: "center", paddingTop: "73px"}}>
      <Navbar />
      <div className="flex justify-center items-center">
        <div className="m-10 border-black rounded-md flex">
          <input
            className="h-10 flex-grow px-2 outline-none rounded-md"
            placeholder="Search by car name or registration number.."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button className="text-white bg-blue-500 px-4 py-2 rounded-md ml-1 h-10">Search</button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 p-5">
        {filteredViolationData}
      </div>
    </div>
  );
};

export default Fleetmanagement;
