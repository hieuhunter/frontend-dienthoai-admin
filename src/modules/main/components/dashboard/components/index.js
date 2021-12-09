import Breadcrumb from 'common/components/Breadcrumb/components';
import Card from 'common/components/Card/components';
import moment from 'moment';
import React from 'react';
import { Bar } from 'react-chartjs-2';

const rand = () => Math.floor(Math.random() * 255);
const today = moment();
const res = Array(7)
	.fill()
	.map(() => today.subtract(1, 'd').format('DD'));
console.log(res);

const data = {
	labels: res,
	datasets: [
		{
			type: 'line',
			label: 'Dataset 1',
			borderColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
			borderWidth: 2,
			fill: false,
			data: [5, 7, 8, 9, 15, 50, 10]
		},
		{
			type: 'bar',
			label: 'Dataset 2',
			backgroundColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
			data: [5, 7, 8, 9, 15, 50, 10],
			borderColor: 'white',
			borderWidth: 2
		}
	]
};

const options = {
	scales: {
		yAxes: [
			{
				ticks: {
					beginAtZero: true
				}
			}
		]
	}
};

const rand3 = () => Math.round(Math.random() * 20 - 10);

const data2 = {
	labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
	datasets: [
		{
			type: 'line',
			label: 'Dataset 1',
			borderColor: 'rgb(54, 162, 235)',
			borderWidth: 2,
			fill: false,
			data: [rand3(), rand3(), rand3(), rand3(), rand3(), rand3()]
		},
		{
			type: 'bar',
			label: 'Dataset 2',
			backgroundColor: 'rgb(255, 99, 132)',
			data: [rand3(), rand3(), rand3(), rand3(), rand3(), rand3(), rand3()],
			borderColor: 'white',
			borderWidth: 2
		},
		{
			type: 'bar',
			label: 'Dataset 3',
			backgroundColor: 'rgb(75, 192, 192)',
			data: [rand3(), rand3(), rand3(), rand3(), rand3(), rand3(), rand3()]
		}
	]
};

const DashboardComponent = () => {
	return (
		<>
			<div className="content-header py-3">
				<Breadcrumb>Dashboard</Breadcrumb>
			</div>
			<div className="content-body">
				<div className="row">
					<div className="col-sm-6">
						<Card header="Crazy Chart">
							<Bar data={data} options={options} />
						</Card>
					</div>
					<div className="col-sm-6">
						<Card header="MultiType Chart">
							<Bar data={data2} />
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardComponent;
