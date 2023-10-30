import React, { useEffect } from "react";
import Scheduler, { View } from "devextreme-react/scheduler";
import SelectBox from "devextreme-react/select-box";
import "./schedule.scss";
import { useAuth } from "../../contexts/auth";
import {
  mystore,
  myshift,
  myEmployees,
  myAppointments,
  addAppointment,
  deleteAppointment,
  updateAppointment,
  getCurrentOption,
} from "./ScheduleServices";
const employees = ["sam", "lou"];
const views = ["Day", "Week", "Month"];
const durations = [];
const currentDate = new Date();

const SchedulerComponent = () => {
  const { user } = useAuth();
  //console.log({ user });

  const [durationsdata, setDurationsData] = React.useState(durations);
  const [currentViewName, setCurrentViewName] = React.useState("Day");
  const [currentCellDuration, setCurrentCellDuration] = React.useState(15);
  const [currentEmployeeName, setCurrentEmployeeName] = React.useState("");
  const [allowAdding, setAllowAdding] = React.useState(true);
  const [allowDeleting, setAllowDeleting] = React.useState(true);
  const [allowUpdating, setAllowUpdating] = React.useState(false);
  const [startDayHour, setStartDayHour] = React.useState(7);
  const [endDayHour, setEndDayHour] = React.useState(17);
  const [key, setKey] = React.useState(Math.random());
  const [employeesData, setEmployeesData] = React.useState(employees);
  const [activitykey, setActivityKey] = React.useState();

  const [appointments, setAppointmentsData] = React.useState("");

  const [schedulerHeight, setSchedulerHeight] = React.useState(800);

  const setCurrentValues = async (e) => {
    if (!e || !e.value) return;
    console.log("value sent in", e.value);
    const getmyvalues = await getCurrentOption(e.value);
    //setCurrentTaskName(getmyvalues.label);
    setCurrentCellDuration(getmyvalues.duration);
    setActivityKey(getmyvalues.keyvalue);
    // Use the values directly
    console.log(
      "duration xx ",
      getmyvalues.duration,
      "activity key xx",
      getmyvalues.keyvalue,
      //"Label xx:",
      //getmyvalues.label,
      "actual: ",
      currentCellDuration
      //"Name: ",
      //currentTaskName
    );
  };

  const setEmployeeName = async (e) => {
    setCurrentEmployeeName(e.value);
    console.log("employee name", e.value, "label", e.label);
  };

  //////////////////////////////////////////////////////////
  const handleAppointmentAdded = async (e) => {
    try {
      const response = await addAppointment(
        user.companynumber,
        currentEmployeeName,
        e.appointmentData.startDate,
        e.appointmentData.endDate,
        e.appointmentData.description,
        e.appointmentData.text,
        activitykey
        //currentCellkey
      );
      // handle success (maybe refresh appointments or show a success message)
    } catch (error) {
      console.error("Error adding appointment:", error);
      // handle error (maybe show an error message to the user)
    }
  };

  const handleAppointmentDeleted = async (e) => {
    try {
      // e.appointmentData contains the data of the deleted appointment
      //const response = await deleteAppointment(e.appointmentData);
      //console.log("appointment Deleted", e.appointmentData);
      // handle success
    } catch (error) {
      //console.error("Error deleting appointment:", error);
      // handle error
    }
  };

  const handleAppointmentUpdated = async (e) => {
    try {
      // e.newData contains the updated data
      // e.oldData contains the data before the update
      //const response = await updateAppointment(e.newData);
      //console.log("appointment Updated", e.appointmentData);
      // handle success
    } catch (error) {
      //console.error("Error updating appointment:", error);
      // handle error
    }
  };

  //////////////////////////////////////////////////////////

  useEffect(() => {
    (async () => {
      // Fetching service levels data
      const resultServiceLevels = await mystore(user.companynumber);
      setDurationsData(resultServiceLevels.data);
      console.log("service levels", resultServiceLevels.data);
      setKey(resultServiceLevels.data.key);

      // Fetching shift data
      const resultShift = await myshift(user.companynumber);
      setStartDayHour(resultShift.startshift);
      setEndDayHour(resultShift.endshift);
      //console.log("start", resultShift.startshift, "end", resultShift.endshift);

      const resultEmployee = await myEmployees(user.companynumber);
      //console.log("employee", resultEmployee);
      setEmployeesData(resultEmployee.data);
      setKey(Math.random());

      const resultAppointments = await myAppointments(
        user.companynumber,
        currentEmployeeName
      );
      //console.log("Appointments", resultAppointments);
      setAppointmentsData(resultAppointments.data);
      setKey(Math.random());
    })();

    return () => {
      // This now gets called when the component unmounts
    };
  }, [user, currentEmployeeName]);

  return (
    <div className="app">
      <div
        className="dropdown"
        //style={{ margin: "20px auto", alignItems: "center" }}
      >
        <div style={{ display: "flex", alignItems: "left" }}>
          <p style={{ marginRight: "10px" }}>Employee:</p>
          <SelectBox
            style={{ width: "200px" }}
            items={employeesData}
            valueExpr="value"
            displayExpr="label"
            value={currentEmployeeName}
            //value={currentEmployeeName}
            onValueChanged={setEmployeeName}
            //onValueChanged={(e) => setCurrentEmployeeName(e.value)}
          />
        </div>

        <div
          style={{ display: "flex", alignItems: "left", marginLeft: "20px" }}
        >
          <p style={{ marginRight: "10px" }}>View:</p>
          <SelectBox
            style={{ width: "150px" }}
            items={views}
            value={currentViewName}
            onValueChanged={(e) => setCurrentViewName(e.value)}
          />
        </div>
        <div
          className="service-select-container"
          style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}
        >
          <p style={{ marginRight: "10px" }}>Service:</p>
          <SelectBox
            key={key}
            style={{ width: "400px" }}
            items={durationsdata}
            valueExpr="keyvalue"
            displayExpr="label"
            //value={currentTaskName}
            onValueChanged={setCurrentValues}
            //onValueChanged={(e) => {
            //  setCurrentCellDuration(e.value);
            //}}
          />
        </div>
      </div>

      <div className="scheduler" id="">
        <Scheduler
          //crossScrollingEnabled={true}
          showAllDayPanel={false}
          dataSource={appointments}
          defaultCurrentDate={currentDate}
          height={schedulerHeight}
          //height={800}
          width={"100%"}
          backgroundColor="red"
          useDropDownViewSwitcher={false}
          currentView={currentViewName}
          cellDuration={currentCellDuration}
          startDayHour={startDayHour}
          endDayHour={endDayHour}
          editing={{ allowDeleting, allowAdding, allowUpdating }}
          onAppointmentAdded={handleAppointmentAdded}
          onAppointmentDeleted={handleAppointmentDeleted}
          onAppointmentUpdated={handleAppointmentUpdated}
        >
          <View name="Day" type="day" />
          <View name="Week" type="week" />
          <View name="Month" type="month" />
        </Scheduler>
      </div>
    </div>
  );
};

export default SchedulerComponent;
