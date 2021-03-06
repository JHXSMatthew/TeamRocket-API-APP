import React,{Component} from 'react';
import {Dropdown ,DropdownToggle ,DropdownMenu,DropdownItem ,Container,ModalFooter, ModalBody, ModalHeader,Modal, Button, ListGroup,ListGroupItem,Label,Row,Col,Card,CardHeader,Input} from 'reactstrap';
import ReactTable from 'react-table';
import Select from 'react-select';
import TimePointIndicatorCharts from './TimePointIndicatorCharts.js';
import {CATEGORY_RT} from './DataAnalyzer.js';
import {CATEGORY_ME} from './DataAnalyzer.js';
import {getCategory} from './DataAnalyzer.js';
import TimePointChart from './TimePointChart.js';
import TimePointLeaderboard from './TimePointLeaderboard.js';


class TimePoint extends Component{
  constructor(props){
    super(props);
    this.state = {
      time: this.props.time,
      category: this.props.category,
      up: 5,
      low: 5,
      canUpdate: true,
      update: false,
      chartUpdate: false,
      data: null,
      currentNews: {name: "all" , instrumentId: "all"},
      companies: [],
      dropdownOpen: false
    };
    this.setUp = this.setUp.bind(this);
    this.setLow = this.setLow.bind(this);
    this.getStarting = this.getStarting.bind(this);
    this.getEnd = this.getEnd.bind(this);
    this.getDate = this.getDate.bind(this);
    this.update = this.update.bind(this);
    this.setDayOfMonth = this.setDayOfMonth.bind(this);
    this.setData = this.setData.bind(this);
    this.setCurrentNews = this.setCurrentNews.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.toggle = this.toggle.bind(this);
    this.fetchIndicators = this.fetchIndicators.bind(this);
    this.subFetchIndicators = this.subFetchIndicators.bind(this);
    this.chartUpdated = this.chartUpdated.bind(this);
    this.hold = 0;
  }




  shouldComponentUpdate(nextProps, nextState){
    return JSON.stringify(nextProps) !== JSON.stringify(this.props) || JSON.stringify(nextState) !== JSON.stringify(this.state);
  }

