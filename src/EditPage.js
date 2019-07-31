import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Paper, Grid, Link } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PersistentDrawerLeft from "./Components/PersistentDrawerLeft";
import Checkbox from "@material-ui/core/Checkbox";
import Datepicker from "./Components/Datepicker";
import Button from "@material-ui/core/Button";
import { useHttp } from "./hooks/http";
import { useEditHttp } from "./hooks/editHttp";

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 20
  },
  body: {
    fontSize: 16
  }
}))(TableCell);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 300
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  },
  red: {
    color: "red"
  },
  green: {
    color: "green"
  }
});

const EditPage = props => {
  const [startDate, setStartDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("21-7-2019");
  const [attendance_list, setAttendance_list] = useState([]);

  const [fetchedData] = useHttp(
    `https://wizdem.pythonanywhere.com/Attendance/get-attendance-of-day/${
      props.location.state.name
    }/${props.location.state.div}/${formattedDate}`,
    [formattedDate]
  );
  useEffect(() => {
    if(fetchedData) {
      setAttendance_list(fetchedData.attendance);
    } else {
      setAttendance_list([]);
    }
  },[fetchedData]);

  console.log(attendance_list);
  useEffect(() => {
    var completeDate = startDate;
    var newdate = completeDate.getDate();
    var month = completeDate.getMonth() + 1;
    var year = completeDate.getFullYear();
    const formatdDate = newdate + "-" + month + "-" + year;
    setFormattedDate(formatdDate);
  });
  
  const [message, fetchCall] = useEditHttp();

  const handleSubmit = async event => {
    let postData = {
      attendance_list: attendance_list
    };
    fetchCall(
      `https://wizdem.pythonanywhere.com/Attendance/edit-attendance-of-day/${
        props.location.state.name
      }/${props.location.state.div}/${formattedDate}`,
      JSON.stringify(postData)
    );
  };

  const handleChangeCheck = (number,id) => {
    let studentsCopy = attendance_list.map((item) => item);
    if (studentsCopy[number].attendance_list[id].attendance === 1) {
      studentsCopy[number].attendance_list[id] = { ...studentsCopy[number].attendance_list[id], attendance: 0 };
      setAttendance_list(studentsCopy);
    } else {
      studentsCopy[number].attendance_list[id] = { ...studentsCopy[number].attendance_list[id], attendance: 1 };
      console.log(studentsCopy);
      setAttendance_list(studentsCopy);
    }
  };

  const handleChange = date => {
    setStartDate(date);
  };

  const updateChange = () => {
    var completeDate=startDate;
    var newdate=completeDate.getDate();
    var month =completeDate.getMonth()+1;
    var year = completeDate.getFullYear();
    const formatdDate = newdate + "-" + month + "-" + year;
    setFormattedDate(formatdDate);
  }

  const { classes } = props;
  return (
    <div>
      <PersistentDrawerLeft />
      <Grid container className={classes.table}>
        <Grid item xs={12}>
          {attendance_list.length === 0 && (
            <Typography variant="h6" style={{ margin: 10 }}>
              No lecture today
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid container spacing={24} style={{ padding: 12 }}>
        <Grid item xs={12} sm={12} md={8} className={classes.attendTable}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <CustomTableCell>SAP ID</CustomTableCell>
                  <CustomTableCell>Name</CustomTableCell>
                  <CustomTableCell>Time</CustomTableCell>
                  <CustomTableCell>Edit</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance_list.length > 0 &&
                  attendance_list.map((item,number) =>
                    item.attendance_list.map((row, id) => (
                      <TableRow className={classes.row} key={row.id}>
                        <CustomTableCell component="th" scope="row">
                          {row.sapID}
                        </CustomTableCell>
                        <CustomTableCell>{row.name}</CustomTableCell>
                        <CustomTableCell>{item.time}</CustomTableCell>
                        <CustomTableCell component="th" scope="row">
                          <Checkbox
                            checked={row.attendance === 1 ? true : false}
                            onChange={handleChangeCheck.bind(this, number, id )}
                            value={row.Sap_id}
                          />
                        </CustomTableCell>
                      </TableRow>
                    ))
                  )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <Datepicker
            startDate={startDate}
            handleChange={handleChange}
            updateChange={updateChange}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Post Change
          </Button>
        </Grid>
      </Grid>
      {message.length > 0 && (
        <Typography variant="h6" style={{ margin: 20 }}>
          {message}
        </Typography>
      )}
    </div>
  );
};

EditPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditPage);

// import React from "react";
// import PropTypes from "prop-types";
// import { withStyles } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import { Paper, Grid, Link } from "@material-ui/core";
// import Typography from "@material-ui/core/Typography";
// import PersistentDrawerLeft from "./Components/PersistentDrawerLeft";
// import Checkbox from "@material-ui/core/Checkbox";
// import Datepicker from "./Components/Datepicker";
// import Button from "@material-ui/core/Button";

// const CustomTableCell = withStyles(theme => ({
//   head: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//     fontSize: 20
//   },
//   body: {
//     fontSize: 16
//   }
// }))(TableCell);

// const styles = theme => ({
//   root: {
//     width: "100%",
//     marginTop: theme.spacing.unit * 3,
//     overflowX: "auto"
//   },
//   table: {
//     minWidth: 300
//   },
//   row: {
//     "&:nth-of-type(odd)": {
//       backgroundColor: theme.palette.background.default
//     }
//   },
//   red: {
//     color: "red"
//   },
//   green: {
//     color: "green"
//   }
// });

// class EditPage extends React.Component {
//   state = {
//     message: "",
//     startDate: new Date(),
//     formattedDate: "",
//     check: true,
//     uncheck: false,
//     attendance: [],
//     attendance_list: []
//   };

//   handleSubmit = async event => {
//     event.preventDefault();

//     var completeDate = this.state.startDate;
//     var date = completeDate.getDate();
//     var month = completeDate.getMonth() + 1;
//     var year = completeDate.getFullYear();

//     const formatdDate = date + "-" + month + "-" + year;
//     await this.setState({
//       formattedDate: formatdDate
//     });

//     let postData = {
//       attendance_list: [
//         {
//           time: this.state.attendance[0].time,
//           attendance_list: this.state.attendance_list
//         }
//       ]
//     };
//     const res = await fetch(
//       `https://wizdem.pythonanywhere.com/Attendance/edit-attendance-of-day/${
//         this.props.location.state.name
//       }/${this.props.location.state.div}/${this.state.formattedDate}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Requested-With": "XMLHttpRequest",
//           Authorization: `Token ${localStorage.getItem("token")}`
//         },
//         body: JSON.stringify(postData)
//       }
//     );
//     const data = await res.json();
//     if (res) {
//       this.setState({
//         message: data.success_message
//       });
//       if (res.status === 200) {
//         alert("Attendance Edited");
//       }
//     }
//   };

//   handleChangeCheck = (Sap_id, id) => event => {
//     let studentsCopy = this.state.attendance[0].attendance_list;
//     if (studentsCopy[id].attendance == 1) {
//       studentsCopy[id] = { ...studentsCopy[id], attendance: 0 };
//       this.setState({
//         attendance_list: studentsCopy
//       });
//     } else {
//       studentsCopy[id] = { ...studentsCopy[id], attendance: 1 };
//       this.setState({
//         attendance_list: studentsCopy
//       });
//     }
//   };
//   handleChange = date => {
//     this.setState({
//       startDate: date
//     });
//   };

//   updateChange = async event => {
//     event.preventDefault();
//     var completeDate = this.state.startDate;
//     this.setState({
//       message: ""
//     });
//     var date = completeDate.getDate();
//     var month = completeDate.getMonth() + 1;
//     var year = completeDate.getFullYear();
//     const formattedDate = date + "-" + month + "-" + year;
//     await this.setState({
//       formattedDate
//     });
//     const res = await fetch(
//       `https://wizdem.pythonanywhere.com/Attendance/get-attendance-of-day/${
//         this.props.location.state.name
//       }/${this.props.location.state.div}/${this.state.formattedDate}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Requested-With": "XMLHttpRequest",
//           Authorization: `Token ${localStorage.getItem("token")}`
//         }
//       }
//     );
//     const data = await res.json();
//     if (res.status === 200) {
//       this.setState({
//         attendance: data.attendance
//       });
//     }
//   };

//   async componentDidMount() {
//     var completeDate = this.state.startDate;
//     var date = completeDate.getDate();
//     var month = completeDate.getMonth() + 1;
//     var year = completeDate.getFullYear();

//     const formatdDate = date + "-" + month + "-" + year;
//     await this.setState({
//       formattedDate: formatdDate
//     });

//     const res = await fetch(
//       `https://wizdem.pythonanywhere.com/Attendance/get-attendance-of-day/${
//         this.props.location.state.name
//       }/${this.props.location.state.div}/${this.state.formattedDate}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Requested-With": "XMLHttpRequest",
//           Authorization: `Token ${localStorage.getItem("token")}`
//         }
//       }
//     );

//     const data = await res.json();

//     if (res.status === 200) {
//       this.setState({
//         attendance: data
//       });
//     }
//   }

//   render() {
//     const { classes } = this.props;
//     const { attendance, message } = this.state;

//     return (
//       <div>
//         <PersistentDrawerLeft />
//         <Grid container className={classes.table}>
//           <Grid item xs={12}>
//             {attendance.length == 0 && (
//               <Typography variant="h6" style={{ marginLeft: 15 }}>
//                 No lecture today
//               </Typography>
//             )}
//           </Grid>
//         </Grid>
//         <Grid container spacing={24} style={{ padding: 12 }}>
//           <Grid item xs={12} sm={12} md={6} className={classes.attendTable}>
//             <Paper>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <CustomTableCell>SAP ID</CustomTableCell>
//                     <CustomTableCell>Name</CustomTableCell>
//                     <CustomTableCell>Time</CustomTableCell>
//                     <CustomTableCell>Edit</CustomTableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {attendance.length > 0 &&
//                     attendance[0].attendance_list.map((row, id) => (
//                       <TableRow className={classes.row} key={row.id}>
//                         <CustomTableCell component="th" scope="row">
//                           {row.sapID}
//                         </CustomTableCell>
//                         <CustomTableCell>{row.name}</CustomTableCell>
//                         <CustomTableCell>{attendance[0].time}</CustomTableCell>
//                         <CustomTableCell component="th" scope="row">
//                           <Checkbox
//                             checked={row.attendance == "1" ? true : false}
//                             onChange={this.handleChangeCheck(row.Sap_id, id)}
//                             value={row.Sap_id}
//                           />
//                         </CustomTableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </Paper>
//           </Grid>
//           <Grid item xs={12} sm={12} md={2}>
//             <Datepicker
//               startDate={this.state.startDate}
//               handleChange={this.handleChange}
//               updateChange={this.updateChange}
//             />
//           </Grid>
//           <Grid item xs={12} sm={12} md={2}>
//             <Button
//               variant="contained"
//               onClick={this.updateChange}
//               color="primary"
//             >
//               Submit Date
//             </Button>
//           </Grid>
//           <Grid item xs={12} sm={12} md={2}>
//             <Button
//               variant="contained"
//               onClick={this.handleSubmit}
//               color="primary"
//             >
//               Post Change
//             </Button>
//           </Grid>
//         </Grid>
//         {message.length > 0 && (
//           <Typography variant="h6" style={{ margin: 20 }}>
//             {message}
//           </Typography>
//         )}
//       </div>
//     );
//   }
// }

// EditPage.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// export default withStyles(styles)(EditPage);
