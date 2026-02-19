import Layout from "./Layout";
import TicketForm from "./TicketForm";
import TicketList from "./TicketList";
import { useState } from "react";

function App() {

  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const ticketsUI = (

    <div style={styles.container}>

      <TicketForm onCreated={handleCreated} />

      <TicketList refreshKey={refreshKey} />

    </div>

  );

  return <Layout ticketsUI={ticketsUI} />;

}

export default App;



const styles = {

  container: {
    width: "100%",
  },

};