  componentWillReceiveProps(nextProps){
    if(this.state.companies.length != 0 && JSON.stringify(nextProps) === JSON.stringify(this.props)){
      return;
    }
    var that = this;
    var url = 'http://45.76.114.158/api/app/category/get'
    fetch( url,{
      method: 'POST',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        area: nextProps.dataType.value,
        category: nextProps.category.value,
      }),
    })
    .then(function(response) {
      if (response.status >= 400) {
        return;
      }
      return response.json().then(function (json) {
        //TODO: deal with empty data
        var a = [];
        if(json.length > 0){
          for(var i = 0 ; i < json.length ; i ++){
            if(json[i]){
              if(json[i].category === nextProps.category.value){
                a = a.concat(json[i].companies);
              }
            }
          }
        }
        if(nextProps.dataType){
          if(nextProps.category){
            if(nextProps.category.instruments){
              for(var j = 0 ; j < nextProps.category.instruments.length ; j ++){
                var contain = false;
                for(var i = 0 ; i < a.length ; i ++){
                  if(a[i].instrumentId === nextProps.category.instruments[j].instrumentId && a[i].name === nextProps.category.instruments[j].name ){
                    contain = true;
                    break;
                  }
                }
                if(!contain){
                  a.push(nextProps.category.instruments[j]);
                }
              }
            }
          }
        }
        var drop = [];

        for(i = 0 ; i < a.length ; i ++){
          drop.push({
            label: a[i].name,
            value: a[i].instrumentId
          });
        }

        that.setState({
          companies: a,
          update: true,
          chartUpdate: true,
          time: that.props.time,
          SelectOptions: drop
        })
        that.fetchIndicators();
      })

    });
  }

  chartUpdated(){
    this.setState({
      chartUpdate: false
    });
  }

  update(event){
    this.setState({
      canUpdate: false,
      update: true
    });
  }

  setUp(event){
    var v = event.target.value;
    this.setState({
      up: v,
      canUpdate: true,
      update: false
    });
  }

  setDayOfMonth(event){
    var str = this.state.time.split("-");
    if(event.target.value){
      str[2] = event.target.value;
    }
    if(event.target.value < 0 || event.target.value > daysInMonth(this.state.time.split("-")[1],this.state.time.split("-")[0])){
      return;
    }
    this.setState({
      time: getDateString(new Date(str[0],str[1],str[2])),
      canUpdate: true,
      update: false
    });
  }

  setLow(event){
    var v = event.target.value;
    this.setState({
      low: v,
      canUpdate: true,
      update: false
    });
  }

  getDate(){
    var str = this.state.time.split("-");
    return new Date(str[0],str[1] -1 ,str[2] -1);
  }

  getStarting(){
    var date=this.getDate();
    return date.setDate(date.getDate() - this.state.low);
  }

  getEnd(){
    var date=this.getDate();
    return new Date(date.getTime() + (this.state.up*24*60*60*1000));
  }

  setData(d){
    this.setState({
      data:d,
      update: false,
      chartUpdate: true
    });
  }

  toggle() {
   this.setState({
     dropdownOpen: !this.state.dropdownOpen
   });
 }

  setCurrentNews(id){
    this.setState({
      currentNews: id,
      update: false
    });
  }

  resetZoom(){
      this.chart.resetZoom();
  }

  fetchIndicators(){
    if(this.state.companies){
      this.setState(function (prevState, props) {
        return {
            indicators: []
        };
      });
      this.hold +=1;
      for(var i = 0 ; i < this.state.companies.length; i++){
        this.subFetchIndicators(this.state.companies[i].instrumentId,this.hold);
      }
    }
  }

  subFetchIndicators(companyID,localHold){
    var that = this;
    var url = 'http://45.76.114.158/api/app/indicators/get'
    fetch( url,{
      method: 'POST',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instrumentId: companyID,
        startDate: getCalDateString(that.getStarting()),
        endDate:  getCalDateString(that.getEnd())
      }),
    })
    .then(function(response) {
      if (response.status >= 400) {
        return;
      }
      return response.json().then(function (json) {
          if(localHold != that.hold){
            return;
          }
          var indicators = that.state.indicators;
          for(var i = 0 ; i < json.length ; i ++){
            var contain = false;
            for(var j = 0 ; j < indicators.length ; j ++){
              if(indicators[j].indicator === json[i].indicator){
                contain = true;
                indicators[j].data.push(json[i]);
                break;
              }
            }
            if(!contain){
              indicators.push({
                indicator: json[i].indicator,
                data: [json[i]]
              });
            }
          }
          that.setState({
            indicators: indicators,
            chartUpdate: true
          })
        })
    });
  }

  render(){
      return (
        <Container fluid={true}>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                 {this.props.category.label} Related Companies. At {this.state.time}
                </CardHeader>
                  <Row>
                    <Col>
                      <ListGroup>
                        <ListGroupItem>
                          <Col  md="3" xs="3">
                            <Label>Day of the Month</Label>
                            <Input type="number" value={parseInt(this.state.time.split("-")[2])} size="sm" placeholder="Days of the month" onChange={this.setDayOfMonth} />
                          </Col>
                          <Col  md="2" xs="2">
                            <Label>Days Before</Label>
                            <Input type="number" defaultValue="5" size="sm" placeholder="Days Before Time Point" onChange={this.setLow} />
                          </Col>
                          <Col md="2" xs="2">
                            <Label>Days After</Label>
                            <Input type="number" defaultValue="5" size="sm" placeholder="Days After Time Point" onChange={this.setUp} />
                          </Col>
                          <Col md="2" xs="2">
                            <Label> Click to Update
                            </Label>
                            <Button outline color="info" disabled={!this.state.canUpdate} onClick={this.update} >
                               Update
                            </Button>
                          </Col>
                          <Col md="2" xs="2">
                            <Label>Reset Zoom
                            </Label>
                            <Button outline color="info" onClick={this.resetZoom} >
                               Reset
                            </Button>
                          </Col>
                        </ListGroupItem>
                        <ListGroupItem>
                          <Col md="12">
                             {this.props.shouldDraw && <TimePointIndicatorCharts ref={(panel) =>{this.chart = panel;}} chartUpdated={this.chartUpdated} data={this.state.data} indicators={this.state.indicators} update={this.state.chartUpdate}/>}
                          </Col>
                        </ListGroupItem>
                      </ListGroup>
                    </Col>
                    <Col>
                        <TimePointLeaderboard data={this.state.data}/>
                    </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <CompanyReturn fetchIndicators={this.fetchIndicators} companies={this.state.companies} category={this.props.category} setCurrentNews={this.setCurrentNews} date={this.getDate} up={this.state.up} low={this.state.low} update={this.state.update} dataType={this.props.dataType} setData={this.setData}/>
            </Col>
          </Row>
        </Container>
      )
  }
}
/*
<ListGroupItem>
    <Col md="12">
      <Select
        name="The Name"
        value={this.state.currentNews}
        options={this.state.SelectOptions}
        onChange={this.setCurrentNews}
      />
    </Col>

</ListGroupItem>
<ListGroupItem>
    <News category={this.props.category} starting={this.getStarting} ending={this.getEnd} update={this.state.update} dataType={this.props.dataType} current={this.state.currentNews ? this.state.currentNews.value : "all"}/>
</ListGroupItem>
*/
function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

