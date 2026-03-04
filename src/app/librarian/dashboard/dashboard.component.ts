import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from './dashboard.service';
import Chart from 'chart.js/auto';
import { catchError, map, of } from 'rxjs';

@Component({
selector:'app-dashboard',
standalone:true,
imports:[CommonModule],
templateUrl:'./dashboard.component.html',
styleUrls:['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit{

private dash = inject(DashboardService);

stats$ = this.dash.getDashboardStats().pipe(
map((res:any)=>({
books:res.books?.totalBooks ?? 0,
users:res.users?.totalUsers ?? 0,
issues:res.issues?.activeIssues ?? 0,
overdue:res.issues?.overdueIssues ?? 0
})),
catchError(()=>of({books:0,users:0,issues:0,overdue:0}))
);

ngAfterViewInit(){

new Chart('issueChart',{

type:'bar',

data:{
labels:['Books','Users','Issues','Overdue'],
datasets:[{
data:[44,7,3,0],
backgroundColor:[
'#6366f1',
'#06b6d4',
'#22c55e',
'#ef4444'
]
}]
},

options:{
plugins:{legend:{display:false}},
responsive:true,
maintainAspectRatio:false
}

});

}

}