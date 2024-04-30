import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Modal from "./Modal";
import ViolationComponent from "./ViolationComponent";

const Fleetmanagement = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [violationData, setViolationData] = useState([]);


  const vehicles = [
    {
      id: 1,
      name: "Vehicle - 1",
      registrationNumber: "TN-15-AB-1234",
      currentOwner: "Anna University",
      modelYear: 2014,
      driverName: "Ashok",
      imageSrc: "/schoolbus-1.jpg",
    },
    {
      id: 2,
      name: "Vehicle - 2",
      registrationNumber: "TN-15-AB-1234",
      currentOwner: "Anna University",
      modelYear: 2014,
      driverName: "Dinesh",
      imageSrc: "/schoolbus-2.jpg",
    },
    {
      id: 3,
      name: "Vehicle - 3",
      registrationNumber: "TN-15-AB-1234",
      currentOwner: "Anna University",
      modelYear: 2014,
      driverName: "Suresh",
      imageSrc: "/schoolbus-3.jpg",
    },
  ];

    useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765'); // Assuming WebSocket server is running locally on port 8765

    ws.onopen = () => {
      console.log("Websocket connection is established!");
      ws.send(JSON.stringify({ type: 'requestViolationData' }));
    };

    ws.onmessage = (event) => {
      // When data is received from WebSocket server
      const data = event.data;
      if (data !== 'OK') {
        const parsedData = JSON.parse(data);
        const violationComponents = parsedData.map((data)=>{
          return <ViolationComponent violation={data} />
        })
        console.log(parsedData)
        setViolationData(violationComponents); // Update state with received violation data
      }
    };

    return () => {
      // Clean up WebSocket connection when component is unmounted
      ws.close();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const toggleModal = (vehicleId) => {
    setSelectedVehicle(selectedVehicle === vehicleId ? null : vehicleId);
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url(/img-5.jpg)",
        backgroundRepeat: `no-repeat`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "73px",
      }}
    >
      <Navbar />
      <div className="flex justify-center items-center">
        <div className="m-10 border-black rounded-md flex">
          <input
            className="h-10 flex-grow px-2 outline-none rounded-md"
            placeholder="Search by your car name.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="text-white bg-blue-500 px-4 py-2 rounded-md ml-1 h-10">
            Search
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 p-5">
        {violationData}
      </div>
    </div>
  );
};

export default Fleetmanagement;