function labelToTopics(array,label){
    var returnValue = null;
    if(label === 'All categories'){
      returnValue = [];
      for(var i = 0 ; i < array.length ; i ++){
        if(array[i].topics){
          for(var j = 0; j < array[i].topics.length ; j ++){
            if(returnValue.indexOf(array[i].topics[j]) === -1){
              returnValue.push(array[i].topics[j]);
            }
          }
        }
      }
    }else{
      for(i = 0 ; i < array.length ; i ++){
        if(array[i].label === label){
          return array[i].topics;
        }
      }
    }
    return returnValue;
}

function getDateString(d){
  d = new Date(d);
  return d.getFullYear() + '-' +('0' + (d.getMonth() +1)).slice(-2) + '-' + ('0'+ (d.getDate() )).slice(-2);
}

function getCalDateString(d){
  d = new Date(d);
  return d.getFullYear() + '-' +('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0'+ (d.getDate())).slice(-2);
}




function labelToInstruments(array,label){
    var returnValue = null;
    if(label === 'All categories'){
      returnValue = [];
      for(var i = 0 ; i < array.length ; i ++){
        if(array[i].instruments){
          for(var j = 0; j < array[i].instruments.length ; j ++){
            if(!returnValue.indexOf(array[i].instruments[j])>= 0){
              returnValue.push(array[i].instruments[j]);
            }
          }
        }
      }
    }else{
      for(i = 0 ; i < array.length ; i ++){
        if(array[i].label === label){
          return array[i].instruments;
        }
      }
    }
    return returnValue;
}


class CompanyReturn extends Component{
  constructor(props){
    super(props);
    this.state = {
      table: []
    }
    this.hold = 0;
  }
/*
  componentWillMount(){
    this.fetch(true,this.props.dataType,this.props.companies);
  }
*/
  componentWillReceiveProps(nextProps){
    if(!nextProps.update){
      return;
    }
    this.setState(function (prevState, props) {
      return {
          table: []
      };
    });
    this.props.fetchIndicators();
    this.props.setData([]);
    this.hold = this.hold+1;
    for(var i = 0 ; i < nextProps.companies.length ; i ++){
      this.fetch(false,nextProps.dataType,nextProps.companies[i],this.hold);
    }
  }


  fetch(a,dataType,companies,hold){

    var that = this;
    var id = companies.instrumentId;
    var name = companies.name;
    if(!id || !getDateString(this.props.date()) || !that.props.up || !that.props.low){
      return;
    }
    var proxy = "https://cors-anywhere.herokuapp.com/";

   //Alvin's frined's API,
   //url = "http://128.199.197.216:3000/v5/id="+ id
    //    +  "&dateOfInterest="+ getDateString(this.props.date())
  //      +  "&listOfVars=AV_Return;CM_Return&upperWindow="+ this.props.up
  //      +  "&lowerWindow=" + this.props.low;

  //  if(a){
       // seesharp's API
  //     var url  = "http://174.138.67.207/InstrumentID/"+ id
  //         +  "/DateOfInterest/"+ getDateString(this.props.date())
  //        +  "/List_of_Var/CM_Return,AV_Return/Upper_window/"+ this.props.up
  //       +  "/Lower_window/" + this.props.low;
  //  }    var url = 'http://45.76.114.158/api/app/indicators/get'

    var url = "http://45.76.114.158/api/app/companyReturn/get";
    try{
      fetch( url,{
        headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          id: id,
          dateOfInterest: getDateString(that.props.date()),
          upperWindow: that.props.up,
          lowerWindow: that.props.low
        }),
      })
      .then(function(response) {
        if (response.status >= 400) {
          if(!a){
            that.fetch(true,dataType,companies,hold);
          }
          return;
        }
        return response.json().then(function (json) {
          if(that.hold != hold){
            return;
          }
          for(var i = 0 ; i < json.length ; i++ ){
            json[i].name = name;
            var av = 0;
            for(var j = 0 ; j < json[i].dateValues.length ; j ++){
              av += json[i].dateValues[j].AV_Return;
              json[i].dateValues[j].AV_Return *= 100 ;
              json[i].dateValues[j].AV_Return = parseFloat(json[i].dateValues[j].AV_Return).toFixed(7);

              json[i].dateValues[j].CM_Return *= 100 ;
              json[i].dateValues[j].CM_Return = parseFloat(json[i].dateValues[j].CM_Return).toFixed(7);
              json[i].dateValues[j].value = json[i].dateValues[j].CM_Return;

              json[i].dateValues[j].Return *= 100 ;
              json[i].dateValues[j].Return = parseFloat(json[i].dateValues[j].Return).toFixed(7);
            }
            json[i].AV_Return = parseFloat(av/json[i].dateValues.length * 100).toFixed(7) ;
            json[i].Get = <NewsFilter id={json[i].InstrumentID} setCurrentNews={that.props.setCurrentNews}/>
            json[i].Click = <NewsArticle article={"https://au.finance.yahoo.com/chart/"+id}/>

          }
          json = that.state.table.concat(json);
          that.setState({
            table: json
          });
          that.props.setData(json);
        })
      });
    }catch(e){
      if(!a){
        that.fetch(true,dataType,companies);
      }
    }


  }

  render(){
      const compnayName = [{
        header: 'Company',
        accessor: 'name' // String-based value accessors!
      }, {
        header: 'InstrumentID',
        accessor: 'instrumentID',
      }, {
        header: 'Average Return (%)',
        accessor: 'AV_Return',
      },{
        header: 'Stock Detail',
        accessor: 'Click',
        maxWidth: 100
      }
    ];
      const compnayDetail = [{
        header: 'Date',
        accessor: 'Date' // String-based value accessors!
      }, {
        header: 'Return (%)',
        accessor: 'Return',
      }, {
        header: 'Average Return (%)',
        accessor: 'AV_Return',
      }, {
        header: ' Cumulative Return (%)',
        accessor: 'CM_Return',
      }
    ];
    //              showPagination={false}
    return(
      <Card>
        <CardHeader>
          Data Set
        </CardHeader>
          <Col md="12" xs="12">
            <ReactTable
              data={this.state.table}
              columns={compnayName}
              defaultPageSize={5}
              noDataText='Loading...'
              pageSize={(this.state.table &&  this.state.table.length) ?  this.state.table.length : 7}
              SubComponent={(row) => {
                return(
                  <ReactTable
                    data={row.row.dateValues}
                    columns={compnayDetail}
                    defaultPageSize={10}
                  />
                )
              }}
            />
          </Col>
      </Card>
    )
  }

}



