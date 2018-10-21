import React, { Component, PropTypes } from "react";
// import Controls from "../components/Controls";
import { connect } from "react-redux";
import axios from "axios";
import _ from "lodash";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "Recharts";

import { Tabs, Table, Input, Select, Icon } from "antd";

import {
  ButtonGroup,
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Button
} from "react-bootstrap";

export class PopulationContainer extends Component {
  static propTypes = {
    form: PropTypes
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      dataSource: [],
      sex: "male",
      country: "United Kingdom",
      date: "2001-05-11",
      age: "49"
    };
  }

  getPopulationByPredefinedAge = () => {
    let base_url = "http://api.population.io:80";

    axios
      .get(`http://api.population.io:80/1.0/population/1980/aged/18/`)
      .then(response => {
        console.log("response", response);

        let populationData = response.data;
        let malesInSlovak = _.map(populationData, "males");
        let femalesInSlovak = _.map(populationData, "males");
        console.log("malesInSlovak", malesInSlovak);
        this.setState({
          dataSource: response.data,
          males: malesInSlovak
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getPopulationByPredefinedAge();
  }

  tabsCallback = key => {
    console.log(key);
  };

  handleSubmit = event => {
    event.preventDefault();
    const { sex, country, date, age } = this.state;

    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFToken";

    console.log(sex, country, date, age);
    let remaining_life_expectancy = {
      sex: sex,
      country: country,
      date: date,
      age: age
    };
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        crossDomain: true
      }
    };
    axios
      .post(
        `http://api.population.io:80/1.0/life-expectancy/remaining/` +
          sex +
          "/" +
          country +
          "/" +
          date +
          "/" +
          age +
          "/",
        axiosConfig
      )
      .then(response => {
        console.log("response", response);

        // this.setState({
        //   dataSource: response.data
        // });
      })
      .catch(error => {
        console.log(error);
      });

    // axios({
    //   url:
    //     `http://api.population.io:80/1.0/life-expectancy/remaining/` +
    //     sex +
    //     `/` +
    //     country +
    //     `/` +
    //     date +
    //     `/` +
    //     age +
    //     `/`,
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // })
    //   .then(response => {
    //     console.log("response", response);

    //     // this.setState({
    //     //   dataSource: response.data
    //     // });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  };

  render() {
    // const { getFieldDecorator } = this.props.form;
    const { dataSource } = this.state;
    // const FormItem = Form.Item;
    // const Option = Select.Option;

    const TabPane = Tabs.TabPane;

    const columns = [
      {
        title: "females",
        dataIndex: "females",
        key: "females"
      },
      {
        title: "males",
        dataIndex: "males",
        key: "males"
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age"
      },
      {
        title: "country",
        dataIndex: "country",
        key: "country"
      }
    ];

    return (
      <div className="tab-container">
        <Tabs defaultActiveKey="1" onChange={this.tabsCallback}>
          <TabPane tab="Table" key="1">
            <div>
              <Table dataSource={dataSource} columns={columns} />
            </div>
          </TabPane>
          <TabPane tab="Chart" key="2">
            <BarChart
              width={600}
              height={300}
              data={dataSource}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="males" fill="#8884d8" />
              <Bar dataKey="country" fill="#82ca9d" />
            </BarChart>
          </TabPane>
          <TabPane tab="Calculate" key="3">
            <div>
              <form className="tab-form-container" onSubmit={this.handleSubmit}>
                <label>Sex:</label>
                <input
                  type="text"
                  value={this.state.sex}
                  onChange={e => this.setState({ sex: e.target.value })}
                />

                <label>Country:</label>
                <input
                  type="text"
                  value={this.state.country}
                  onChange={e => this.setState({ country: e.target.value })}
                />

                <label>Date:</label>
                <input
                  type="text"
                  value={this.state.date}
                  onChange={e => this.setState({ date: e.target.value })}
                />

                <label>Age:</label>
                <input
                  type="text"
                  value={this.state.age}
                  onChange={e => this.setState({ age: e.target.value })}
                />

                <input type="submit" value="Submit" />
              </form>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    increment: () => {
      dispatch(incrementNum());
    },
    decrement: () => {
      dispatch(decrementNum());
    },
    resetCount: payload => {
      dispatch(resetCounter(payload));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(PopulationContainer);
