import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';

import Place  from 'material-ui/svg-icons/maps/place';

import {Avatar, List, ListItem, Paper, Dialog,
	FlatButton, IconButton, FloatingActionButton, Divider} from 'material-ui';

import App from './app.jsx';
import TripForm from './tripForm.jsx';

import Trip from './../models/Trip';
import TripCollection from './../models/TripCollection';


const styles = {
	page:{
		position: 'relative',
		display: 'flex',
		flexFlow: 'column nowrap',
		alignItems: 'center',
		fontFamily: '"Roboto", sans-serif',
		marginTop: 22
	},
	paper:{
		maxWidth: 800,
		marginTop: 0,
		display: 'flex',
		flexFlow: 'row nowrap',
		justifyContent: 'center',
		alignItems: 'center'
	},
	linkIcon: {
		color: '#23CF5F'
	},
	iconColumn: {
		width: 80
	},
	dialog:{

	},

	dialogBody: {

	},
	dialogContent: {

	},
	direction: {
		padding: 20,
		fontWeight: 300
	}

};


var TripRow = React.createClass({

	navigate: function(){
		var id = this.props.trip.get('objectId');
		Backbone.history.navigate('#trips/' + id,{trigger:true});
	},


	render: function() {
		var trip = this.props.trip;
		var id = trip.get('objectId');
		var city = trip.get('city');
		var state = trip.get('state');
		var startDate = moment(trip.get('startDate')).format('ll');
		var endDate   = moment(trip.get('endDate')).format('ll');
		var imgUrl = trip.get('imageUrl');

    return (
      <ListItem
        primaryText={city+' '+state}
        secondaryText={startDate+' to '+endDate}
        leftAvatar={imgUrl ? <Avatar src={imgUrl}/> : <Avatar icon={<Place/>}/>}
				insetChildren={imgUrl ? false : true}
				onTouchTap={this.navigate}
      />
    );
	}
});


var Calendar = React.createClass({

  render: function() {
		var trips = this.props.trips.map(function(trip, i){
			return <TripRow
								trip={trip}
								key={i}
							/>
					}.bind(this));
		trips.unshift(
			<ListItem innerDivStyle={{padding:0}} key="3210">
				<FlatButton
					style={{width: '100%', height: '100%'}}
					label="Add a Trip"
					secondary={true}
					href="#trips/new"
				/>
			</ListItem>
		);
		var hasTrips = (trips.length > 0);
    return (
			<Paper style={styles.paper}>
				<List>{trips}</List>
			</Paper>
		);
  }

});


var CalendarContainer = React.createClass({


	getInitialState: function() {
		return {
			trips: new TripCollection(),
			state: open
		};
	},

	componentWillMount: function() {
		var trips = this.state.trips;
		var userId = localStorage.getItem('userId');
		trips.parseWhere('user','_User', userId).fetch().then(
      function(){
        this.setState({trips: trips});
      }.bind(this)
    );
    return true;
	},


	openDialog: function() {
		 this.setState({open: true});
	},

	closeDialog: function() {
		this.setState({open: false});
	},

	handleSubmit(data) {
		console.log('handlesubmit',data);
		var trip = new Trip(data);
		trip.save().done(function(data){
			var id = data.objectId;
			console.log(trip.get('user'));
			Backbone.history.navigate('trips/'+id, {trigger:true});
		}.bind(this));

	},

  render: function() {
    return (
			<App>
				<div style={styles.page}>
					{/*<h1>My Trips</h1>*/}
					<Calendar trips={this.state.trips}/>

				</div>
				<Dialog
					title="Add a Trip~"
					titleStyle={{display:'none'}}
					bodyStyle={styles.dialogBody}
					contentStyle={styles.dialogContent}
          open={(this.props.new === true)}
					autoScrollBodyContent={true}
					modal={true}
        >
					<TripForm
						handleSubmit={this.handleSubmit}
					/>
        </Dialog>
			</App>

		);
  }

});





export default CalendarContainer;