class NewsFilter extends Component{
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.setCurrentNews(this.props.id);
  }

  render() {
    return (
        <Button color="info" onClick={this.toggle}>Get</Button>
    );
  }
}



class News extends Component{

  constructor(props){
    super(props);
    this.state = {
      table: []
    }

  }
  componentWillMount(){
    this.fetch(this.props.current);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.current === this.props.current){
      return;
    }
    this.setState({table: []});
    this.fetch(nextProps.current);
  }

  fetch(id){
    var that = this;
  //http://174.138.67.207/InstrumentID/ABP.AX,AAPL/DateOfInterest/2012-12-10/List_of_Var/CM_Return,AV_Return/Upper_window/5/Lower_window/3
    var topics = null;



    var proxy = "https://api.rss2json.com/v1/api.json?api_key=avgsmuavpridvqg25b9tfq3yxmpvsihy7tevv0b5&rss_url=";
    //Cool banananananan's news API
    //var urlTopics = 'https://nickr.xyz/coolbananas/api/?TopicCodes='+ topics.join() +'&StartDate='
    //+ getDateString(this.props.starting()) +'T00:00:00.000Z&EndDate='+ getDateString(this.props.ending()) +'T00:00:00.000Z';
    //var urlTopics = "https://nickr.xyz/coolbananas/api/?InstrumentIDs=BHP.AX,BLT.L&TopicCodes=AMERS,COM&StartDate=2015-10-01T00:00:00.000Z&EndDate=2015-10-10T00:00:00.000Z";
    var url = "http://finance.yahoo.com/rss/headline?s=" + id
    //console.log("News True URL: " + url);

    fetch( proxy + url,{
      method: 'GET',
    })
    .then(function(response) {
      if (response.status >= 400) {
        return;
      }
      return response.json().then(function (json) {
        json = json.items;
        for(var i = 0 ; i < json.length ; i ++){
          json[i].button = <NewsArticle title={json[i].title} article={json[i].link} />
        }

        that.setState({
          table: json
        });
      })

    });



  }

  render(){
    const newsTable = [{
      header: 'News Title',
      accessor: 'title',
      Cell: props=><span> {props.value} </span>
    },{
      header: 'Time',
      accessor: 'pubDate', // String-based value accessors!
      maxWidth: 200
    },{
      header: 'Article',
      accessor: 'button',
      maxWidth: 100
    }];
    return(
        <Col md="12" xs="12">
          <ReactTable
            data={this.state.table}
            columns={newsTable}
            defaultPageSize={7}
            noDataText='Loading...'
          />
      </Col>
    );

  }
}

class NewsAbstraction extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>

      </div>
    );
  }


}

class NewsArticle extends Component{
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    window.open(this.props.article);
  }

  render() {
    return (
      <div>
        <Button color="info" onClick={this.toggle}>View</Button>
      </div>
    );
  }
}




export default TimePoint;
