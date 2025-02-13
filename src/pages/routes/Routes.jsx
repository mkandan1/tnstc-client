import { PanelContainer } from "../../components/Layouts/Container";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { routeService } from "../../services";
import PageHeader from "../../components/Layouts/PageHeader";
import NormalTable from "../../components/ui/table/NormalTable";

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const headers = [
    { label: "Route Name", field: "routeName" },
    { label: "Route Code", field: "routeCode" },
    { label: "Origin", field: "origin.name" },
    { label: "Destination", field: "destination.name" },
    { label: "Distance (km)", field: "totalDistance" },
    { label: "Duration (min)", field: "totalDuration" },
    { label: "Status", field: "isActive" },
    { label: "Type", field: "routeType" },
  ];

  const buttons = [
    { id: "add-route", label: "Add Route", icon: "gridicons:create" },
  ];

  const actions = [
    {
      label: "View",
      icon: "mdi:eye",
      callback: (row) => navigate(row._id),
    },
    {
      label: "Edit",
      icon: "mdi:pencil",
      callback: (row) => navigate(`${row._id}`),
    },
  ];

  const onButtonClick = (id) => {
    if (id === "add-route") {
      navigate("new");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const data = await routeService.getAllRoutes(); // Fetch routes from API
        if (isMounted) {
          const formattedData = data.map((route) => ({
            ...route,
            isActive: route.isActive ? "Active" : "Inactive",
          }));
          setRoutes(formattedData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRoutes();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PanelContainer>
      <PageHeader
        title="Routes"
        description={`You have ${routes.length} routes`}
        buttons={buttons}
        onButtonClick={(id) => onButtonClick(id)}
      />
      <div className="w-screen md:w-auto overflow-x-auto">
        <NormalTable
          headers={headers}
          data={routes}
          actions={actions}
          isLoading={loading}
          error={error}
        />
      </div>
    </PanelContainer>
  );
};

export default Routes;
