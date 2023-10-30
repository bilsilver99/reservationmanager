import React, { useEffect } from "react";
import Scheduler, { View } from "devextreme-react/scheduler";
import SelectBox from "devextreme-react/select-box";
import "./schedule.scss";
import { appointments } from "./data";
import { useAuth } from "../../contexts/auth";
import { mystore, myshift } from "./ScheduleServices";

const employees = ["sam", "lou"];
const views = ["Day", "Week", "Month"];
const durations = [];
const currentDate = new Date();

const SchedulerComponent = () => {
  const { user } = useAuth();
  const [durationsdata, setDurationsData] = React.useState(durations);
  const [currentViewName, setCurrentViewName] = React.useState("Day");
  const [currentCellDuration, setCurrentCellDuration] = React.useState(15);
  const [thisTypeDuration, setThisTypeDuration] = React.useState(15);
  const [currentEmployeeName, setCurrentEmployeeName] = React.useState("");
  const [allowAdding, setAllowAdding] = React.useState(true);
  const [allowDeleting, setAllowDeleting] = React.useState(true);
  const [allowUpdating, setAllowUpdating] = React.useState(false);
  const [startDayHour, setStartDayHour] = React.useState(7);
  const [endDayHour, setEndDayHour] = React.useState(17);
  //const [key, setKey] = React.useState(Math.random());
  //const [schedulerHeight, setSchedulerHeight] = React.useState(580);

  const setThisTypeDurationNew = (e) => {
    setThisTypeDuration(e.value);
  };

  useEffect(() => {
    (async () => {
      const resultServiceLevels = await mystore(user.companynumber);
      console.log("service levels", resultServiceLevels);
      setDurationsData(resultServiceLevels.data);
      //setKey(Math.random());

      const resultShift = await myshift(user.companynumber);
      setStartDayHour(resultShift.startshift);
      setEndDayHour(resultShift.endshift);
      console.log("start", resultShift.startshift, "end", resultShift.endshift);
    })();
  }, [user]);

  useEffect(() => {
    console.log("duration ", thisTypeDuration);
  }, [thisTypeDuration]);

  return (
    <div className="app">
      <div className="dropdown">
        <div style={{ display: "flex", alignItems: "left" }}>
          <p style={{ marginRight: "10px" }}>Employee:</p>
          <SelectBox
            style={{ width: "200px" }}
            items={employees}
            value={currentEmployeeName}
            onValueChanged={(e) => setCurrentEmployeeName(e.value)}
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
            valueExpr="value"
            displayExpr="label"
            value={currentCellDuration}
            onValueChanged={(e) => setCurrentCellDuration(e)}
          />
        </div>
      </div>

      <div className="scheduler">
        <Scheduler
          showAllDayPanel={false}
          dataSource={appointments}
          defaultCurrentDate={currentDate}
          height={schedulerHeight}
          backgroundColor="red"
          useDropDownViewSwitcher={false}
          currentView={currentViewName}
          cellDuration={currentCellDuration}
          startDayHour={startDayHour}
          endDayHour={endDayHour}
          editing={{ allowDeleting, allowAdding, allowUpdating }}
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

// import React, { useEffect } from "react";
// import Scheduler, { View } from "devextreme-react/scheduler";
// import SelectBox from "devextreme-react/select-box";
// import "./schedule.scss";
// import { appointments } from "./data";
// import { useAuth } from "../../contexts/auth";
// import { mystore, myshift } from "./ScheduleServices";
// const employees = ["sam", "lou"];
// const views = ["Day", "Week", "Month"];
// const durations = [];
// //   { label: "Haircut", value: 15 },
// //   { label: "Trim", value: 60 },
// //   { label: "Dye", value: 90 },
// // ];
// const currentDate = new Date();

// // const bookedAppointments = [
// //   // Mock data for booked appointments
// //   { startTime: "10:00", endTime: "11:00" },
// //   { startTime: "13:00", endTime: "14:00" },
// // ];

// const SchedulerComponent = () => {
//   const { user } = useAuth();
//   //console.log({ user });

//   const [durationsdata, setDurationsData] = React.useState(durations);
//   const [currentViewName, setCurrentViewName] = React.useState("Day");
//   const [currentCellDuration, setCurrentCellDuration] = React.useState(15);
//   const [thisTypeDuration, setThisTypeDuration] = React.useState(15);
//   const [currentEmployeeName, setCurrentEmployeeName] = React.useState("");
//   const [allowAdding, setAllowAdding] = React.useState(true);
//   const [allowDeleting, setAllowDeleting] = React.useState(true);
//   const [allowUpdating, setAllowUpdating] = React.useState(false);
//   const [startDayHour, setStartDayHour] = React.useState(7);
//   const [endDayHour, setEndDayHour] = React.useState(17);
//   const [key, setKey] = React.useState(Math.random());

//   const [schedulerHeight, setSchedulerHeight] = React.useState(580);

//   //const [currentDuration, setCurrentDuration] = React.useState(60);

//   const setThisTypeDurationNew = (e) => {
//     setThisTypeDuration(e.value);
//     //setCurrentCellDuration(e.value); // Add this line to update currentCellDuration
//     console.log("duration ", thisTypeDuration);
//   };
//   //const startDayHour = 8; // Start at 8:00 AM
//   // const endDayHour = 19; // End at 6:00 PM

//   useEffect(() => {
//     (async () => {
//       // Fetching service levels data
//       const resultServiceLevels = await mystore(user.companynumber);
//       console.log("service levels", resultServiceLevels);
//       setDurationsData(resultServiceLevels.data);
//       setKey(Math.random());

//       // Fetching shift data
//       const resultShift = await myshift(user.companynumber);
//       setStartDayHour(resultShift.startshift);
//       setEndDayHour(resultShift.endshift);
//       console.log("start", resultShift.startshift, "end", resultShift.endshift);
//     })();

//     return () => {
//       // This now gets called when the component unmounts
//     };
//   }, [user]);

//   return (
//     <div className="app">
//       <div
//         className="dropdown"
//         //style={{ margin: "20px auto", alignItems: "center" }}
//       >
//         <div style={{ display: "flex", alignItems: "left" }}>
//           <p style={{ marginRight: "10px" }}>Employee:</p>
//           <SelectBox
//             style={{ width: "200px" }}
//             items={employees}
//             value={currentEmployeeName}
//             onValueChanged={(e) => setCurrentEmployeeName(e.value)}
//           />
//         </div>

//         <div
//           style={{ display: "flex", alignItems: "left", marginLeft: "20px" }}
//         >
//           <p style={{ marginRight: "10px" }}>View:</p>
//           <SelectBox
//             style={{ width: "150px" }}
//             items={views}
//             value={currentViewName}
//             onValueChanged={(e) => setCurrentViewName(e.value)}
//           />
//         </div>
//         <div
//           className="service-select-container"
//           style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}
//         >
//           <p style={{ marginRight: "10px" }}>Service:</p>
//           <SelectBox
//             key={key}
//             style={{ width: "400px" }}
//             items={durationsdata}
//             valueExpr="value"
//             displayExpr="label"
//             value={currentCellDuration}
//             onValueChanged={(e) => setThisTypeDurationNew(e)}
//           />
//         </div>
//       </div>

//       <div className="scheduler">
//         <Scheduler
//           dataSource={appointments}
//           defaultCurrentDate={currentDate}
//           height={schedulerHeight}
//           //height={800}
//           //width={200}
//           backgroundColor="red"
//           useDropDownViewSwitcher={false}
//           currentView={currentViewName}
//           cellDuration={currentCellDuration}
//           startDayHour={startDayHour}
//           endDayHour={endDayHour}
//           editing={{ allowDeleting, allowAdding, allowUpdating }}
//           // editing={{
//           //   allowAdding: true,
//           //   allowDeleting: true,
//           //   allowEditing: ({ appointmentData }) =>
//           //     !isAppointmentDisabled(appointmentData),
//           // }}
//         >
//           <View name="Day" type="day" />
//           <View name="Week" type="week" />
//           <View name="Month" type="month" />
//         </Scheduler>
//       </div>
//     </div>
//   );
// };

// export default SchedulerComponent;

// // useEffect(() => {
// //   (async () => {
// //     const result = await mystore(user.companynumber);
// //     console.log("service levels", result);
// //     setDurationsData(result.data);
// //     setKey(Math.random());
// //   })();
// //   //getemployee(service.getEmployee());

// //   return () => {
// //     // this now gets called when the component unmounts
// //   };
// // }, [user]);

// // useEffect(() => {
// //   (async () => {
// //     const result = await myshift(user.companynumber);
// //     //console.log(result);

// //     setStartDayHour(result.startshift);
// //     setEndDayHour(result.endshift);
// //     console.log("start", startDayHour, "end", endDayHour);
// //   })();
// //   //getemployee(service.getEmployee());

// //   return () => {
// //     // this now gets called when the component unmounts
// //   };
// // }, [user]);

// // const isAppointmentDisabled = (appointmentData) => {
// //   // Check if the appointment falls within any existing appointments
// //   for (const appt of appointments) {
// //     const start = new Date(appt.startTime);
// //     const end = new Date(appt.endTime);

// //     if (
// //       appointmentData.startDate >= start &&
// //       appointmentData.endDate <= end
// //     ) {
// //       return true; // Disable the appointment
// //     }
// //   }

// //   return false; // Enable the appointment
// // };
