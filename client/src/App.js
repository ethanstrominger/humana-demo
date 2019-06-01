import React, { Component } from 'react';

import {
  createQuestionRequest,
  deleteByIdsReqest,
  deleteAllRequest,
  getQuestionDataToRender,
  productQueryRequest
} from './AppRequests';
const MAX_QUESTIONS_TO_DISPLAY = 10;
const MAX_QUESTIONS_TO_FETCH = 100;
class App extends Component {
  state = {
    hasDataBeenQueried: 'N',
    productQueryValue: null,
    displayData: [],
    fetchDataCount: 0,
    id: 0,
    message: null,
    codeToAdd: null,
    nameToAdd: null,
    doseToAdd: null,
    number_of_pillsToAdd: null,
    perdayToAdd: null,
    fetchQuestionContains: null,
    idsToDelete: null,
    fdaResults: []
  };

  handleCreateQuestion = async () => {
    let response = await createQuestionRequest(
      this.state.codeToAdd,
      this.state.nameToAdd,
      this.state.doseToAdd,
      this.state.number_of_pillsToAdd,
      this.state.perdayToAdd
    );
    this.showResponse(response);
    this.handleGetDataFromDb();
  };

  handleDeleteAll = async () => {
    await deleteAllRequest();
    this.handleGetDataFromDb();
  };

  handleDeleteDisplayedRecs = async () => {
    let displayData = this.state.displayData;
    let idsToDelete = [];
    for (let x = 0; x < displayData.length; x++) {
      idsToDelete.push(displayData[x]._id);
    }
    let response = await deleteByIdsReqest(idsToDelete);
    this.showResponse(response);
    this.handleGetDataFromDb();
  };

  handleGetDataFromDb = async () => {
    const questionData = await getQuestionDataToRender(
      this.state.fetchQuestionContains
    );
    let questionDataDisplay = questionData.slice(0, MAX_QUESTIONS_TO_DISPLAY);
    this.setState({ displayData: questionDataDisplay });
    this.setState({ fetchDataCount: questionData.length });
  };

  handleProductQuery = async () => {
    const response = await productQueryRequest(this.state.productQueryValue);
    let fdaResults = response.results;
    if (fdaResults) {
      this.setState({ fdaResults: fdaResults });
    }
    // this.showResponse(response);
    // this.handleGetDataFromDb();
  };

  showResponse = response => {
    if (!response.success) {
      let message = response.message;
      if (response.errorDetail) {
        console.log('Full error: ' + response.errorDetail);
        message = message + '  See console log for more detail.';
      }
      alert('Failed : ' + message);
    }
  };

  render() {
    if (this.state.hasDataBeenQueried === 'N') {
      this.handleGetDataFromDb();
      this.setState({ hasDataBeenQueried: 'Y' });
    }
    const displayData = this.state.displayData;
    const fdaResults = this.state.fdaResults;
    const titleStyle = { color: 'blue' };
    const displayCount = displayData.length;
    const fetchCount = this.state.fetchDataCount;
    const countMessage =
      displayCount +
      ' records displayed' +
      (fetchCount > MAX_QUESTIONS_TO_DISPLAY
        ? ' out of ' + fetchCount + ' records'
        : '') +
      (fetchCount >= MAX_QUESTIONS_TO_FETCH ? ' or more' : '');
    return (
      <div>
        <ul id='Count-display'>
          <p>{countMessage}</p>
        </ul>
        <ul id='Display-records'>
          {displayData.length <= 0
            ? 'NO DB ENTRIES YET'
            : displayData.map(dat => (
                <p style={{ 'line-height': 1.0 }} key={dat._id}>
                  <span style={titleStyle}> id: </span> {dat._id}
                  <span style={titleStyle}> text: </span> {dat.code}
                  <span style={titleStyle}> name: </span> {dat.name}{' '}
                  <span style={titleStyle}> dose: </span> {dat.dose}
                  <span style={titleStyle}> number_of_pills: </span>{' '}
                  {dat.number_of_pills}
                  <span style={titleStyle}> perday: </span> {dat.perday}
                </p>
              ))}
        </ul>
        <div id='Fetch-delete' style={{ padding: '10px' }}>
          name contains:
          <input
            placeholder='Name contains'
            type='text'
            onChange={e =>
              this.setState({ fetchQuestionContains: e.target.value })
            }
            style={{ width: '200px' }}
          />
          <button
            id='Fetch-del.FetchButton'
            onClick={() => this.handleGetDataFromDb()}
          >
            FETCH
          </button>
          <button
            id='Fetch-del.DeleteButton'
            onClick={() =>
              this.handleDeleteDisplayedRecs(this.state.idsToDelete)
            }
          >
            DELETE
          </button>
        </div>
        <div id='Add' style={{ padding: '10px' }}>
          code:
          <input
            id='Add.question-text'
            placeholder='Code to Add'
            type='text'
            onChange={e => this.setState({ codeToAdd: e.target.value })}
            style={{ width: '200px' }}
          />
          <br />
          name:
          <input
            id='Add.name'
            placeholder='name'
            type='text'
            onChange={e => this.setState({ nameToAdd: e.target.value })}
            style={{ width: '200px' }}
          />
          <br />
          dose in mg:
          <input
            id='Add.dose'
            placeholder='dose'
            type='text'
            onChange={e => this.setState({ doseToAdd: e.target.value })}
            style={{ width: '200px' }}
          />
          <br />
          dose as # of pills:
          <input
            id='Add.number_of_pills'
            placeholder='number_of_pills'
            type='text'
            onChange={e =>
              this.setState({ number_of_pillsToAdd: e.target.value })
            }
            style={{ width: '200px' }}
          />
          <br />
          doses per day:
          <input
            id='Add.perday'
            placeholder='perday'
            type='text'
            onChange={e => this.setState({ perdayToAdd: e.target.value })}
            style={{ width: '200px' }}
          />
          <br />
          <button onClick={() => this.handleCreateQuestion()}>ADD</button>
        </div>
        <div id='product-query' style={{ padding: '10px' }}>
          <br />
          lookup by product name:
          <input
            placeholder='product name'
            type='text'
            onChange={e => this.setState({ productQueryValue: e.target.value })}
            style={{ width: '200px' }}
          />
          <button
            id='product-query.LoadButton'
            onClick={() => this.handleProductQuery()}
          >
            QUERY
          </button>
        </div>
        <ul id='Display-records'>
          {fdaResults.length <= 0
            ? 'NO FDA RESULTS YET'
            : fdaResults.map(dat2 => (
                <p style={{ 'line-height': 1.0 }}>
                <span style={titleStyle}> NDC: </span>{' '}
                {dat2.product_ndc}

                <span style={titleStyle}> Comp: </span>{' '}
                {dat2.labeler_name}
                <span style={titleStyle}> Form: </span>{' '}
                {dat2.dosage_form}
                <span style={titleStyle}> G: </span>{' '}
                {dat2.generic_name}
                  <span style={titleStyle}> Brand: </span>{' '}
                  {dat2.brand_name}
                  <span style={titleStyle}> Ing: </span>{' '}
                  {dat2.active_ingredients[0].name} {dat2.active_ingredients[0].strength}
                </p>
              ))}
        </ul>
      </div>
    );
  }
}

export default App;
