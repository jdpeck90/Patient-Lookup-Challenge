import React, { Component, Fragment } from "react";
import axios from 'axios';
import ReactTable from 'react-table';
import BodyCopy from './BodyCopy'

import './SearchForm.scss';

import 'react-table/react-table.css';


const SERVICE_ROOT = 'https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca';
const COLUMNS = [
  { Header: 'Condition Name', accessor: (c) => c.resource.code.text, id: 'conditionName' },
  { Header: 'Condition Date', accessor: (c) => c.resource.dateRecorded, id: 'conditionDate' },
  { Header: 'More Information', accessor: (c) => <ConditionLink condition={c} />, id: 'moreInformation'}
];
const TABLE_PROPS = {
  columns: COLUMNS,
  className: 'patient-conditions',
  defaultSorted: [
    {id: 'dateRecorded', desc: true}
  ],
  noDataText: 'No patient conditions found.'
}

function ConditionLink({ condition }) {
  const conditionName = condition.resource.code.text;
  const url = `https://www.ncbi.nlm.nih.gov/pubmed/?term=${encodeURIComponent(conditionName)}`;

  return (
    <a href={url} target="_blank" title={`Search "${conditionName}"`}>
      Search PubMed
    </a>
  );
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      patientExist: false,
      patientData: [],
      conditions: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.cancelCourse = this.cancelCourse.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    const patientID = this.state.value;

      axios.get(`${SERVICE_ROOT}/Patient/${patientID}`,{
        params: {
          Accept: 'application/json+fhir'
        }
      }).then((response) => {
            const {
                data: { birthDate, name, gender, id }
            } = response;
            const nameConstructor = name;
            const patientName = `${nameConstructor[0].given}  ${
                nameConstructor[0].family
                }`;
            const patientBirth = birthDate;
            const patientGender = gender;
            const patientData = [patientName, patientBirth, patientGender];
            this.setState({
              patientData,
              patientExist: true
            })
        })
        .catch((error) => {
          // Rethrow an interpreted error
          console.log(error)
        })

        axios.get(`${SERVICE_ROOT}/Condition?patient=${patientID}`,{
          params: {
            Accept: 'application/json+fhir'
          }
        }).then((response) => {
          const {data: { entry } } = response;
          const conditions = entry;

          this.setState({conditions})

       }).catch((error) => {
          // Console Error
          console.log(error)
        })
      }

   cancelCourse = () => { 
    this.setState({
      value: ""
    });
  }

  render() {
    const { patientExist, patientData, conditions} = this.state;
    const [ patientName, patientBirth, patientGender ] = patientData;
    
    return (
      <Fragment>
        <form className="patient-form" onSubmit={this.handleSubmit} >
          <label>
            Patient Id:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
           <input type="button" value="Reset" onClick={this.cancelCourse} />
        </form>

        {patientExist && <div>  
                            <div className="patient-information">
                              <span><BodyCopy text="Name:" size="s"/> <BodyCopy text={`${patientName}`} size="s"/></span>
                              <span><BodyCopy text="Date Of Birth:" size="s"/><BodyCopy text={`${patientBirth}`} size="s"/></span>
                              <span><BodyCopy text="Gender:" size="s"/><BodyCopy text={`${patientGender}`} size="s"/></span>
                            </div>
                        </div>}
        {conditions && (
            <ReactTable data={conditions} {...TABLE_PROPS} />
          )}

      </Fragment>
    );
  }
}

export default SearchForm;