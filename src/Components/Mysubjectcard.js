import React , {useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Grid, Button, CardContent } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CreateIcon from '@material-ui/icons/Create';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import {Link,Redirect} from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Datepicker from './Datepicker';
import { useDownloadHttp } from '../hooks/downloadHttp';
var Save_as = require('file-saver');

//import './style.css'

const styles = theme => ({

  card: {
    height: 250,
  },
  content: {
    padding: 2
  },
  button: {
    margin: theme.spacing.unit*0.8,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit,

  },
  rightIcon: {
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
  },
});

const Mysubjectcard = (props) =>{

  const [startDate,setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [formattedDateStart, setFormattedStartDate] = useState('');
  const [formattedDateEnd, setFormattedDateEnd] = useState('');
  const [selectedDiv,setSelectedDiv] = useState('');
  const [selectedSubject,setSelectedSubject] = useState({});
  const [open, setOpen] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);

  const [downloadCall] = useDownloadHttp();

  const handleChange = (date) => {
    setStartDate(date);
  }
  const handleChangeEnd = (date) => {
    setEndDate(date);
  }

  const downloadHandler = (subject, div) => {
    console.log(subject);
    var startcompleteDate=startDate;
    var startdate=startcompleteDate.getDate();
    var startmonth =startcompleteDate.getMonth()+1;
    var startyear = startcompleteDate.getFullYear();
    var endcompleteDate=endDate;
    var enddate=endcompleteDate.getDate();
    var endmonth =endcompleteDate.getMonth()+1;
    var endyear = endcompleteDate.getFullYear();
    const formatdDatestart = startdate + "-" + startmonth + "-" + startyear;
    const formatdDateend = enddate + "-" + endmonth + "-" + endyear;
    setFormattedStartDate(formatdDatestart);
    setFormattedDateEnd(formatdDateend);
    downloadCall(`https://wizdem.pythonanywhere.com/Attendance/get_csv/${selectedSubject}/${selectedDiv}/${formatdDatestart}/${formatdDateend}`) 
  }
  const handleOpen = (subject) =>{
    console.log(subject);
    setSelectedDiv(subject.div);
    setSelectedSubject(subject);
    setOpen(true);
  }

  const handleClickDownload =(subject)=>{
    console.log(subject);    
    setSelectedDiv(subject.div);
    setSelectedSubject(subject.name);
    setOpenDownload(true);
  }

  const handleClose = () =>{
    setOpen(false);
  }

  const handleCloseDownload = () =>{
    setOpenDownload(false);
  }
  
    const { classes } = props;
    return (
      <div>
      <Grid container spacing={16}>
      {props.taught_subjects.map((subject) => {
        return(
        <Grid item xs={12} sm={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" gutterBottom className={classes.content}><b>{subject.name}</b></Typography>
              <Typography variant="h6" gutterBottom className={classes.content}>Semester{subject.semester}</Typography>
              <Typography variant="title" gutterBottom className={classes.content}>{subject.subjectCode}</Typography>
              <Typography variant="title" gutterBottom className={classes.content}>{subject.div}</Typography>

            </CardContent>
            <CardActions disableActionSpacing>
              <Button variant="contained" color="primary" className={classes.button} onClick={handleClickDownload.bind(this,subject)}>
                Download
                <CloudDownloadIcon className={classes.rightIcon} />
              </Button>

              <Dialog
                open={openDownload}
                onClose={handleCloseDownload}
                aria-labelledby="form-dialog-title"
                variant="outlined"
                style={{padding: 20}}
                >
                <div style={{display: 'flex'}}> 
                <DialogTitle id="form-dialog-title" style={{flexGrow: 1}}>
                  SELECT Dates
                </DialogTitle>
                <Button  onClick={handleCloseDownload} color="primary" style={{padding:'10px'}}>
                  close
                </Button>
                </div>
                <DialogActions>
                  <Grid container spacing={24} style={{padding: 10}}>
                    <Grid item xs={12} sm={12} md={4} >
                      <Datepicker startDate={startDate} handleChange={handleChange}  />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                      <Datepicker startDate={endDate} handleChange={handleChangeEnd} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                      <Button  onClick={downloadHandler.bind(this,subject.name,subject.div)} color="primary" variant="contained" style={{padding:'10px'}}>
                        Download
                      </Button>
                    </Grid>
                    </Grid> 
                  </DialogActions>
                </Dialog>
                
             <Button variant="contained" color="primary" className={classes.button} onClick={handleOpen.bind(this,subject)}>
                View
                <RemoveRedEyeIcon className={classes.rightIcon} />
              </Button>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <div style={{display: 'flex'}}> 
                <DialogTitle id="form-dialog-title" style={{flexGrow: 1}}>
                  SELECT VIEWS
                </DialogTitle>
                <Button  onClick={handleClose} color="primary" style={{padding:'10px'}}>
                      close
                </Button>
                </div>
                <DialogActions>
                  <Link to={{pathname:`/attendanceTable/${selectedDiv}`, state:selectedSubject}} style={{textDecoration:'none'}}>
                    <Button variant="contained" color="primary" className={classes.button}>
                      View single date
                    </Button>
                    </Link>
                  <Link to={{pathname:`/attendanceTable/range/${selectedDiv}`, state:selectedSubject}} style={{textDecoration:'none'}}>
                      <Button variant="contained" color="primary" className={classes.button}>
                        View range date
                      </Button>
                  </Link> 
                </DialogActions>
              </Dialog>

              <Link to={{pathname:`/editTable/${subject.div}`, state:subject}} style={{textDecoration:'none'}}>
                <Button variant="contained" color="primary" className={classes.button}>
                  Edit
                  <CreateIcon className={classes.rightIcon} />
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      )})}
      </Grid>
      </div>
    );
  }

Mysubjectcard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Mysubjectcard);