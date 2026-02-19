import { useState } from "react";
import Layout from "./Layout";
import TicketForm from "./TicketForm";
import TicketList from "./TicketList";

function App() {

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshTickets = () => {
    setRefreshKey(prev => prev + 1);
  };

  const ticketsUI = (

    <div style={{
      maxWidth: "900px",
      margin: "0 auto",
      padding: "20px"
    }}>

      <TicketForm onCreated={refreshTickets} />

      <div style={{ height: "20px" }} />

      <TicketList refreshKey={refreshKey} />

    </div>

  );

  return <Layout ticketsUI={ticketsUI} />;

}

export default App;
